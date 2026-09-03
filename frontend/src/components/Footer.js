export function renderFooter() {
  return `
    <footer class="bg-surface-container-low border-t border-outline-variant/15 py-8 mt-12 text-xs text-on-surface-variant">
      <div class="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <img src="/gibi_logo-removebg-preview.png" alt="GIBIConnect" class="h-6 w-6 object-contain">
          <span class="font-headline-md font-bold text-primary"><span class="text-[#10B981]">GIBI</span>Connect</span>
          <span class="text-[11px] text-slate-400 ml-2">© 2026 Ethiopian Higher Education Network</span>
        </div>
        <div class="flex flex-wrap items-center gap-5 text-[11px]">
          <a href="#/explore" class="hover:text-[#10B981] transition">Explore</a>
          <a href="#/institutions" class="hover:text-[#10B981] transition">Institutions</a>
          <a href="#/programs" class="hover:text-[#10B981] transition">Programs</a>
          <a href="#/resources" class="hover:text-[#10B981] transition">Resources</a>
          <a href="#/admissions" class="hover:text-[#10B981] transition">Admissions</a>
          <a href="#/scholarships" class="hover:text-[#10B981] transition">Scholarships</a>
          <a href="#/ai-consultation" class="hover:text-[#10B981] transition">AI Advisor</a>
        </div>
      </div>
    </footer>
  `;
}
