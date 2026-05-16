const formatMoney = (money) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money?.currencyCode || "USD"
  }).format(money?.amount || 0);

export default function CartDrawer({
  cart,
  isOpen,
  isBusy,
  error,
  onClose,
  onCheckout,
  onUpdateLine,
  onRemoveLine
}) {
  return (
    <aside className={`cart-drawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="cart-header">
          <h2>Cart</h2>
          <button type="button" className="cart-close" onClick={onClose} aria-label="Close cart">
            x
          </button>
        </div>

        {error ? <p className="cart-error">{error}</p> : null}

        {cart?.lines?.length ? (
          <div className="cart-lines">
            {cart.lines.map((line) => (
              <article className="cart-line" key={line.id}>
                <img
                  src={line.merchandise.image?.url || "/images/2.jpg"}
                  alt={line.merchandise.image?.altText || line.merchandise.product.title}
                  loading="lazy"
                />
                <div className="cart-line-copy">
                  <h3>{line.merchandise.product.title}</h3>
                  <p>{line.merchandise.title}</p>
                  <p>{formatMoney(line.merchandise.price)}</p>
                </div>
                <div className="cart-line-actions">
                  <label>
                    <span className="sr-only">Quantity</span>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={line.quantity}
                      onChange={(event) => onUpdateLine(line.id, Number(event.target.value))}
                      disabled={isBusy}
                    />
                  </label>
                  <button type="button" onClick={() => onRemoveLine(line.id)} disabled={isBusy}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="cart-empty">Your cart is empty.</p>
        )}

        <div className="cart-footer">
          <p>
            <span>Subtotal</span>
            <strong>{formatMoney(cart?.subtotal)}</strong>
          </p>
          <button
            type="button"
            className="button button-primary cart-checkout"
            disabled={!cart?.checkoutUrl || isBusy}
            onClick={onCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </aside>
  );
}
