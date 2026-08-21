import { Carousel } from './carousel';

document.addEventListener("DOMContentLoaded", () => {
  new Carousel(".work-carousel", ".slide", ".nav.prev", ".nav.next");

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const menuItems = document.getElementById("menu-items");

  if (menuToggle && menuItems) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuItems.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
});
