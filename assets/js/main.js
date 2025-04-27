import { initializeThemeToggle } from "./modules/dark-mode.mjs";

/**
 * Removes the 'preload' class from `body` that stops transition animations
 * from firing during page load.
 */
const enableAnimations = (document) => {
  setTimeout(() => {
    document.body.classList.remove("preload");
  }, 200);
};

document.addEventListener("DOMContentLoaded", () => {
  initializeThemeToggle(window);
  enableAnimations(document);
});
