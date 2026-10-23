import { store } from './state/store.js';
import { themeState } from './state/theme.js';
import { apiCall } from './api/client.js';

import { renderLandingLoginPage } from './pages/LandingLoginPage.js';
import { renderExplorePage } from './pages/ExplorePage.js';
import { renderInstitutionsPage } from './pages/InstitutionsPage.js';
import { renderInstitutionDetailPage, loadDetailData } from './pages/InstitutionDetailPage.js';
import { renderProgramsPage } from './pages/ProgramsPage.js';
import { renderResourcesPage } from './pages/ResourcesPage.js';
import { renderAdmissionsPage } from './pages/AdmissionsPage.js';
import { renderScholarshipsPage } from './pages/ScholarshipsPage.js';
import { renderAIConsultationPage } from './pages/AIConsultationPage.js';
import { renderAdminPage } from './pages/AdminPage.js';
import { renderProfilePage } from './pages/ProfilePage.js';

class GibiConnectApp {
  constructor() {
    themeState.init();
    window.addEventListener('hashchange', () => this.handleRouting());
    window.addEventListener('theme-changed', () => this.render());
  }

  navigate(route) {
    store.activeRoute = route;
    window.location.hash = route;
    window.scrollTo(0, 0);
    this.render();
  }

  toggleTheme() {
    themeState.toggle();
    this.render();
  }

  toggleSearchDrawer() {
    const drawer = document.getElementById('search-drawer');
    if (!drawer) return;
    const isClosed = drawer.classList.contains('-translate-y-full');
    if (isClosed) {
      drawer.classList.remove('-translate-y-full');
      drawer.classList.add('translate-y-0');
      setTimeout(() => {
        document.getElementById('drawer-search-input')?.focus();
      }, 100);
    } else {
      drawer.classList.remove('translate-y-0');
      drawer.classList.add('-translate-y-full');
    }
  }

  quickSearch(query) {
    store.filters.search = query;
    store.filters.programSearch = query;
    this.toggleSearchDrawer();
    this.navigate('/institutions');
  }

  handleDrawerSearch(val) {
    const q = val.toLowerCase().trim();
    const resContainer = document.getElementById('drawer-search-results');
    if (!resContainer) return;

    if (!q) {
      resContainer.innerHTML = `
        <p class="text-xs text-on-surface-variant">Popular quick searches:</p>
        <div class="flex flex-wrap gap-2 items-center">
          <button onclick="window.gibiApp.quickSearch('Computer Science')" class="bg-surface-container hover:bg-emerald-50 hover:text-[#10B981] dark:hover:bg-emerald-950/60 px-3 py-1.5 rounded-lg text-xs text-on-surface transition-colors border border-outline-variant/10 flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-[14px]">search</span> Computer Science
          </button>
          <button onclick="window.gibiApp.quickSearch('Addis Ababa')" class="bg-surface-container hover:bg-emerald-50 hover:text-[#10B981] dark:hover:bg-emerald-950/60 px-3 py-1.5 rounded-lg text-xs text-on-surface transition-colors border border-outline-variant/10 flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-[14px]">location_on</span> Addis Ababa
          </button>
        </div>
      `;
      return;
    }

    const matchedInsts = store.institutions.filter(i => (i.name || '').toLowerCase().includes(q) || (i.city || '').toLowerCase().includes(q));
    const matchedProgs = store.programs.filter(p => (p.name || '').toLowerCase().includes(q));

    resContainer.innerHTML = `
      <div class="space-y-3">
        ${matchedInsts.length > 0 ? `
          <div>
            <div class="font-bold text-[11px] text-on-surface-variant uppercase mb-1">Universities (${matchedInsts.length})</div>
            <div class="space-y-1">
              ${matchedInsts.slice(0, 3).map(i => `
                <div onclick="window.gibiApp.toggleSearchDrawer(); window.gibiApp.navigate('/institutions/' + '${i.id}');" class="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer flex items-center justify-between">
                  <span class="font-bold text-primary">${i.name}</span>
                  <span class="text-[11px] text-on-surface-variant">${i.city}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${matchedProgs.length > 0 ? `
          <div>
            <div class="font-bold text-[11px] text-on-surface-variant uppercase mb-1">Degree Programs (${matchedProgs.length})</div>
            <div class="space-y-1">
              ${matchedProgs.slice(0, 3).map(p => `
                <div onclick="window.gibiApp.toggleSearchDrawer(); window.gibiApp.navigate('/programs/' + '${p.id}');" class="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer flex items-center justify-between">
                  <span class="font-bold text-primary">${p.name}</span>
                  <span class="text-[10px] text-[#10B981] uppercase font-bold">${p.degree_level}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${matchedInsts.length === 0 && matchedProgs.length === 0 ? `
          <div class="p-4 text-center text-xs text-on-surface-variant">No matching records found.</div>
        ` : ''}
      </div>
    `;
  }

  async login(email, password) {
    store.isLoading = true;
    store.error = null;
    this.render();
    const res = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    store.isLoading = false;
    if (res.success && res.data) {
      store.setUser(res.data.user, res.data.token);
      this.navigate('/explore');
    } else {
      store.error = res.message || 'Invalid email or password.';
      this.render();
    }
  }

  async handleAuthSubmit(form) {
    if (store.authMode === 'login') {
      await this.login(form.email.value, form.password.value);
    } else {
      if (form.password.value !== form.confirmPassword.value) {
        store.error = 'Passwords do not match.';
        this.render();
        return;
      }
      store.isLoading = true;
      store.error = null;
      this.render();
      const res = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          full_name: form.fullName.value,
          email: form.email.value,
          password: form.password.value,
          role: 'user'
        })
      });
      store.isLoading = false;
      if (res.success && res.data) {
        store.setUser(res.data.user, res.data.token);
        this.navigate('/explore');
      } else {
        store.error = res.message || 'Registration failed. Email might already exist.';
        this.render();
      }
    }
  }

