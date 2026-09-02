import { store } from '../state/store.js';
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';

export function renderAIConsultationPage() {
  return `
    ${renderNavbar()}
    <main class="flex-grow w-full max-w-5xl mx-auto px-4 py-6 pt-20 flex flex-col h-[calc(100vh-2rem)]">
      <!-- Title Header -->
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/15">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-md">
            <span class="material-symbols-outlined text-white text-[20px]">auto_awesome</span>
          </div>
          <div>
            <h2 class="font-headline-md font-extrabold text-base text-primary">Grounded AI Academic Advisor</h2>
            <p class="text-[10px] text-on-surface-variant font-serif italic">Grounded with PostgreSQL 16 pgvector & Ollama Llama 3.2</p>
          </div>
        </div>

        <div>
          <select onchange="store.ai.selectedInstitutionContext=this.value; window.gibiApp.render();" class="px-3 py-1.5 rounded-xl border border-outline-variant/20 bg-surface-container-low text-xs focus:outline-none focus:border-[#10B981]">
            <option value="">National Context (All 18 Universities)</option>
            ${store.institutions.map(i => `
              <option value="${i.id}" ${store.ai.selectedInstitutionContext === i.id ? 'selected' : ''}>${i.name}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Messages Thread -->
      <div id="ai-chat-thread" class="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        ${store.ai.messages.map(msg => `
          <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
            <div class="max-w-2xl ${msg.role === 'user' ? 'bg-[#10B981] text-slate-950 font-medium rounded-2xl rounded-tr-none px-4 py-3 shadow-md' : 'bg-surface-container-lowest text-primary rounded-2xl rounded-tl-none p-4 border border-outline-variant/15 shadow-sm'}">
              
              ${msg.role === 'assistant' ? `
                <div class="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/10 text-[10px] text-on-surface-variant">
                  <span class="font-bold text-[#10B981] flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">smart_toy</span> GIBI Advisor
                  </span>
                  ${msg.intent ? `<span class="px-1.5 py-0.5 rounded font-mono text-[9px] bg-surface-container text-on-surface-variant">${msg.intent}</span>` : ''}
                </div>
              ` : ''}

              <div class="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">${msg.content}</div>

              <!-- Attributed Grounded Sources -->
              ${msg.sources && msg.sources.length > 0 ? `
                <div class="mt-3 pt-2.5 border-t border-outline-variant/10">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1 mb-1.5">
                    <span class="material-symbols-outlined text-[14px] text-[#10B981]">menu_book</span> Verified Grounded Sources:
                  </span>
                  <div class="space-y-1">
                    ${msg.sources.map(s => `
                      <div class="p-2 rounded-lg text-[11px] flex items-center justify-between border border-outline-variant/10 bg-surface-container-low">
                        <span class="font-medium truncate max-w-xs">${s.title}</span>
                        <span class="text-[#10B981] font-bold text-[10px]">
                          ${s.similarity ? (Number(s.similarity) * 100).toFixed(0) + '% Match' : 'Verified'}
                        </span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="text-[10px] text-on-surface-variant text-right mt-1 font-serif italic">${msg.timestamp}</div>
            </div>
          </div>
        `).join('')}

        ${store.ai.isThinking ? `
          <div class="flex justify-start">
            <div class="p-4 rounded-2xl rounded-tl-none border border-outline-variant/15 bg-surface-container-lowest text-xs text-on-surface-variant flex items-center gap-2">
              <span class="material-symbols-outlined animate-spin text-[#10B981] text-[18px]">sync</span> Grounding query against PostgreSQL pgvector & Llama 3.2...
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Quick Prompt Suggestions -->
      <div class="flex flex-wrap gap-2 py-2 text-[11px]">
        <button type="button" onclick="window.gibiApp.quickAsk('Which universities in Ethiopia offer Computer Science and Software Engineering?');" class="px-2.5 py-1 rounded-lg border border-outline-variant/20 bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition">
          💻 CS Programs
        </button>
        <button type="button" onclick="window.gibiApp.quickAsk('What are the admission requirements for graduate programs?');" class="px-2.5 py-1 rounded-lg border border-outline-variant/20 bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition">
          📋 Admission GPA
        </button>
        <button type="button" onclick="window.gibiApp.quickAsk('Tell me about scholarships available in Ethiopian universities');" class="px-2.5 py-1 rounded-lg border border-outline-variant/20 bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition">
          🎁 Scholarships
        </button>
      </div>

      <!-- Live Chat Input Form -->
      <form id="ai-chat-form" onsubmit="event.preventDefault(); window.gibiApp.sendAIMessage();" class="flex gap-2 pt-2">
        <input 
          id="ai-prompt-input" 
          type="text" 
          placeholder="Ask about Ethiopian universities, degree curricula, or admission requirements..." 
          value="${store.ai.input}" 
          oninput="store.ai.input=this.value;" 
          onkeydown="if(event.key==='Enter' && !event.shiftKey){ event.preventDefault(); window.gibiApp.sendAIMessage(); }" 
          class="flex-1 px-4 py-3 rounded-xl border border-outline-variant/25 bg-surface-container-low focus:bg-surface-container-lowest text-xs text-primary focus:ring-2 focus:ring-[#10B981] transition outline-none"
        >
        <button 
          id="ai-send-btn" 
          type="submit" 
          ${store.ai.isThinking ? 'disabled' : ''} 
          class="px-5 py-3 rounded-xl bg-[#10B981] hover:bg-[#0da271] text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
        >
          ${store.ai.isThinking ? '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span>' : '<span class="material-symbols-outlined text-[16px]">send</span>'}
          <span>${store.ai.isThinking ? 'Thinking...' : 'Send'}</span>
        </button>
      </form>
    </main>
  `;
}
