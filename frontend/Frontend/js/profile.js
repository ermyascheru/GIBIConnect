import { getUser, getUserSavedItems, removeSavedInstitution, removeSavedProgram, removeSavedResource } from './api.js';

let activeBookmarkTab = 'institutions';
let savedData = { institutions: [], programs: [], scholarships: [], resources: [] };

async function initProfile() {
  const user = getUser();
  const container = document.getElementById('profile-container');
  if (!container) return;

  if (!user) {
    container.innerHTML = `
      <div class="p-8 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest text-center shadow-sm">
        <span class="material-symbols-outlined text-[48px] text-[#10B981] mx-auto mb-2">account_circle</span>
        <h2 class="text-lg font-bold text-primary">Scholar Workspace Access</h2>
        <p class="text-xs text-on-surface-variant mt-1">Please sign in to view your profile and saved bookmarks.</p>
        <a href="login.html" class="inline-block mt-4 px-4 py-2 rounded-xl bg-[#10B981] text-slate-950 font-bold text-xs">
          Sign In / Register
        </a>
      </div>
    `;
    return;
  }

  // Load saved items from backend
  const savedRes = await getUserSavedItems();
  if (savedRes.success && savedRes.data) {
    savedData = savedRes.data;
  }

  const totalSaved = (savedData.institutions?.length || 0) + 
                     (savedData.programs?.length || 0) + 
                     (savedData.scholarships?.length || 0) + 
                     (savedData.resources?.length || 0);

  container.innerHTML = `
    <div class="p-6 sm:p-8 rounded-3xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div class="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#10B981] border border-emerald-500/30 flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0">
        ${(user.full_name ? user.full_name.slice(0, 2) : 'SU').toUpperCase()}
      </div>
      <div class="flex-grow text-center sm:text-left space-y-1">
        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <h1 class="font-headline-lg text-xl sm:text-2xl font-extrabold text-primary">${user.full_name || 'Scholar Account'}</h1>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-[#10B981] border border-emerald-500/30">
            Verified ${user.role || 'Scholar'}
          </span>
        </div>
        <p class="text-xs text-on-surface-variant font-mono">${user.email}</p>
        <p class="text-xs text-on-surface-variant pt-1 font-serif italic">Member of Ethiopian Higher Education Digital Network</p>
      </div>
      <button onclick="window.gibiLogout()" class="px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition text-xs font-bold flex items-center gap-1.5 cursor-pointer">
        <span class="material-symbols-outlined text-[16px]">logout</span> Log Out
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest">
        <span class="text-[11px] text-on-surface-variant font-bold uppercase">Account Status</span>
        <div class="text-lg font-extrabold text-[#10B981] mt-1 capitalize">${user.status || 'Active'}</div>
      </div>
      <div class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest">
        <span class="text-[11px] text-on-surface-variant font-bold uppercase">Role Privilege</span>
        <div class="text-lg font-extrabold text-primary mt-1 uppercase text-sm">${user.role || 'User'}</div>
      </div>
      <div class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest">
        <span class="text-[11px] text-on-surface-variant font-bold uppercase">Saved Bookmarks</span>
        <div class="text-lg font-extrabold text-[#10B981] mt-1 text-sm">${totalSaved} Items Saved</div>
      </div>
    </div>

    <!-- Saved Bookmarks Section -->
    <div class="rounded-3xl p-6 sm:p-8 border border-outline-variant/15 bg-surface-container-lowest shadow-sm space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/10">
        <div>
          <h2 class="font-headline-md text-base sm:text-lg font-bold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981]">bookmark</span> My Saved Bookmarks & Favorites
          </h2>
          <p class="text-xs text-on-surface-variant mt-0.5">Quick access to bookmarked institutions, programs, scholarships, and resources.</p>
        </div>
      </div>

      <!-- Tab Switcher -->
      <div class="flex flex-wrap gap-2 text-xs font-bold border-b border-outline-variant/15 pb-2">
        <button id="tab-btn-institutions" onclick="window.switchBookmarkTab('institutions')" class="px-3.5 py-1.5 rounded-xl bg-[#10B981] text-slate-950 flex items-center gap-1.5 transition">
          <span class="material-symbols-outlined text-[15px]">assured_workload</span> Institutions (${savedData.institutions?.length || 0})
        </button>
        <button id="tab-btn-programs" onclick="window.switchBookmarkTab('programs')" class="px-3.5 py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary flex items-center gap-1.5 transition">
          <span class="material-symbols-outlined text-[15px]">school</span> Programs (${savedData.programs?.length || 0})
        </button>
        <button id="tab-btn-scholarships" onclick="window.switchBookmarkTab('scholarships')" class="px-3.5 py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary flex items-center gap-1.5 transition">
          <span class="material-symbols-outlined text-[15px]">workspace_premium</span> Scholarships (${savedData.scholarships?.length || 0})
        </button>
        <button id="tab-btn-resources" onclick="window.switchBookmarkTab('resources')" class="px-3.5 py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary flex items-center gap-1.5 transition">
          <span class="material-symbols-outlined text-[15px]">folder</span> Resources (${savedData.resources?.length || 0})
        </button>
      </div>

      <!-- Tab Body Container -->
      <div id="bookmark-tab-body"></div>
    </div>
  `;

  renderBookmarkTab();
}

