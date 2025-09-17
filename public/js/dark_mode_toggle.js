function applyDarkMode() {
  const isDark = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark-mode", isDark);

  const toggle = document.getElementById("darkModeToggle");
  if (toggle) {
    toggle.checked = isDark;
  }
}

function setupDarkModeToggle() {
  const toggle = document.getElementById("darkModeToggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      localStorage.setItem("darkMode", toggle.checked);
      applyDarkMode(); // Apply the change immediately
    });
  }
}

// Run when the page first loads
document.addEventListener("DOMContentLoaded", () => {
  applyDarkMode();
  setupDarkModeToggle();
});

// Run when the page is shown from the back-forward cache
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    applyDarkMode();
  }
});
