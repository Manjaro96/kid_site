const COMMERCE_ENDPOINT = "/api/commerce";

const STORAGE_KEY = "ticg.shopify.cartId";

const parseJson = async (response) => {
  const payload = await response.json();

  if (!response.ok || payload.error) {
    throw new Error(payload.error || "Commerce service unavailable");
  }

  return payload.data;
};

const requestCommerce = async (operation, variables = {}, signal) => {
  const response = await fetch(COMMERCE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ operation, variables }),
    signal
  });

  return parseJson(response);
};

const mapMoney = (money) => ({
  amount: Number.parseFloat(money?.amount ?? "0") || 0,
  currencyCode: typeof money?.currencyCode === "string" ? money.currencyCode : "USD"
});

const mapImage = (image) =>
  image
    ? {
        url: image.url,
        altText: image.altText || "",
        width: image.width ?? null,
        height: image.height ?? null
      }
    : null;

const getRarity = (product) => {
  const metafieldValue = typeof product?.rarityMetafield?.value === "string" ? product.rarityMetafield.value.trim() : "";
  if (metafieldValue) {
    return metafieldValue;
  }

  const tag = Array.isArray(product?.tags)
    ? product.tags.find((item) => typeof item === "string" && item.toLowerCase().startsWith("rarity:"))
    : "";

  return tag ? tag.split(":").slice(1).join(":").trim() : "";
};

const mapProduct = (product) => ({
  id: product.id,
  handle: product.handle,
  title: product.title,
  description: product.description || "",
  rarity: getRarity(product),
  featuredImage: mapImage(product.featuredImage),
  images: Array.isArray(product.images?.nodes) ? product.images.nodes.map(mapImage).filter(Boolean) : [],
  priceRange: {
    min: mapMoney(product.priceRange?.minVariantPrice),
    max: mapMoney(product.priceRange?.maxVariantPrice)
  },
  variants: Array.isArray(product.variants?.nodes)
    ? product.variants.nodes.map((variant) => ({
        id: variant.id,
        title: variant.title || "Default",
        availableForSale: Boolean(variant.availableForSale),
        image: mapImage(variant.image),
        price: mapMoney(variant.price),
        selectedOptions: Array.isArray(variant.selectedOptions)
          ? variant.selectedOptions.map((option) => ({
              name: option.name,
              value: option.value
            }))
          : []
      }))
    : []
});

const mapCollection = (collection) => ({
  id: collection.id,
  handle: collection.handle,
  title: collection.title,
  description: collection.description || "",
  image: mapImage(collection.image),
  previewProducts: Array.isArray(collection.products?.nodes)
    ? collection.products.nodes.map((product) => ({
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: mapImage(product.featuredImage)
      }))
    : []
});

const mapCart = (cart) =>
  cart
    ? {
        id: cart.id,
        checkoutUrl: cart.checkoutUrl,
        totalQuantity: cart.totalQuantity || 0,
        subtotal: mapMoney(cart.cost?.subtotalAmount),
        total: mapMoney(cart.cost?.totalAmount),
        lines: Array.isArray(cart.lines?.nodes)
          ? cart.lines.nodes.map((line) => ({
              id: line.id,
              quantity: line.quantity || 1,
              merchandise: {
                id: line.merchandise?.id,
                title: line.merchandise?.title || "",
                image: mapImage(line.merchandise?.image),
                product: {
                  id: line.merchandise?.product?.id,
                  handle: line.merchandise?.product?.handle,
                  title: line.merchandise?.product?.title || ""
                },
                price: mapMoney(line.merchandise?.price)
              }
            }))
          : []
      }
    : null;

const buildCatalogQuery = ({ rarity, availability, minPrice, maxPrice }) => {
  const filters = [];

  if (availability === "in-stock") {
    filters.push("available_for_sale:true");
  }

  if (rarity) {
    filters.push(`tag:"rarity:${String(rarity).replaceAll('"', '\\"')}"`);
  }

  if (minPrice) {
    filters.push(`variants.price:>=${Number.parseFloat(minPrice)}`);
  }

  if (maxPrice) {
    filters.push(`variants.price:<=${Number.parseFloat(maxPrice)}`);
  }

  return filters.join(" AND ") || null;
};

