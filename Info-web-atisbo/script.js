const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("top-nav");
const icon = toggle.querySelector("i");

toggle.addEventListener("click", (e) => {
  nav.classList.toggle("active");
  icon.classList.toggle("bx-menu");
  icon.classList.toggle("bx-x");
  e.stopPropagation();
});

document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && !toggle.contains(e.target)) {
    if (nav.classList.contains("active")) {
      nav.classList.remove("active");
      icon.classList.add("bx-menu");
      icon.classList.remove("bx-x");
    }
  }
});
