const gallery = document.getElementById("gallery");
const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
const cards = document.querySelectorAll(".card");
const dotsContainer = document.querySelector(".carousel-dots");
const heroCards = document.querySelectorAll(".hero-card");
const slots = document.querySelectorAll(".slot");

let dots = [];

/* =========================
   GALLERY (mantido)
========================= */

function getCardsPerPage() {
  if (window.innerWidth >= 768) return 2;
  return 1;
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
      const target = cards[i * perPage];

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
  let closest = 0;
  let minDist = Infinity;

  const center = gallery.scrollLeft + gallery.offsetWidth / 2;

  cards.forEach((card, i) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const dist = Math.abs(center - cardCenter);

    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  });

  const page = Math.floor(closest / getCardsPerPage());

  dots.forEach(d => d.classList.remove("active"));
  if (dots[page]) dots[page].classList.add("active");
}

btnLeft.addEventListener("click", () => {
  gallery.scrollBy({ left: -300, behavior: "smooth" });
});

btnRight.addEventListener("click", () => {
  gallery.scrollBy({ left: 300, behavior: "smooth" });
});

gallery.addEventListener("scroll", updateDots);
window.addEventListener("resize", createDots);

createDots();
let draggedCard = null;

/* START DRAG */
heroCards.forEach(card => {
  card.addEventListener("mousedown", () => {
    draggedCard = card;
    card.style.zIndex = 999;
    card.style.transition = "none";
  });
});

/* MOVE */
document.addEventListener("mousemove", (e) => {
  if (!draggedCard) return;

  draggedCard.style.position = "fixed";
  draggedCard.style.left = e.clientX - 110 + "px";
  draggedCard.style.top = e.clientY - 160 + "px";
});

/* DROP */
document.addEventListener("mouseup", () => {
  if (!draggedCard) return;

  let closestSlot = null;
  let minDist = Infinity;

  slots.forEach(slot => {
    const rect = slot.getBoundingClientRect();

    const dx = rect.left + rect.width / 2 - window.event.clientX;
    const dy = rect.top + rect.height / 2 - window.event.clientY;

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < minDist) {
      minDist = dist;
      closestSlot = slot;
    }
  });

  if (closestSlot && minDist < 200) {
    closestSlot.appendChild(draggedCard);

    draggedCard.style.position = "relative";
    draggedCard.style.left = "";
    draggedCard.style.top = "";
    draggedCard.style.transform = "none";
  } else {
    // voltar ao leque
    document.querySelector(".hero-cards-hand").appendChild(draggedCard);
    arrangeHeroCards();
  }

  draggedCard.style.transition = "0.25s ease";
  draggedCard = null;
});