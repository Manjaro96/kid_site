import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { commerceApi } from "../api/commerce";

const DEFAULT_FILTERS = {
  collectionHandle: "",
  rarity: "",
  availability: "all",
  minPrice: "",
  maxPrice: ""
};

export function useCommerce() {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });
  const [collectionMeta, setCollectionMeta] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [cart, setCart] = useState(null);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCartBusy, setIsCartBusy] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [cartError, setCartError] = useState("");
  const deferredFilters = useDeferredValue(filters);

  useEffect(() => {
    const controller = new AbortController();

    Promise.allSettled([
      commerceApi.getCollections(controller.signal),
      (() => {
        const cartId = commerceApi.getStoredCartId();
        return cartId ? commerceApi.getCart(cartId, controller.signal) : Promise.resolve(null);
      })()
    ])
      .then(([collectionsResult, cartResult]) => {
        startTransition(() => {
          setCollections(collectionsResult.status === "fulfilled" ? collectionsResult.value.items : []);
          setCart(cartResult.status === "fulfilled" ? cartResult.value : null);
        });
        if (cartResult.status === "rejected") {
          commerceApi.storeCartId("");
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setIsLoadingCatalog(true);
      setCatalogError("");

      commerceApi
        .getCatalog({ ...deferredFilters, first: 12 }, controller.signal)
        .then((result) => {
          startTransition(() => {
            setProducts(result.products);
            setPageInfo(result.pageInfo);
            setCollectionMeta(result.collection);
          });
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            return;
          }

          startTransition(() => {
            setProducts([]);
            setPageInfo({ hasNextPage: false, endCursor: null });
            setCollectionMeta(null);
            setCatalogError(error.message || "Commerce service unavailable");
          });
        })
        .finally(() => {
          setIsLoadingCatalog(false);
        });
    }, 150);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [deferredFilters]);

  const rarityOptions = useMemo(() => {
    const seen = new Set();

    return products
      .map((item) => item.card.rarity)
      .filter(Boolean)
      .filter((rarity) => {
        if (seen.has(rarity)) {
          return false;
        }
        seen.add(rarity);
        return true;
      })
      .map((rarity) => ({ label: rarity, value: rarity }));
  }, [products]);

  const ensureCart = async () => {
    if (cart?.id) {
      return cart;
    }

    const nextCart = await commerceApi.createCart();
    commerceApi.storeCartId(nextCart?.id || "");
    setCart(nextCart);
    return nextCart;
  };

  const addToCart = async (variantId) => {
    setCartError("");
    setIsCartBusy(true);

    try {
      const activeCart = await ensureCart();
      const nextCart = await commerceApi.addToCart(activeCart.id, variantId, 1);
      commerceApi.storeCartId(nextCart?.id || "");
      setCart(nextCart);
      return nextCart;
    } catch (error) {
      setCartError(error.message || "Commerce service unavailable");
      throw error;
    } finally {
      setIsCartBusy(false);
    }
  };

  const updateCartLine = async (lineId, quantity) => {
    if (!cart?.id) {
      return null;
    }

    setCartError("");
    setIsCartBusy(true);

    try {
      const nextCart = await commerceApi.updateCartLine(cart.id, lineId, quantity);
      commerceApi.storeCartId(nextCart?.id || "");
      setCart(nextCart);
      return nextCart;
    } catch (error) {
      setCartError(error.message || "Commerce service unavailable");
      throw error;
    } finally {
      setIsCartBusy(false);
    }
  };

  const loadMore = async () => {
    if (!pageInfo.hasNextPage || !pageInfo.endCursor || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setCatalogError("");

    try {
      const result = await commerceApi.getCatalog({
        ...filters,
        first: 12,
        after: pageInfo.endCursor
      });

      startTransition(() => {
        setProducts((current) => [...current, ...result.products]);
        setPageInfo(result.pageInfo);
      });
    } catch (error) {
      setCatalogError(error.message || "Commerce service unavailable");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    collections,
    products,
    pageInfo,
    collectionMeta,
    filters,
    rarityOptions,
    cart,
    isLoadingCatalog,
    isLoadingMore,
    isCartBusy,
    catalogError,
    cartError,
    setFilters,
    addToCart,
    updateCartLine,
    removeCartLine: (lineId) => updateCartLine(lineId, 0),
    loadMore
  };
}
