import { sendAIChat, getInstitutions } from './api.js';

let isThinking = false;

async function initAI() {
  const contextSelect = document.getElementById('ai-inst-context');
  if (contextSelect) {
    const instRes = await getInstitutions({ limit: 50 });
    if (instRes.success && instRes.data) {
      instRes.data.forEach(i => {
        const opt = document.createElement('option');
        opt.value = i.id;
        opt.textContent = i.name;
        contextSelect.appendChild(opt);
      });
    }
  }

  const form = document.getElementById('ai-chat-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSend();
    });
  }
}

async function handleSend(customPrompt = null) {
  if (isThinking) return;
  const input = document.getElementById('ai-prompt-input');
  const prompt = (customPrompt || input?.value || '').trim();
  if (!prompt) return;

  if (input) input.value = '';
  const contextSelect = document.getElementById('ai-inst-context');
  const institution_id = contextSelect?.value || null;

  const thread = document.getElementById('ai-chat-thread');
  if (!thread) return;

  // Append user message
  const userBubble = document.createElement('div');
  userBubble.className = 'flex justify-end';
  userBubble.innerHTML = `
    <div class="max-w-2xl bg-[#10B981] text-slate-950 font-medium rounded-2xl rounded-tr-none px-4 py-3 shadow-md text-xs sm:text-sm">
      ${prompt}
    </div>
  `;
  thread.appendChild(userBubble);

  // Append thinking bubble
  const thinkingBubble = document.createElement('div');
  thinkingBubble.id = 'ai-thinking-bubble';
  thinkingBubble.className = 'flex justify-start';
  thinkingBubble.innerHTML = `
    <div class="p-4 rounded-2xl rounded-tl-none border border-outline-variant/15 bg-surface-container-lowest text-xs text-on-surface-variant flex items-center gap-2">
      <span class="material-symbols-outlined animate-spin text-[#10B981] text-[18px]">sync</span> Grounding query against PostgreSQL pgvector & Llama 3.2...
    </div>
  `;
  thread.appendChild(thinkingBubble);
  thread.scrollTop = thread.scrollHeight;

  isThinking = true;
  const btn = document.getElementById('ai-send-btn');
  if (btn) btn.disabled = true;

  try {
    const res = await sendAIChat(prompt, institution_id);
    document.getElementById('ai-thinking-bubble')?.remove();

    const aiBubble = document.createElement('div');
    aiBubble.className = 'flex justify-start';

    if (res.success && res.data) {
      const answer = res.data.answer || 'Consultation complete.';
      const sources = res.data.sources || [];
      aiBubble.innerHTML = `
        <div class="max-w-2xl bg-surface-container-lowest text-primary rounded-2xl rounded-tl-none p-4 border border-outline-variant/15 shadow-sm">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/10 text-[10px] text-on-surface-variant">
            <span class="font-bold text-[#10B981] flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">smart_toy</span> GIBI Advisor</span>
            <span class="px-1.5 py-0.5 rounded font-mono text-[9px] bg-surface-container text-on-surface-variant">${res.data.intent || 'RAG'}</span>
          </div>
          <div class="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">${answer}</div>
          ${sources.length > 0 ? `
            <div class="mt-3 pt-2.5 border-t border-outline-variant/10">
              <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1 mb-1.5">
                <span class="material-symbols-outlined text-[14px] text-[#10B981]">menu_book</span> Verified Grounded Sources:
              </span>
              <div class="space-y-1">
                ${sources.map(s => `
                  <div class="p-2 rounded-lg text-[11px] flex items-center justify-between border border-outline-variant/10 bg-surface-container-low">
                    <span class="font-medium truncate max-w-xs">${s.title}</span>
                    <span class="text-[#10B981] font-bold text-[10px]">${s.similarity ? (Number(s.similarity) * 100).toFixed(0) + '% Match' : 'Verified'}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else {
      aiBubble.innerHTML = `
        <div class="max-w-2xl bg-surface-container-lowest text-rose-500 rounded-2xl rounded-tl-none p-4 border border-rose-500/20 text-xs">
          Unable to reach the AI reasoning engine. Please try your question again in a moment.
        </div>
      `;
    }
    thread.appendChild(aiBubble);
  } catch (e) {
    document.getElementById('ai-thinking-bubble')?.remove();
  }

  isThinking = false;
  if (btn) btn.disabled = false;
  thread.scrollTop = thread.scrollHeight;
  if (input) input.focus();
}

window.sendQuickPrompt = function(prompt) {
  handleSend(prompt);
};

document.addEventListener('DOMContentLoaded', initAI);
