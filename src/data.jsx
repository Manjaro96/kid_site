export const shopUrl =
  "https://www.ebay.com/usr/marcos.agt?_trksid=p4429486.m3561.l49544";

const baseUrl = import.meta.env.BASE_URL;

export const features = [
  {
    title: "Premium Design",
    description: "Curated selection of rare cards",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
      </svg>
    )
  },
  {
    title: "Sustainable Packaging",
    description: "Eco-friendly materials",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
      </svg>
    )
  },
  {
    title: "Secure Delivery",
    description: "Safe and tracked shipping",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 12l2 2l4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622c5.176-1.332 9-6.03 9-11.622c0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
    )
  },
  {
    title: "Satisfaction Guarantee",
    description: "100% authentic cards",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 12l2 2l4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806a3.42 3.42 0 0 1 4.438 0a3.42 3.42 0 0 0 1.946.806a3.42 3.42 0 0 1 3.138 3.138a3.42 3.42 0 0 0 .806 1.946a3.42 3.42 0 0 1 0 4.438a3.42 3.42 0 0 0-.806 1.946a3.42 3.42 0 0 1-3.138 3.138a3.42 3.42 0 0 0-1.946.806a3.42 3.42 0 0 1-4.438 0a3.42 3.42 0 0 0-1.946-.806a3.42 3.42 0 0 1-3.138-3.138a3.42 3.42 0 0 0-.806-1.946a3.42 3.42 0 0 1 0-4.438a3.42 3.42 0 0 0 .806-1.946a3.42 3.42 0 0 1 3.138-3.138z"></path>
      </svg>
    )
  }
];

export const featuredCards = [
  {
    name: "Charizard",
    rarity: "Fire / Stage 2",
    description: "One of the most iconic cards in the hobby. A must-have for any serious collector.",
    image: `${baseUrl}images/WA/singles/charizard.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Mewtwo",
    rarity: "Psychic / Basic",
    description: "A fan-favourite that commands attention in any collection.",
    image: `${baseUrl}images/WA/singles/mewtwo.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Blastoise",
    rarity: "Water / Stage 2",
    description: "A classic starter evolution and a staple of vintage Pokémon sets.",
    image: `${baseUrl}images/WA/singles/blastoise.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Mew",
    rarity: "Psychic / Basic",
    description: "The mythical original — rare, beloved, and always in demand.",
    image: `${baseUrl}images/WA/singles/mew.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Ho-Oh",
    rarity: "Fire / Basic",
    description: "A legendary bird that brings colour and power to any collection.",
    image: `${baseUrl}images/WA/singles/ho-oh.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Umbreon",
    rarity: "Dark / Stage 1",
    description: "A sleek Eeveelution with serious collector appeal.",
    image: `${baseUrl}images/WA/singles/umbreon.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Vaporeon",
    rarity: "Water / Stage 1",
    description: "A beloved Eeveelution with timeless card art.",
    image: `${baseUrl}images/WA/singles/vaporeon.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Lapras",
    rarity: "Water / Basic",
    description: "A gentle giant with an enduring place in Pokémon history.",
    image: `${baseUrl}images/WA/singles/lapras.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Dragonair",
    rarity: "Dragon / Stage 1",
    description: "Elegant and rare — a mid-evolution that holds its own.",
    image: `${baseUrl}images/WA/singles/dragonair.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Salamence",
    rarity: "Dragon / Stage 2",
    description: "A powerhouse dragon with impressive artwork and collector value.",
    image: `${baseUrl}images/WA/singles/salmance.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Kyurem",
    rarity: "Dragon / Basic",
    description: "The boundary Pokémon — an imposing presence in any deck or collection.",
    image: `${baseUrl}images/WA/singles/kyurem.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Mimikyu",
    rarity: "Fairy / Basic",
    description: "The beloved disguise Pokémon with a dedicated fanbase.",
    image: `${baseUrl}images/WA/singles/mimikyu.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Arceus (JP)",
    rarity: "Normal / Basic",
    description: "The god Pokémon in a rare Japanese print — a standout piece.",
    image: `${baseUrl}images/WA/singles/arceus%20jp.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Blue-Eyes White Dragon",
    rarity: "Yu-Gi-Oh! / Dragon",
    description: "The legendary Kaiba card — a prize piece for any TCG collector.",
    image: `${baseUrl}images/WA/singles/blue_eyes_white_dragon.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Wartortle",
    rarity: "Water / Stage 1",
    description: "A mid-stage classic from the original Base Set era.",
    image: `${baseUrl}images/WA/singles/wartotle.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Magikarp",
    rarity: "Water / Basic",
    description: "The ultimate underdog card — iconic in its own right.",
    image: `${baseUrl}images/WA/singles/magikarp.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Lotad",
    rarity: "Water / Basic",
    description: "A quirky fan favourite with clean, charming artwork.",
    image: `${baseUrl}images/WA/singles/lotad.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Wooper",
    rarity: "Water / Basic",
    description: "A simple but loveable card that appeals to all collectors.",
    image: `${baseUrl}images/WA/singles/oopa.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Trainer Card",
    rarity: "Trainer / Item",
    description: "A classic Trainer card in excellent condition.",
    image: `${baseUrl}images/WA/singles/trainer.jpeg`,
    buyUrl: shopUrl
  },
  {
    name: "Orepon",
    rarity: "Fairy / Basic",
    description: "A charming addition to any growing collection.",
    image: `${baseUrl}images/WA/singles/orepon.jpeg`,
    buyUrl: shopUrl
  }
];

export const galleryImages = Array.from(
  { length: 56 },
  (_, i) => `${baseUrl}images/WA/catologos/catalogo${i + 1}.jpeg`
);