  logout() {
    store.setUser(null, null);
    this.navigate('/');
  }

  quickAsk(prompt) {
    store.ai.input = prompt;
    this.sendAIMessage();
  }

  async sendAIMessage() {
    const inputEl = document.getElementById('ai-prompt-input');
    const prompt = (inputEl ? inputEl.value : store.ai.input).trim();
    if (!prompt || store.ai.isThinking) return;

    store.ai.messages.push({
      id: 'user_' + Date.now(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    store.ai.input = '';
    if (inputEl) inputEl.value = '';
    store.ai.isThinking = true;
    this.render();

    try {
      const res = await apiCall('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          institution_id: store.ai.selectedInstitutionContext || null
        })
      });

      store.ai.isThinking = false;
      if (res.success && res.data) {
        store.ai.messages.push({
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: res.data.answer || res.data.response || 'Academic advisor consultation completed.',
          sources: res.data.sources || [],
          intent: res.data.intent || 'RAG',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        store.ai.messages.push({
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: 'Unable to reach the AI reasoning engine right now. Please try your question again.',
          sources: [],
          intent: 'INFO',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (err) {
      store.ai.isThinking = false;
      store.ai.messages.push({
        id: 'ai_' + Date.now(),
        role: 'assistant',
        content: 'AI service is currently unavailable. Please check connectivity and try again.',
        sources: [],
        intent: 'ERROR',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    this.render();
    setTimeout(() => {
      document.getElementById('ai-prompt-input')?.focus();
    }, 50);
  }

  async approveResource(id) {
    const res = await apiCall(`/resources/${id}/approve`, { method: 'PATCH' });
    if (res.success) {
      store.pendingResources = store.pendingResources.filter(r => r.id !== id);
      alert('Resource approved successfully.');
      this.render();
    }
  }

  async rejectResource(id) {
    const reason = prompt('Rejection reason:') || 'Quality standards';
    const res = await apiCall(`/resources/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason })
    });
    if (res.success) {
      store.pendingResources = store.pendingResources.filter(r => r.id !== id);
      this.render();
    }
  }

  handleRouting() {
    const hash = window.location.hash.slice(1) || '/';
    store.activeRoute = hash;
    this.render();
  }

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    const route = store.activeRoute;

    if (route === '/' || route === '/login' || route === '/register') {
      app.innerHTML = renderLandingLoginPage();
    } else if (route === '/explore') {
      app.innerHTML = renderExplorePage();
    } else if (route === '/institutions') {
      app.innerHTML = renderInstitutionsPage();
    } else if (route.startsWith('/institutions/')) {
      const parts = route.split('/');
      const id = parts[2];
      const subtab = parts[3] || 'overview';
      loadDetailData(id, subtab);
      app.innerHTML = renderInstitutionDetailPage(subtab);
    } else if (route.startsWith('/programs')) {
      const parts = route.split('/');
      const progId = parts[2] || null;
      app.innerHTML = renderProgramsPage(progId);
    } else if (route.startsWith('/resources')) {
      app.innerHTML = renderResourcesPage();
    } else if (route.startsWith('/admissions')) {
      app.innerHTML = renderAdmissionsPage();
    } else if (route.startsWith('/scholarships')) {
      app.innerHTML = renderScholarshipsPage();
    } else if (route === '/ai-consultation') {
      app.innerHTML = renderAIConsultationPage();
    } else if (route === '/admin') {
      app.innerHTML = renderAdminPage();
    } else if (route === '/profile') {
      app.innerHTML = renderProfilePage();
    } else {
      app.innerHTML = renderExplorePage();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }

    const chatThread = document.getElementById('ai-chat-thread');
    if (chatThread) {
      chatThread.scrollTop = chatThread.scrollHeight;
    }
  }
}

window.gibiApp = new GibiConnectApp();
document.addEventListener('DOMContentLoaded', () => {
  window.gibiApp.render();
});
