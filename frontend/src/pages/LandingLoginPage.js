import { store } from '../state/store.js';
import { themeState } from '../state/theme.js';
import { apiCall } from '../api/client.js';

export function renderLandingLoginPage() {
  const isDark = themeState.current === 'dark';
  const mode = store.authMode || 'login';

  return `
    <div class="min-h-screen flex flex-col lg:flex-row w-full bg-background text-on-background">
      <!-- Quick Top Theme Switcher -->
      <div class="fixed top-4 right-4 z-50">
        <button onclick="window.gibiApp.toggleTheme()" class="p-2 rounded-full bg-surface-container-lowest/80 dark:bg-slate-800/80 backdrop-blur-md text-on-surface-variant hover:text-[#10B981] transition-all shadow-md flex items-center justify-center border border-outline-variant/20 cursor-pointer" title="Toggle Theme">
          <span class="material-symbols-outlined text-[20px]">${isDark ? 'light_mode' : 'dark_mode'}</span>
        </button>
      </div>

      <!-- LEFT SHOWCASE COLUMN -->
      <div class="w-full lg:w-3/5 bg-gradient-to-b from-[#0b0f17] via-[#0F172A] to-[#0b0f17] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between items-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div class="hidden lg:block"></div>

        <!-- Centered Brand Identity -->
        <div class="my-auto py-12 flex flex-col items-center text-center z-10 space-y-5 animate-fade-in">
          <div class="relative group">
            <div class="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <img 
              src="/gibi_logo-removebg-preview.png" 
              alt="GIBIConnect Logo" 
              class="relative h-24 w-24 sm:h-32 sm:w-32 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            >
          </div>

          <div>
            <h1 class="font-headline-md text-3xl sm:text-5xl font-extrabold tracking-tight">
              <span class="text-[#10B981]">GIBI</span><span class="text-white">Connect</span>
            </h1>
            <p class="text-xs sm:text-sm text-slate-400 font-medium tracking-widest uppercase mt-2">
              Ethiopian Higher Education Directory & Grounded AI
            </p>
          </div>

          <!-- Feature Bullets -->
          <div class="flex flex-wrap justify-center gap-2 pt-4 max-w-md text-xs text-slate-300">
            <span class="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px] text-[#10B981]">verified</span> 18 Accredited Universities
            </span>
            <span class="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px] text-purple-400">school</span> 114 Degree Programs
            </span>
            <span class="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px] text-amber-400">smart_toy</span> Grounded AI Advisor
            </span>
          </div>
        </div>

        <div class="z-10 text-[11px] text-slate-500">
          <span>© 2026 GIBIConnect. All rights reserved.</span>
        </div>
      </div>

      <!-- RIGHT AUTHENTICATION COLUMN -->
      <div class="w-full lg:w-2/5 flex items-center justify-center px-6 py-8 sm:px-10 lg:px-8 xl:px-12 bg-surface-container-lowest overflow-y-auto">
        <div class="w-full max-w-sm space-y-4 my-auto animate-fade-in">
          
          <!-- Form Switcher Pill -->
          <div class="flex p-1 bg-surface-container-low rounded-2xl border border-outline-variant/15 text-xs font-bold w-full">
            <button 
              onclick="store.authMode='login'; store.error=null; window.gibiApp.render();" 
              class="flex-1 py-2 rounded-xl ${mode === 'login' ? 'bg-surface-container-lowest text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-primary'} transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onclick="store.authMode='register'; store.error=null; window.gibiApp.render();" 
              class="flex-1 py-2 rounded-xl ${mode === 'register' ? 'bg-surface-container-lowest text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-primary'} transition-all cursor-pointer"
            >
              Register
            </button>
          </div>

          <!-- Header Copy -->
          <div>
            <h2 class="font-headline-lg text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
              ${mode === 'login' ? 'Welcome back' : 'Create Scholar Account'}
            </h2>
            <p class="text-xs text-on-surface-variant mt-0.5">
              ${mode === 'login' ? 'Sign in to access your scholar workspace.' : 'Join the nationwide academic network across Ethiopia.'}
            </p>
          </div>

          <!-- Error Alert Banner -->
          ${store.error ? `
            <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">error</span>
              <span>${store.error}</span>
            </div>
          ` : ''}

          <!-- Authentication Form -->
          <form onsubmit="event.preventDefault(); window.gibiApp.handleAuthSubmit(this);" class="space-y-3 w-full">
            
            ${mode === 'register' ? `
              <div class="space-y-1">
                <label class="block text-xs font-bold text-primary">Full Name</label>
                <div class="relative w-full">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">person</span>
                  <input 
                    name="fullName" 
                    type="text" 
                    required
                    placeholder="e.g. Abebe Bikila" 
                    class="w-full bg-surface-container-low border border-outline-variant/25 rounded-xl py-2.5 pl-10 pr-4 text-xs text-primary focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
                  >
                </div>
              </div>
            ` : ''}

            <div class="space-y-1">
              <label class="block text-xs font-bold text-primary">Email Address</label>
              <div class="relative w-full">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">mail</span>
                <input 
                  name="email" 
                  type="email" 
                  required
                  placeholder="name@university.edu.et" 
                  class="w-full bg-surface-container-low border border-outline-variant/25 rounded-xl py-2.5 pl-10 pr-4 text-xs text-primary focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
                >
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-primary">Password</label>
              <div class="relative w-full">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">lock</span>
                <input 
                  id="auth-password"
                  name="password" 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  class="w-full bg-surface-container-low border border-outline-variant/25 rounded-xl py-2.5 pl-10 pr-10 text-xs text-primary focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
                >
                <button type="button" onclick="const el=document.getElementById('auth-password'); el.type = el.type === 'password' ? 'text' : 'password';" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                  <span class="material-symbols-outlined text-[18px]">visibility</span>
                </button>
              </div>
            </div>

            ${mode === 'register' ? `
              <div class="space-y-1">
                <label class="block text-xs font-bold text-primary">Confirm Password</label>
                <div class="relative w-full">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">lock_reset</span>
                  <input 
                    name="confirmPassword" 
                    type="password" 
                    required
                    placeholder="••••••••" 
                    class="w-full bg-surface-container-low border border-outline-variant/25 rounded-xl py-2.5 pl-10 pr-4 text-xs text-primary focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
                  >
                </div>
              </div>
            ` : ''}

            <button 
              type="submit" 
              ${store.isLoading ? 'disabled' : ''}
              class="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#0da271] text-slate-950 font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              ${store.isLoading ? '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span> Processing...' : (mode === 'login' ? 'Sign In to GIBIConnect' : 'Create Student Account')}
            </button>
          </form>

          <div class="pt-2 text-center">
            <a href="#/explore" class="text-xs text-on-surface-variant hover:text-[#10B981] font-semibold transition">
              Continue exploring as guest →
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}
