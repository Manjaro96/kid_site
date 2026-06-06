import { useEffect, useState } from "react";
import { cardCategories, features, galleryImages, shopUrl } from "./data";

const CARDS_PER_PAGE = 4;
const GALLERY_PER_PAGE = 8;

const getVisiblePages = (current, total) => {
  const pages = [];
  if (current > 0) pages.push(current - 1);
  pages.push(current);
  if (current < total - 1) pages.push(current + 1);
  return pages;
};

function App() {
  const isMobile = window.innerWidth <= 780;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackHome, setShowBackHome] = useState(false);
  const [activeCategory, setActiveCategory] = useState("singles");
  const [cardsPage, setCardsPage] = useState(0);
  const [galleryPage, setGalleryPage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [cardModal, setCardModal] = useState(null);
  const [cardsTouchX, setCardsTouchX] = useState(null);
  const [galleryTouchX, setGalleryTouchX] = useState(null);
  const year = new Date().getFullYear();
  const baseUrl = import.meta.env.BASE_URL;

  const cardsPerPage = isMobile ? 1 : CARDS_PER_PAGE;
  const galleryPerPage = isMobile ? 1 : GALLERY_PER_PAGE;

  const currentCategory = cardCategories.find((c) => c.id === activeCategory);
  const totalCardsPages = Math.ceil(currentCategory.cards.length / cardsPerPage);
  const visibleCards = currentCategory.cards.slice(
    cardsPage * cardsPerPage,
    (cardsPage + 1) * cardsPerPage
  );

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    setCardsPage(0);
  };

  const totalGalleryPages = Math.ceil(galleryImages.length / galleryPerPage);
  const visibleGallery = galleryImages.slice(
    galleryPage * galleryPerPage,
    (galleryPage + 1) * galleryPerPage
  );

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((current) => !current);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackHome(window.scrollY > 240);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setLightboxIndex((i) => Math.min(galleryImages.length - 1, i + 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex]);

  useEffect(() => {
    if (cardModal === null) return;
    const handleKey = (e) => { if (e.key === "Escape") setCardModal(null); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cardModal]);

  useEffect(() => {
    if (cardModal !== null || lightboxIndex !== null) return;
    if (window.innerWidth <= 780) return;

    const sections = Array.from(document.querySelectorAll("main > section:not(.about-section)"));
    let locked = false;
    let touchStartY = 0;

    const currentIndex = () => {
      const top = window.scrollY + 80;
      let best = 0;
      sections.forEach((s, i) => { if (s.offsetTop <= top) best = i; });
      return best;
    };

    const goTo = (idx) => {
      locked = true;
      sections[idx].scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => { locked = false; }, 500);
    };

    const onWheel = (e) => {
      e.preventDefault();
      if (locked) return;
      const cur = currentIndex();
      const next = Math.max(0, Math.min(sections.length - 1, cur + (e.deltaY > 0 ? 1 : -1)));
      if (next === cur) return;
      goTo(next);
    };

    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };

    const onTouchEnd = (e) => {
      if (locked) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;
      const cur = currentIndex();
      const next = Math.max(0, Math.min(sections.length - 1, cur + (dy > 0 ? 1 : -1)));
      if (next === cur) return;
      goTo(next);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [cardModal, lightboxIndex]);



  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-row">
          <div className="brand-row">
            <a className="brand" href="#top" aria-label="Ti'CG home" onClick={closeMenu}>
              <img src={`${baseUrl}images/logo.png`} alt="Ti'CG Logo" className="brand-logo" />
            </a>
            <nav className="nav desktop-nav" aria-label="Primary">
              <a href="#about">About Us</a>
              <a href="#collections">Featured Cards</a>
              <a href="#shop">Sets</a>
            </nav>
          </div>

          <div className="header-actions">
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
              <div className="hero-card-shell hero-card-left">
                <article className="hero-card">
                  <img src={`${baseUrl}images/WA/singles/mew.jpeg`} alt="Mew" />
                </article>
              </div>
              <div className="hero-card-shell hero-card-center">
                <article className="hero-card">
                  <img src={`${baseUrl}images/WA/singles/charizard.jpeg`} alt="Charizard" />
                </article>
              </div>
              <div className="hero-card-shell hero-card-right">
                <article className="hero-card">
                  <img src={`${baseUrl}images/WA/singles/mewtwo.jpeg`} alt="Mewtwo" />
                </article>
              </div>
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
              <img src={`${baseUrl}images/card_logo.png`} alt="Ti'CG Logo" className="about-logo" />
            </div>
            <div className="about-copy">
              <h2>Tios&apos; Collectors Guild</h2>
              <p className="about-text">
                Ti&apos;CG is a trading card and collectibles store dedicated to authentic,
                high-quality cards for collectors of all levels — from rare vintage finds to
                more accessible picks. Every card is chosen with attention to condition and value,
                built around a shared passion for collecting and trading.
              </p>
              <p className="about-text">
                Beyond individual cards, Ti&apos;CG offers sealed products, mystery packs, and
                custom-made display pieces crafted in-house. Whether you&apos;re building a serious
                collection or just starting out, there&apos;s something here for every collector.
              </p>
            </div>
          </div>
        </section>

        <section className="cards-section" id="collections">
          <div className="container">
            <h2 className="section-title center">Featured Cards</h2>
            <div className="category-tabs" role="tablist">
              {cardCategories.map((cat) => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  className={`category-tab ${activeCategory === cat.id ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="swipeable-wrap">
              <div
                className="cards-grid"
                onTouchStart={(e) => setCardsTouchX(e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  if (cardsTouchX === null) return;
                  const dx = cardsTouchX - e.changedTouches[0].clientX;
                  if (Math.abs(dx) < 40) { setCardsTouchX(null); return; }
                  if (dx > 0) setCardsPage((p) => Math.min(totalCardsPages - 1, p + 1));
                  else setCardsPage((p) => Math.max(0, p - 1));
                  setCardsTouchX(null);
                }}
              >
                {visibleCards.map((card) => (
                  <article
                    className="product-card product-card-clickable"
                    key={card.name}
                    onClick={() => setCardModal(card)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${card.name}`}
                    onKeyDown={(e) => e.key === "Enter" && setCardModal(card)}
                  >
                    <div className="product-card-img-wrap">
                      <img src={card.image} alt={card.name} />
                      <div className="gallery-zoom-hint" aria-hidden="true">
                        <svg viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm0 0v2m0-4v2m-2-2h2m-4 0h2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor"/></svg>
                      </div>
                    </div>
                    <div className="product-card-body">
                      <h3>{card.name}</h3>
                      <p>{card.description}</p>
                      <div className="product-card-footer">
                        <span className="pill">{card.rarity}</span>
                        <a
                          className="buy-button"
                          href={card.buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="swipe-hint" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="swipe-arrow swipe-arrow-left"><path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor"/></svg>
                <svg viewBox="0 0 24 24" className="swipe-arrow swipe-arrow-right"><path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor"/></svg>
              </div>
            </div>

            <div className="gallery-pagination" role="navigation" aria-label="Cards pages">
              <button
                className="page-btn page-btn-arrow"
                onClick={() => setCardsPage((p) => Math.max(0, p - 1))}
                disabled={cardsPage === 0}
                aria-label="Previous page"
              >
                &#8592;
              </button>

              {(isMobile ? getVisiblePages(cardsPage, totalCardsPages) : Array.from({ length: totalCardsPages }, (_, i) => i)).map((i) => (
                <button
                  key={i}
                  className={`page-btn ${cardsPage === i ? "active" : ""}`}
                  onClick={() => setCardsPage(i)}
                  aria-label={`Page ${i + 1}`}
                  aria-current={cardsPage === i ? "page" : undefined}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="page-btn page-btn-arrow"
                onClick={() => setCardsPage((p) => Math.min(totalCardsPages - 1, p + 1))}
                disabled={cardsPage === totalCardsPages - 1}
                aria-label="Next page"
              >
                &#8594;
              </button>
            </div>
          </div>
        </section>

        <section className="gallery-section" id="shop">
          <div className="container">
            <h2 className="section-title center">Sets &amp; Collections</h2>
            <div className="swipeable-wrap">
              <div
                className="gallery-grid"
                onTouchStart={(e) => setGalleryTouchX(e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  if (galleryTouchX === null) return;
                  const dx = galleryTouchX - e.changedTouches[0].clientX;
                  if (Math.abs(dx) < 40) { setGalleryTouchX(null); return; }
                  if (dx > 0) setGalleryPage((p) => Math.min(totalGalleryPages - 1, p + 1));
                  else setGalleryPage((p) => Math.max(0, p - 1));
                  setGalleryTouchX(null);
                }}
              >
                {visibleGallery.map((image, index) => {
                  const globalIndex = galleryPage * galleryPerPage + index;
                  return (
                    <article
                      className="gallery-item gallery-item-clickable"
                      key={image}
                      onClick={() => setLightboxIndex(globalIndex)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open image ${globalIndex + 1}`}
                      onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(globalIndex)}
                    >
                      <img
                        src={image}
                        alt={`Catalogue page ${globalIndex + 1}`}
                        loading="lazy"
                      />
                      <div className="gallery-zoom-hint" aria-hidden="true">
                        <svg viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm0 0v2m0-4v2m-2-2h2m-4 0h2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor"/></svg>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="swipe-hint" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="swipe-arrow swipe-arrow-left"><path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor"/></svg>
                <svg viewBox="0 0 24 24" className="swipe-arrow swipe-arrow-right"><path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor"/></svg>
              </div>
            </div>

            <div className="gallery-pagination" role="navigation" aria-label="Gallery pages">
              <button
                className="page-btn page-btn-arrow"
                onClick={() => setGalleryPage((p) => Math.max(0, p - 1))}
                disabled={galleryPage === 0}
                aria-label="Previous page"
              >
                &#8592;
              </button>

              {(isMobile ? getVisiblePages(galleryPage, totalGalleryPages) : Array.from({ length: totalGalleryPages }, (_, i) => i)).map((i) => (
                <button
                  key={i}
                  className={`page-btn ${galleryPage === i ? "active" : ""}`}
                  onClick={() => setGalleryPage(i)}
                  aria-label={`Page ${i + 1}`}
                  aria-current={galleryPage === i ? "page" : undefined}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="page-btn page-btn-arrow"
                onClick={() => setGalleryPage((p) => Math.min(totalGalleryPages - 1, p + 1))}
                disabled={galleryPage === totalGalleryPages - 1}
                aria-label="Next page"
              >
                &#8594;
              </button>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container contact-combined">
            <div className="combined-cta">
              <div className="combined-cta-copy">
                <h2 className="section-title">Full Collection</h2>
                <p className="combined-cta-text">
                  The full catalogue lives on our eBay store — singles, sealed packs, mystery
                  envelopes and custom display pieces, all in one place. Every item is carefully
                  selected and listed with accurate condition info.
                </p>
                <p className="combined-cta-text">
                  New additions drop regularly. Find us across multiple platforms and check back
                  often for fresh finds and limited pieces straight from the vault.
                </p>
                <div className="store-buttons">
                  <a className="store-btn" href={shopUrl} target="_blank" rel="noreferrer">eBay</a>
                  <a className="store-btn" href={shopUrl} target="_blank" rel="noreferrer">OLX</a>
                  <a className="store-btn" href={shopUrl} target="_blank" rel="noreferrer">Vinted</a>
                  <a className="store-btn" href={shopUrl} target="_blank" rel="noreferrer">Wallapop</a>
                </div>
              </div>
              <div className="combined-cta-img">
                <img src={`${baseUrl}images/WA/WhatsApp%20Image%202026-06-03%20at%2009.47.17.jpeg`} alt="Ti'CG collection shelf" />
              </div>
            </div>

            <div className="combined-divider" aria-hidden="true" />

            <div className="combined-contact">
              <h2 className="section-title center">Get in touch</h2>
              <div className="contact-links">
                <a href="mailto:tio.cgc@gmail.com" className="contact-link-item">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75zm1.8-.25L12 11.72 19.2 6.5H4.8zm14.7 11V8.15l-6.98 5.05a.9.9 0 0 1-1.04 0L4.5 8.15v9.35h15z" /></svg>
                  <span>Gmail</span>
                </a>
                <a href="https://www.instagram.com/tio.ccg/" className="contact-link-item" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.25 3h9.5A4.25 4.25 0 0 1 21 7.25v9.5A4.25 4.25 0 0 1 16.75 21h-9.5A4.25 4.25 0 0 1 3 16.75v-9.5A4.25 4.25 0 0 1 7.25 3zm0 1.5A2.75 2.75 0 0 0 4.5 7.25v9.5A2.75 2.75 0 0 0 7.25 19.5h9.5a2.75 2.75 0 0 0 2.75-2.75v-9.5A2.75 2.75 0 0 0 16.75 4.5h-9.5zm10.12 1.12a1.13 1.13 0 1 1 0 2.26a1.13 1.13 0 0 1 0-2.26zM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10zm0 1.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 0 0 12 8.5z" /></svg>
                  <span>Instagram</span>
                </a>
                <a href={shopUrl} className="contact-link-item" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                  <span>Facebook</span>
                </a>
                <a href={shopUrl} className="contact-link-item" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                  <span>X / Twitter</span>
                </a>
              </div>
            </div>

          </div>
          <footer className="site-footer contact-footer">
            <div className="container footer-row">
              <p className="footer-brand">Ti&apos;CG</p>
              <p className="footer-copy">&copy; {year} Ti&apos;CG. All rights reserved.</p>
            </div>
          </footer>
        </section>
      </main>

      {cardModal !== null && (
        <div
          className="lightbox-overlay card-modal-overlay"
          onClick={() => setCardModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label={cardModal.name}
        >
          <button
            className="lightbox-close"
            onClick={() => setCardModal(null)}
            aria-label="Close"
          >
            &#x2715;
          </button>

          <div className="card-modal" onClick={(e) => e.stopPropagation()}>
            <div className="card-modal-img-wrap">
              <img src={cardModal.image} alt={cardModal.name} />
            </div>
            <div className="card-modal-body">
              <p className="eyebrow">{cardModal.rarity}</p>
              <h2 className="card-modal-title">{cardModal.name}</h2>
              <p className="card-modal-desc">{cardModal.description}</p>
              <a
                className="button button-primary card-modal-buy"
                href={cardModal.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit
              </a>
            </div>
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            className="lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
          >
            &#x2715;
          </button>

          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => Math.max(0, i - 1)); }}
            disabled={lightboxIndex === 0}
            aria-label="Previous image"
          >
            &#8592;
          </button>

          <div className="lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[lightboxIndex]}
              alt={`Catalogue image ${lightboxIndex + 1}`}
            />
          </div>

          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => Math.min(galleryImages.length - 1, i + 1)); }}
            disabled={lightboxIndex === galleryImages.length - 1}
            aria-label="Next image"
          >
            &#8594;
          </button>

          <p className="lightbox-counter">{lightboxIndex + 1} / {galleryImages.length}</p>
        </div>
      )}

      <a
        className={`back-home-button ${showBackHome ? "is-visible" : ""}`}
        href="#top"
        aria-label="Back to top"
        aria-hidden={!showBackHome}
        tabIndex={showBackHome ? 0 : -1}
        onClick={(event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3.4 2.9 10.7l1.2 1.5 1.4-1.1V20h5.5v-5.4h2.9V20h5.5v-8.9l1.4 1.1 1.2-1.5L12 3.4z" />
        </svg>
      </a>

    </div>
  );
}

export default App;
