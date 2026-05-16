import { useState } from "react";
import CartDrawer from "./components/CartDrawer";
import CatalogFilters from "./components/CatalogFilters";
import ProductCard from "./components/ProductCard";
import { featuredCards, features, galleryImages, shopUrl } from "./data";
import { useCommerce } from "./hooks/useCommerce";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const year = new Date().getFullYear();
  const {
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
    removeCartLine,
    loadMore
  } = useCommerce();

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((current) => !current);
  const cartCount = cart?.totalQuantity || 0;

  const handleAddToCart = async (variantId) => {
    await addToCart(variantId);
    setIsCartOpen(true);
  };

  const handleFilterChange = (nextFilters) => {
    setFilters((current) => ({
      ...current,
      ...nextFilters
    }));
  };

  const featuredCatalogItems = products.length
    ? products.slice(0, 4).map((entry) => entry.card)
    : [];

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-row">
          <div className="brand-row">
            <a className="brand" href="#top" aria-label="Ti'CG home" onClick={closeMenu}>
              <img src="/images/logo.png" alt="Ti'CG Logo" className="brand-logo" />
            </a>
            <nav className="nav desktop-nav" aria-label="Primary">
              <a href="#about">About Us</a>
              <a href="#collections">Featured Cards</a>
              <a href="#shop">Sets</a>
            </nav>
          </div>

          <div className="header-actions">
            <button className="cart-button" type="button" onClick={() => setIsCartOpen(true)}>
              Cart
              <span>{cartCount}</span>
            </button>
            <button
              className={`menu-button ${isMenuOpen ? "is-open" : ""}`}
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        <nav
          className={`mobile-nav ${isMenuOpen ? "is-open" : ""}`}
          id="mobile-menu"
          aria-label="Mobile"
        >
          <a href="#collections" onClick={closeMenu}>
            Featured Cards
          </a>
          <a href="#shop" onClick={closeMenu}>
            Sets
          </a>
          <a href="#about" onClick={closeMenu}>
            About Us
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Premium Collectibles</p>
              <h1>
                Collect.
                <br />
                <span>Trade.</span>
                <br />
                Discover
                <br />
                Rare Cards.
              </h1>
              <p className="hero-text">
                Explore our TCG catalogue and discover standout cards, collector favourites, and
                new additions across different sets and eras.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#collections">
                  Browse Catalog
                </a>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => window.open(shopUrl, "_blank", "noopener,noreferrer")}
                >
                  ebay store
                </button>
              </div>
            </div>

            <div className="hero-stack" aria-hidden="true">
              <article className="hero-card hero-card-left">
                <img
                  src="https://images.unsplash.com/photo-1621882352098-a4986f39fd29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900"
                  alt=""
                />
              </article>
              <article className="hero-card hero-card-center">
                <img
                  src="https://images.unsplash.com/photo-1632459251040-05b129454007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900"
                  alt=""
                />
              </article>
              <article className="hero-card hero-card-right">
                <img src="/images/2.jpg" alt="Rare trading cards in protective cases" />
              </article>
            </div>
          </div>
        </section>

        <section className="features-section" id="categories">
          <div className="container features-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="container about-layout">
            <div className="about-logo-wrap">
              <img src="/images/logo.png" alt="Ti'CG Logo" className="about-logo" />
            </div>
            <div className="about-copy">
              <h2>Tios&apos; Collectors Guild</h2>
              <p className="about-text">
                Ti&apos;CG is a trading card and collectibles store dedicated to providing
                authentic, high-quality cards for collectors of all levels. The focus is on
                building a carefully curated selection that includes rare finds, vintage pieces,
                and more accessible cards, ensuring that both experienced collectors and beginners
                can find something meaningful. Every card is chosen with attention to authenticity,
                condition, and overall value, with the goal of maintaining a trustworthy and
                enjoyable collecting experience.
              </p>
              <p className="about-text">
                Beyond the cards themselves, Ti&apos;CG is built around a shared passion for
                collecting and trading. It aims to bring together people who appreciate the
                history, design, and excitement behind each card. Whether someone is looking to
                expand a serious collection or simply explore the hobby, the store provides a
                space where collectors can connect through their common interests and stories each
                guild member carries.
              </p>
            </div>
          </div>
        </section>

        <section className="cards-section" id="collections">
          <div className="container">
            <p className="eyebrow center">Featured Cards</p>
            <h2 className="section-title center">Highlights from the vault</h2>
            <p className="section-copy center">
              Browse standout cards from the collection and explore different sets, rarities, and
              collector favourites.
            </p>
            <CatalogFilters
              collections={collections}
              filters={filters}
              rarityOptions={rarityOptions}
              onChange={handleFilterChange}
            />
            {collectionMeta?.title ? (
              <p className="section-copy center collection-summary">
                Showing collection: {collectionMeta.title}
              </p>
            ) : null}
            {catalogError ? <p className="catalog-error center">{catalogError}</p> : null}
            <div className="cards-grid">
              {featuredCatalogItems.length
                ? featuredCatalogItems.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isBusy={isCartBusy}
                      onAddToCart={handleAddToCart}
                    />
                  ))
                : featuredCards.map((card) => (
                    <article className="product-card" key={card.name}>
                      <img src={card.image} alt={card.name} />
                      <div className="product-card-body">
                        <h3>{card.name}</h3>
                        <p>{card.description}</p>
                        <p>
                          <span className="pill">{card.rarity}</span>
                        </p>
                      </div>
                    </article>
                  ))}
            </div>
            {isLoadingCatalog && featuredCatalogItems.length === 0 ? (
              <p className="section-copy center">Loading featured cards...</p>
            ) : null}
            {!isLoadingCatalog && !featuredCatalogItems.length && !catalogError ? (
              <p className="section-copy center">Showing the original featured gallery.</p>
            ) : null}
            {pageInfo.hasNextPage ? (
              <div className="cta-actions">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="gallery-section" id="shop">
          <div className="container">
            <p className="eyebrow center">Sets & Collections</p>
            <h2 className="section-title center">Browse across sets and eras</h2>
            <p className="section-copy center">
              Take a closer look at different sets, styles, and favourites across the wider
              collection.
            </p>
            <div className="gallery-grid">
              {(collections.length ? collections : galleryImages).map((item, index) => (
                <article
                  className="gallery-item"
                  key={typeof item === "string" ? item : item.id}
                  onClick={
                    typeof item === "string"
                      ? undefined
                      : () => handleFilterChange({ collectionHandle: item.handle })
                  }
                >
                  <img
                    src={
                      typeof item === "string"
                        ? item
                        : item.image?.url || item.previewProducts[0]?.featuredImage?.url || "/images/5.jpg"
                    }
                    alt={
                      typeof item === "string"
                        ? `Trading card gallery item ${index + 1}`
                        : item.image?.altText || item.title
                    }
                    loading="lazy"
                  />
                  {typeof item === "string" ? null : (
                    <div className="gallery-item-copy">
                      <h3>{item.title}</h3>
                      <p>{item.description || "Explore more from this part of the collection."}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container narrow">
            <p className="eyebrow center">Full Collection</p>
            <h2 className="section-title center">Explore the complete catalogue</h2>
            <p className="section-copy center">
              Continue browsing cards and explore the full range in our eBay store.
            </p>
            <div className="cta-actions">
              <a className="button button-primary" href={shopUrl} target="_blank" rel="noreferrer">
                ebay store
              </a>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container narrow">
            <p className="eyebrow center">Contact</p>
            <h2 className="section-title center">Get in touch</h2>
            <div className="contact-links">
              <a href="mailto:tio.cgc@gmail.com" aria-label="Gmail">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75zm1.8-.25L12 11.72 19.2 6.5H4.8zm14.7 11V8.15l-6.98 5.05a.9.9 0 0 1-1.04 0L4.5 8.15v9.35h15z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/tio.ccg/"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.25 3h9.5A4.25 4.25 0 0 1 21 7.25v9.5A4.25 4.25 0 0 1 16.75 21h-9.5A4.25 4.25 0 0 1 3 16.75v-9.5A4.25 4.25 0 0 1 7.25 3zm0 1.5A2.75 2.75 0 0 0 4.5 7.25v9.5A2.75 2.75 0 0 0 7.25 19.5h9.5a2.75 2.75 0 0 0 2.75-2.75v-9.5A2.75 2.75 0 0 0 16.75 4.5h-9.5zm10.12 1.12a1.13 1.13 0 1 1 0 2.26a1.13 1.13 0 0 1 0-2.26zM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10zm0 1.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 0 0 12 8.5z" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-row">
          <p className="footer-brand">Ti&apos;CG</p>
          <p className="footer-copy">&copy; {year} Ti&apos;CG. All rights reserved.</p>
        </div>
      </footer>

      <CartDrawer
        cart={cart}
        isOpen={isCartOpen}
        isBusy={isCartBusy}
        error={cartError}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => cart?.checkoutUrl && window.location.assign(cart.checkoutUrl)}
        onUpdateLine={updateCartLine}
        onRemoveLine={removeCartLine}
      />
    </div>
  );
}

export default App;
