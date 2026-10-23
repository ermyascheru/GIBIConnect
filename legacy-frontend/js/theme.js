// Global Theme System
export function initTheme() {
  const saved = localStorage.getItem('gibi_theme') || 'dark';
  applyTheme(saved);
}

export function toggleTheme() {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('gibi_theme', next);
  applyTheme(next);
}

export function applyTheme(theme) {
  const root = document.documentElement;
  const icon = document.getElementById('theme-toggle-icon');
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    document.body.style.backgroundColor = '#0b0f17';
    document.body.style.color = '#f1f5f9';
    if (icon) icon.textContent = 'light_mode';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    document.body.style.backgroundColor = '#f7f9fb';
    document.body.style.color = '#191c1e';
    if (icon) icon.textContent = 'dark_mode';
  }
}

window.toggleTheme = toggleTheme;
initTheme();
