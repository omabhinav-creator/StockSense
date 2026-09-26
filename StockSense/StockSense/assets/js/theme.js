/* =========================================================
   STOCKSENSE — THEME TOGGLE (shared by every page)
   Works with two button styles:
   1. Icon button:  <button id="themeBtn"><i class="fa-solid fa-moon"></i></button>
   2. Text button:  <button class="theme-toggle">🌙 Dark</button>
========================================================= */
(function () {
  const STORAGE_KEY = "stocksense-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach(updateButtonLabel);
  }

  function updateButtonLabel(btn) {
    const theme = document.documentElement.getAttribute("data-theme") || "light";
    const icon = btn.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-moon", theme !== "dark");
      icon.classList.toggle("fa-sun", theme === "dark");
    } else {
      btn.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
  }

  // Apply saved theme immediately (before paint where possible)
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      updateButtonLabel(btn);
      btn.addEventListener("click", toggleTheme);
    });
  });

  window.StockSenseTheme = { toggle: toggleTheme, apply: applyTheme };
})();
