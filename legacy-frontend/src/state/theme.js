// Global Theme System (Light / Dark Mode Token Provider)
export const themeState = {
  current: localStorage.getItem('gibi_theme') || 'dark', // 'dark' | 'light'
  
  init() {
    this.applyTheme(this.current);
  },

  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('gibi_theme', this.current);
    this.applyTheme(this.current);
    return this.current;
  },

  applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.style.backgroundColor = '#0B0E14';
      document.body.style.color = '#F1F5F9';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.style.backgroundColor = '#F8FAFC';
      document.body.style.color = '#0F172A';
    }
    
    // Dispatch custom event for reactive component re-rendering
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
  }
};