function renderBookmarkTab() {
  const body = document.getElementById('bookmark-tab-body');
  if (!body) return;

  const items = savedData[activeBookmarkTab] || [];

  ['institutions', 'programs', 'scholarships', 'resources'].forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    if (btn) {
      if (t === activeBookmarkTab) {
        btn.className = 'px-3.5 py-1.5 rounded-xl bg-[#10B981] text-slate-950 font-bold flex items-center gap-1.5 shadow-xs';
      } else {
        btn.className = 'px-3.5 py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary font-bold flex items-center gap-1.5';
      }
    }
  });

  if (items.length === 0) {
    body.innerHTML = `
      <div class="p-12 text-center rounded-2xl border border-outline-variant/10 bg-surface-container-low text-on-surface-variant space-y-2">
        <span class="material-symbols-outlined text-[36px] text-on-surface-variant/60">bookmark_border</span>
        <p class="text-xs font-bold text-primary">No saved ${activeBookmarkTab} yet.</p>
        <p class="text-[11px] text-on-surface-variant">Click the bookmark icon across the directory to save items to your personal workspace.</p>
      </div>
    `;
    return;
  }

  if (activeBookmarkTab === 'institutions') {
    body.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${items.map(i => `
          <div class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-low flex items-center justify-between group">
            <div onclick="window.location.href='institution.html?id=${i.id}'" class="flex items-center gap-3 cursor-pointer flex-grow overflow-hidden">
              <img src="${i.logo_url || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100'}" alt="Logo" class="w-10 h-10 rounded-xl bg-white p-0.5 object-cover flex-shrink-0">
              <div class="overflow-hidden">
                <h4 class="font-bold text-xs text-primary group-hover:text-[#10B981] transition truncate">${i.name}</h4>
                <p class="text-[10px] text-on-surface-variant font-serif italic">${i.city}, ${i.region}</p>
              </div>
            </div>
            <button onclick="window.handleUnsaveInstitution('${i.id}')" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer" title="Remove bookmark">
              <span class="material-symbols-outlined text-[18px]">bookmark_remove</span>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  } else if (activeBookmarkTab === 'programs') {
    body.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${items.map(p => `
          <div class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-low flex items-center justify-between group">
            <div onclick="window.location.href='program.html?id=${p.id}'" class="cursor-pointer flex-grow overflow-hidden">
              <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-purple-500/20 text-purple-300">${p.degree_level}</span>
              <h4 class="font-bold text-xs text-primary group-hover:text-[#10B981] transition truncate mt-1">${p.name}</h4>
              <p class="text-[10px] text-[#10B981] font-bold">${p.institution_name}</p>
            </div>
            <button onclick="window.handleUnsaveProgram('${p.id}')" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer" title="Remove bookmark">
              <span class="material-symbols-outlined text-[18px]">bookmark_remove</span>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  } else if (activeBookmarkTab === 'resources') {
    body.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${items.map(r => `
          <div class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-low flex items-center justify-between">
            <div>
              <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300">${r.file_extension}</span>
              <h4 class="font-bold text-xs text-primary truncate max-w-[200px] mt-1">${r.title}</h4>
            </div>
            <div class="flex items-center gap-1">
              <a href="/api/resources/${r.id}/download" class="p-1.5 rounded-lg bg-[#10B981] text-slate-950 font-bold"><span class="material-symbols-outlined text-[16px]">download</span></a>
              <button onclick="window.handleUnsaveResource('${r.id}')" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"><span class="material-symbols-outlined text-[18px]">bookmark_remove</span></button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (activeBookmarkTab === 'scholarships') {
    body.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${items.map(s => `
          <div class="p-4 rounded-2xl border border-outline-variant/15 bg-surface-container-low flex items-center justify-between">
            <div>
              <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-500/20 text-amber-300">Grant</span>
              <h4 class="font-bold text-xs text-primary truncate max-w-[200px] mt-1">${s.name}</h4>
              <p class="text-[10px] text-[#10B981] font-bold">${s.funding}</p>
            </div>
            <a href="scholarships.html" class="text-xs text-[#10B981] font-bold hover:underline">View Aid</a>
          </div>
        `).join('')}
      </div>
    `;
  }
}

window.switchBookmarkTab = function(tabName) {
  activeBookmarkTab = tabName;
  renderBookmarkTab();
};

window.handleUnsaveInstitution = async function(id) {
  await removeSavedInstitution(id);
  initProfile();
};

window.handleUnsaveProgram = async function(id) {
  await removeSavedProgram(id);
  initProfile();
};

window.handleUnsaveResource = async function(id) {
  await removeSavedResource(id);
  initProfile();
};

document.addEventListener('DOMContentLoaded', initProfile);

