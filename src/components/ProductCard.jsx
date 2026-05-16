import { useEffect, useState } from "react";

const formatMoney = (money) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode || "USD"
  }).format(money.amount || 0);

export default function ProductCard({ product, onAddToCart, isBusy }) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || "");

  useEffect(() => {
    setSelectedVariantId(product.variants[0]?.id || "");
  }, [product.id, product.variants]);

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) || product.variants[0];
  const image = selectedVariant?.image || product.featuredImage || product.images[0];

  return (
    <article className="product-card">
      <img
        src={image?.url || "/images/1.jpg"}
        alt={image?.altText || product.title}
        loading="lazy"
      />
      <div className="product-card-body">
        <h3>{product.title}</h3>
        <p>{product.description || "A curated card from the collection."}</p>
        <p className="product-price">{formatMoney(selectedVariant?.price || product.priceRange.min)}</p>
        <p>
          <span className="pill">{product.rarity || "Collector stock"}</span>
        </p>

        {product.variants.length > 1 ? (
          <label className="variant-field">
            <span>Variant</span>
            <select
              value={selectedVariantId}
              onChange={(event) => setSelectedVariantId(event.target.value)}
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.title}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <button
          className="button button-primary product-card-button"
          type="button"
          disabled={!selectedVariant?.availableForSale || isBusy}
          onClick={() => selectedVariant && onAddToCart(selectedVariant.id)}
        >
          {selectedVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </article>
  );
}