const buildCollectionFilters = ({ rarity, availability, minPrice, maxPrice }) => {
  const filters = [];

  if (rarity) {
    filters.push({ tag: `rarity:${rarity}` });
  }

  if (availability === "in-stock") {
    filters.push({ available: true });
  }

  if (minPrice || maxPrice) {
    const price = {};
    if (minPrice) {
      price.min = Number.parseFloat(minPrice);
    }
    if (maxPrice) {
      price.max = Number.parseFloat(maxPrice);
    }
    filters.push({ price });
  }

  return filters;
};

export const commerceApi = {
  async getCatalog(filters = {}, signal) {
    const {
      first = 12,
      after = null,
      collectionHandle = "",
      rarity = "",
      availability = "all",
      minPrice = "",
      maxPrice = ""
    } = filters;

    if (collectionHandle) {
      const data = await requestCommerce(
        "getCollectionProducts",
        {
          handle: collectionHandle,
          first,
          after,
          filters: buildCollectionFilters({ rarity, availability, minPrice, maxPrice }),
          sortKey: "BEST_SELLING",
          reverse: false
        },
        signal
      );

      const products = Array.isArray(data.collection?.products?.edges)
        ? data.collection.products.edges.map((edge) => ({
            cursor: edge.cursor,
            card: mapProduct(edge.node)
          }))
        : [];

      return {
        products,
        pageInfo: data.collection?.products?.pageInfo || { hasNextPage: false, endCursor: null },
        collection: data.collection
          ? {
              id: data.collection.id,
              handle: data.collection.handle,
              title: data.collection.title,
              description: data.collection.description || ""
            }
          : null
      };
    }

    const data = await requestCommerce(
      "getProducts",
      {
        first,
        after,
        query: buildCatalogQuery({ rarity, availability, minPrice, maxPrice }),
        sortKey: "UPDATED_AT",
        reverse: false
      },
      signal
    );

    return {
      products: Array.isArray(data.products?.edges)
        ? data.products.edges.map((edge) => ({
            cursor: edge.cursor,
            card: mapProduct(edge.node)
          }))
        : [],
      pageInfo: data.products?.pageInfo || { hasNextPage: false, endCursor: null },
      collection: null
    };
  },

  async getCollections(signal) {
    const data = await requestCommerce("getCollections", { first: 6, after: null }, signal);

    return {
      items: Array.isArray(data.collections?.nodes) ? data.collections.nodes.map(mapCollection) : [],
      pageInfo: data.collections?.pageInfo || { hasNextPage: false, endCursor: null }
    };
  },

  async getCart(cartId, signal) {
    const data = await requestCommerce("getCart", { id: cartId }, signal);
    return mapCart(data.cart);
  },

  async createCart(signal) {
    const data = await requestCommerce("createCart", { input: { lines: [] } }, signal);
    if (data.cartCreate?.userErrors?.length) {
      throw new Error("Commerce service unavailable");
    }
    return mapCart(data.cartCreate?.cart);
  },

  async addToCart(cartId, merchandiseId, quantity = 1, signal) {
    const data = await requestCommerce(
      "addToCart",
      { cartId, lines: [{ merchandiseId, quantity }] },
      signal
    );
    if (data.cartLinesAdd?.userErrors?.length) {
      throw new Error("Commerce service unavailable");
    }
    return mapCart(data.cartLinesAdd?.cart);
  },

  async updateCartLine(cartId, lineId, quantity, signal) {
    const operation = quantity <= 0 ? "removeCartLines" : "updateCartLines";
    const variables =
      quantity <= 0
        ? { cartId, lineIds: [lineId] }
        : { cartId, lines: [{ id: lineId, quantity }] };
    const data = await requestCommerce(operation, variables, signal);
    const payload = quantity <= 0 ? data.cartLinesRemove : data.cartLinesUpdate;

    if (payload?.userErrors?.length) {
      throw new Error("Commerce service unavailable");
    }

    return mapCart(payload?.cart);
  },

  getStoredCartId() {
    return window.localStorage.getItem(STORAGE_KEY);
  },

  storeCartId(cartId) {
    if (cartId) {
      window.localStorage.setItem(STORAGE_KEY, cartId);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
};
