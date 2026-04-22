const gallery = document.getElementById("gallery");
const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");

btnLeft.addEventListener("click", () => {
  gallery.scrollBy({
    left: -320,
    behavior: "smooth"
  });
});

btnRight.addEventListener("click", () => {
  gallery.scrollBy({
    left: 320,
    behavior: "smooth"
  });
});

console.log("JS carregado");

btnRight.addEventListener("click", () => {
  console.log("RIGHT CLICK");
});