const gallery = document.getElementById("gallery");
const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
const cards = document.querySelectorAll(".card");
const dotsContainer = document.querySelector(".carousel-dots");

let dots = [];

function getCardsPerPage() {
  if (window.innerWidth >= 768) return 2; // PC/tablet
  return 1; // mobile
}

// distância real entre cards (inclui gap)
function getCardStep() {
  const card = cards[0];
  const style = getComputedStyle(gallery);
  const gap = parseFloat(style.gap) || 0;

  return card.offsetWidth + gap;
}

function createDots() {
  dotsContainer.innerHTML = "";
  dots = [];

  const perPage = getCardsPerPage();
  const pages = Math.ceil(cards.length / perPage);

  for (let i = 0; i < pages; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");

    dot.addEventListener("click", () => {
      const targetIndex = i * perPage;
      const target = cards[targetIndex];

      if (target) {
        gallery.scrollTo({
          left: target.offsetLeft,
          behavior: "smooth"
        });
      }
    });

    dotsContainer.appendChild(dot);
    dots.push(dot);
  }

  updateDots();
}

function updateDots() {
  let closestIndex = 0;
  let closestDistance = Infinity;

  const galleryCenter = gallery.scrollLeft + gallery.offsetWidth / 2;

  cards.forEach((card, i) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(galleryCenter - cardCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  });

  const perPage = getCardsPerPage();
  const pageIndex = Math.floor(closestIndex / perPage);

  dots.forEach(d => d.classList.remove("active"));
  if (dots[pageIndex]) dots[pageIndex].classList.add("active");
}

// arrows (usa movimento real do card)
function getScrollAmount() {
  const card = cards[0];
  const style = getComputedStyle(gallery);
  const gap = parseFloat(style.gap) || 0;

  return card.offsetWidth + gap;
}

btnLeft.addEventListener("click", () => {
  gallery.scrollBy({
    left: -getScrollAmount(),
    behavior: "smooth"
  });
});

btnRight.addEventListener("click", () => {
  gallery.scrollBy({
    left: getScrollAmount(),
    behavior: "smooth"
  });
});

// scroll update
gallery.addEventListener("scroll", updateDots);

// resize (recria dots corretamente)
window.addEventListener("resize", () => {
  createDots();
});

// init
createDots();