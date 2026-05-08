const features = [
  {
    title: "Premium Design",
    description: "Curated selection of rare cards",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>`
  },
  {
    title: "Sustainable Packaging",
    description: "Eco-friendly materials",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>`
  },
  {
    title: "Secure Delivery",
    description: "Safe and tracked shipping",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 12l2 2l4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622c5.176-1.332 9-6.03 9-11.622c0-1.042-.133-2.052-.382-3.016z"></path></svg>`
  },
  {
    title: "Satisfaction Guarantee",
    description: "100% authentic cards",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 12l2 2l4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806a3.42 3.42 0 0 1 4.438 0a3.42 3.42 0 0 0 1.946.806a3.42 3.42 0 0 1 3.138 3.138a3.42 3.42 0 0 0 .806 1.946a3.42 3.42 0 0 1 0 4.438a3.42 3.42 0 0 0-.806 1.946a3.42 3.42 0 0 1-3.138 3.138a3.42 3.42 0 0 0-1.946.806a3.42 3.42 0 0 1-4.438 0a3.42 3.42 0 0 0-1.946-.806a3.42 3.42 0 0 1-3.138-3.138a3.42 3.42 0 0 0-.806-1.946a3.42 3.42 0 0 1 0-4.438a3.42 3.42 0 0 0 .806-1.946a3.42 3.42 0 0 1 3.138-3.138z"></path></svg>`
  }
];

const featuredCards = [
  {
    name: "Late Night Pulls",
    rarity: "Card Backs",
    description: "A small glimpse into a growing collection full of nostalgia and late-night pulls.",
    image: "./images/1.jpg"
  },
  {
    name: "The Big Three",
    rarity: "God Cards",
    description: "Some legends never lose their place in the spotlight.",
    image: "./images/2.jpg"
  },
  {
    name: "Double Charizard",
    rarity: "Charizard",
    description: "A favorite duo kept close for a reason.",
    image: "./images/3.jpg"
  },
  {
    name: "Mewtwo Energy",
    rarity: "Mewtwo",
    description: "One of those cards that instantly stands out in any setup.",
    image: "./images/4.jpg"
  }
];

const galleryImages = [
  "https://images.unsplash.com/photo-1632459250885-76cc46ca1dcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1587565221090-7b8497f86d9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1609200660087-e23d23d7e958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1732944710507-feecdfb4f2c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1674106890436-368ce68342f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1620336655071-6b2ea4272b15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1640271204756-6bf55641d9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1599873265732-4511510f0908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
];

const featuresGrid = document.querySelector("#features-grid");
const cardsGrid = document.querySelector("#cards-grid");
const galleryGrid = document.querySelector("#gallery-grid");
const year = document.querySelector("#year");
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-nav");

featuresGrid.innerHTML = features
  .map(
    (feature) => `
      <article class="feature-card">
        <div class="feature-icon">${feature.icon}</div>
        <h3>${feature.title}</h3>
        <p>${feature.description}</p>
      </article>
    `
  )
  .join("");

cardsGrid.innerHTML = featuredCards
  .map(
    (card) => `
      <article class="product-card">
        <img src="${card.image}" alt="${card.name}" />
        <div class="product-card-body">
          <h3>${card.name}</h3>
          <p>${card.description}</p>
          <p><span class="pill">${card.rarity}</span></p>
        </div>
      </article>
    `
  )
  .join("");

galleryGrid.innerHTML = galleryImages
  .map(
    (image, index) => `
      <article class="gallery-item">
        <img src="${image}" alt="Trading card gallery item ${index + 1}" loading="lazy" />
      </article>
    `
  )
  .join("");

year.textContent = new Date().getFullYear();

menuButton.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("is-open");
  menuButton.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});
