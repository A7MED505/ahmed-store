// main.js

// Dark Mode Toggle: stores preference in localStorage
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  if (!toggle) return;
  // Use body instead of data-theme
  const current = localStorage.getItem('theme') || 'light';
  setTheme(current);
  updateIcon(current);

  toggle.addEventListener('click', () => {
    const theme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    setTheme(theme);
    localStorage.setItem('theme', theme);
    updateIcon(theme);
  });
});

function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

function updateIcon(theme) {
  const toggle = document.getElementById('darkModeToggle');
  if (!toggle) return;
  if (theme === 'dark') {
    toggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  } else {
    toggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
  }
}

// Main JS for UI interactions
