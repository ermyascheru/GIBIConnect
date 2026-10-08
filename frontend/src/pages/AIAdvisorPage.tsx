import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, MessageSquare, Bookmark, Pin, 
  Send, Copy, Share2, FileText, Check,
  ThumbsUp, ThumbsDown, Sparkles, Mic,
  PanelLeftClose, PanelLeft, Bot, Sun, Moon
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  citations?: { title: string; page?: number }[];
}

interface ChatSession {
  id: string;
  title: string;
  isPinned?: boolean;
  date: string;
}

interface AIAdvisorPageProps {
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const AIAdvisorPage: React.FC<AIAdvisorPageProps> = ({ 
  theme: externalTheme, 
  onToggleTheme 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [internalTheme, setInternalTheme] = useState<'dark' | 'light'>('dark');
  const [activeSessionId, setActiveSessionId] = useState('1');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeTheme = externalTheme || internalTheme;

  const toggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      setInternalTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }
  };

  const pinnedSessions: ChatSession[] = [
    { id: 'p1', title: 'EUEE STEM Cutoff Strategy 2017', isPinned: true, date: 'Pinned' },
    { id: 'p2', title: 'AAU Medicine vs Jimma University CBE', isPinned: true, date: 'Pinned' },
    { id: 'p3', title: 'MoE Cost-Sharing Repayment Guide', isPinned: true, date: 'Pinned' },
    { id: 'p4', title: 'ASTU vs AASTU Software Engineering', isPinned: true, date: 'Pinned' },
    { id: 'p5', title: 'Women in STEM Leadership Grants', isPinned: true, date: 'Pinned' },
  ];

  const recentSessions: ChatSession[] = [
    { id: 'r1', title: 'Addis Ababa University Extension MBA Fees', date: 'Today' },
    { id: 'r2', title: 'Freshman Dormitory Allocation Process', date: 'Yesterday' },
    { id: 'r3', title: 'Hawassa University Forestry & Agribusiness', date: '3 days ago' },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'AI',
      timestamp: '10:42 AM',
      text: 'Hello Ermiyas! I am your GIBIConnect AI Academic Advisor, grounded in the official Ministry of Education catalogs, Ethiopian university registrar databases, and national cost-sharing regulations.\n\nHow can I assist your higher education journey today?',
    },
    {
      id: 'm2',
      sender: 'USER',
      timestamp: '10:43 AM',
      text: 'What are the matriculation requirements and cut-off points for Software Engineering at ASTU and AAU?',
    },
    {
      id: 'm3',
      sender: 'AI',
      timestamp: '10:43 AM',
      text: `Here is the verified matriculation breakdown for **Software Engineering** for the 2016/2017 E.C. academic year:\n\n### 1. Adama Science and Technology University (ASTU)\n• **Male Candidates Minimum Cut-Off**: 485+ points\n• **Female Candidates Minimum Cut-Off**: 460+ points\n• **Stream**: Natural Sciences with high scores in Mathematics & Physics\n• **Duration**: 5.0 Years (300 ECTS)\n• **Tuition**: 100% government-subsidized for regular students under the National Cost-Sharing Scheme (Proclamation No. 650/2009).\n\n### 2. Addis Ababa University (AAiT)\n• **Male Candidates Minimum Cut-Off**: 495+ points\n• **Female Candidates Minimum Cut-Off**: 475+ points\n• **Developing Region Quota**: 450+ points\n• **Campus**: 5 Kilo (King George VI) Campus\n• **Delivery**: Regular Day & Extension Evening available.\n\n**Tip**: If assigned via MoE, no additional entrance exam is required for undergraduate entry. For extension programs, per-credit tuition is **750 ETB / credit** at AAU and **650 ETB / credit** at ASTU.`,
      citations: [
        { title: 'ASTU Academic Catalog 2016/2017 E.C.', page: 14 },
        { title: 'AAiT School of Computing Admission Bulletin', page: 6 },
        { title: 'Ministry of Education National Placement Guidelines', page: 22 }
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userText,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputQuery('');

    // Simulated grounded response
    setTimeout(() => {
      let aiResponseText = `Based on the latest Ethiopian higher education registrar records regarding "${userText}":\n\n`;

      if (userText.toLowerCase().includes('cost') || userText.toLowerCase().includes('sharing') || userText.toLowerCase().includes('tuition')) {
        aiResponseText += `Under Ethiopian Higher Education Proclamation No. 650/2009, regular undergraduate students admitted to public institutions receive complete tuition, boarding, and meals funded by the government. After graduation and securing formal employment, 15% of your taxable income will be deducted incrementally to reimburse the cost-sharing fund. Extension and weekend courses require direct payment ranging from 650 to 1,350 ETB per credit hour.`;
      } else if (userText.toLowerCase().includes('medicine') || userText.toLowerCase().includes('doctor') || userText.toLowerCase().includes('aau')) {
        aiResponseText += `For Doctor of Medicine (MD) at Addis Ababa University (Tikur Anbessa Campus):\n• Duration: 6.0 Years (360 ECTS) + 1-Year Clinical Internship\n• 2016/2017 EUEE Cutoff: 540 (Male) / 520 (Female)\n• Quota: ~180 students admitted annually\n• Clinical Training: Tikur Anbessa Specialized Hospital with 850 inpatient beds.`;
      } else {
        aiResponseText += `All verified Ethiopian universities (including AAU, ASTU, AASTU, BDU, Jimma, and Hawassa) adhere to the central Ministry of Education matriculation framework.\n\nKey academic milestones:\n• Regular intake registration commences Meskerem 15–20 E.C.\n• Midterm examinations are held in Hidar\n• Academic degrees require 130–360 ECTS credits based on the specialization discipline.`;
      }

      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'AI',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiResponseText,
        citations: [
          { title: 'Ministry of Education Higher Education Directory', page: 8 },
          { title: 'National Cost-Sharing Directive Proclamation No. 650/2009' }
        ]
      };

      setMessages((prev) => [...prev, aiReply]);
    }, 900);
  };

  const startNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'AI',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'New advising session initialized. Ask me anything regarding Ethiopian university cutoffs, departments, tuition, curricula, or scholarships.',
      }
    ]);
  };

  const isDark = activeTheme === 'dark';

  return (
    <div className={`flex h-[calc(100vh-64px)] w-full overflow-hidden font-sans no-scrollbar transition-colors duration-200 ${
      isDark ? 'bg-black text-white' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR                                                              */}
      {/* ========================================================================= */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } transition-all duration-300 flex flex-col justify-between overflow-hidden shrink-0 z-20 no-scrollbar ${
          isDark 
            ? 'bg-black border-r border-zinc-800' 
            : 'bg-white border-r border-[#E2E8F0] shadow-sm'
        }`}
      >
        <div className="p-3.5 space-y-4 overflow-y-auto no-scrollbar">
          
          {/* Top Branding & Action */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shadow-sm ${
                isDark ? 'bg-white text-black' : 'bg-[#0C373D] text-[#5AA7A7]'
              }`}>
                <Bot className="w-4 h-4" />
              </div>
              <span className={`font-serif font-bold text-sm tracking-wide ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}>
                GIBI Advisor
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isDark 
                  ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' 
                  : 'hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
              }`}
              title="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border shadow-sm transition-all cursor-pointer ${
              isDark
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700'
                : 'bg-[#0C373D] hover:bg-[#072428] text-white border-[#0C373D]'
            }`}
          >
            <Plus className="w-4 h-4 text-[#5AA7A7]" />
            <span>New Advising Chat</span>
          </button>

          {/* Quick Academic Navigation Links */}
          <div className={`space-y-1 text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer text-left ${
              isDark ? 'hover:bg-zinc-900 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
            }`}>
              <Bookmark className="w-3.5 h-3.5 text-[#5AA7A7]" />
              <span>Academic Bookmarks</span>
            </button>
            <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer text-left ${
              isDark ? 'hover:bg-zinc-900 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
            }`}>
              <FileText className="w-3.5 h-3.5 text-[#5AA7A7]" />
              <span>Admission Guidelines PDF</span>
            </button>
          </div>

          {/* Pinned Sessions */}
          <div className="pt-2">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block mb-1 ${
              isDark ? 'text-zinc-400' : 'text-slate-400'
            }`}>
              Pinned Sessions
            </span>
            <div className="space-y-0.5">
              {pinnedSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all text-left truncate cursor-pointer ${
                    activeSessionId === session.id
                      ? (isDark ? 'bg-zinc-800 text-white font-semibold' : 'bg-[#EBF6F6] text-[#0C373D] font-bold')
                      : (isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')
                  }`}
                >
                  <Pin className={`w-3 h-3 shrink-0 rotate-45 ${isDark ? 'text-white' : 'text-[#5AA7A7]'}`} />
                  <span className="truncate">{session.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="pt-2">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider block mb-1 ${
              isDark ? 'text-zinc-400' : 'text-slate-400'
            }`}>
              Recent Conversations
            </span>
            <div className="space-y-0.5">
              {recentSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all text-left truncate cursor-pointer ${
                    activeSessionId === session.id
                      ? (isDark ? 'bg-zinc-800 text-white font-semibold' : 'bg-slate-100 text-slate-900 font-bold')
                      : (isDark ? 'text-zinc-400 hover:bg-zinc-900 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')
                  }`}
                >
                  <MessageSquare className="w-3 h-3 shrink-0 opacity-60" />
                  <span className="truncate">{session.title}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* User Profile Card at Sidebar Bottom */}
        <div className={`p-3 border-t ${isDark ? 'border-zinc-800 bg-black' : 'border-slate-200 bg-slate-50'}`}>
          <div className={`flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer ${
            isDark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white hover:bg-slate-100 border border-slate-200/80 shadow-sm'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
              isDark ? 'bg-white text-black' : 'bg-[#0C373D] text-[#5AA7A7]'
            }`}>
              EH
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Ermiyas Cheru Hailu</p>
              <p className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600 font-medium'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified Student
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* RIGHT MAIN CHAT AREA                                                      */}
      {/* ========================================================================= */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden relative no-scrollbar ${
        isDark ? 'bg-black' : 'bg-[#F8FAFC]'
      }`}>
        
        {/* Top Header Bar */}
        <header className={`h-14 border-b px-6 flex items-center justify-between shrink-0 backdrop-blur-md z-10 ${
          isDark 
            ? 'border-zinc-800 bg-black/90' 
            : 'border-slate-200 bg-white/90 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  isDark 
                    ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' 
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
                title="Open sidebar"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <h2 className={`font-serif font-bold text-sm truncate ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Ethiopian Higher Education Academic Advisory
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDark 
                  ? 'text-black bg-white' 
                  : 'text-emerald-800 bg-emerald-50 border border-emerald-200'
              }`}>
                100% Grounded
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer border ${
                isDark 
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={() => alert('Exporting advisory conversation to PDF...')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer border ${
                isDark 
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            <button
              onClick={() => alert('Sharing advising transcript link...')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                isDark 
                  ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' 
                  : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </header>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-12 md:px-24 py-8 space-y-8 no-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'} space-y-2`}
              >
                {/* User Message Bubble */}
                {msg.sender === 'USER' ? (
                  <div className={`max-w-xl rounded-2xl rounded-tr-sm px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                    isDark 
                      ? 'bg-zinc-800 text-white border border-zinc-700' 
                      : 'bg-slate-900 text-white'
                  }`}>
                    {msg.text}
                  </div>
                ) : (
                  /* AI Advisor Message Block */
                  <div className="w-full space-y-3">
                    <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                        isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'
                      }`}>
                        G
                      </div>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>GIBI Academic Advisor</span>
                      <span>•</span>
                      <span className="text-[11px] opacity-70">{msg.timestamp}</span>
                    </div>

                    <div className={`text-sm leading-relaxed p-6 rounded-2xl border shadow-sm space-y-3 whitespace-pre-line ${
                      isDark 
                        ? 'text-zinc-100 bg-zinc-950 border-zinc-800' 
                        : 'text-slate-800 bg-white border-slate-200'
                    }`}>
                      {msg.text}

                      {/* Grounded Citations Pill Box */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className={`mt-4 pt-3 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                          <p className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-2 ${
                            isDark ? 'text-zinc-400' : 'text-slate-400'
                          }`}>
                            <Sparkles className="w-3 h-3" /> Grounded Source Citations
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.citations.map((cit, cIdx) => (
                              <span
                                key={cIdx}
                                className={`text-[11px] px-2.5 py-1 rounded-lg font-mono font-medium flex items-center gap-1 border ${
                                  isDark 
                                    ? 'bg-zinc-900 text-white border-zinc-700' 
                                    : 'bg-slate-50 text-slate-800 border-slate-200'
                                }`}
                              >
                                [Source: {cit.title} {cit.page ? `• p. ${cit.page}` : ''}]
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Toolbar Under AI Message */}
                    <div className={`flex items-center gap-3 text-xs pt-1 pl-1 ${
                      isDark ? 'text-zinc-400' : 'text-slate-500'
                    }`}>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className={`transition-all flex items-center gap-1 cursor-pointer ${
                          isDark ? 'hover:text-white' : 'hover:text-slate-900'
                        }`}
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button 
                        onClick={() => alert('Generating PDF transcript...')}
                        className={`transition-all flex items-center gap-1 cursor-pointer ${
                          isDark ? 'hover:text-white' : 'hover:text-slate-900'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Convert to PDF</span>
                      </button>

                      <button className={`transition-all cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`} title="Helpful">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      <button className={`transition-all cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`} title="Not helpful">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className={`p-4 sm:p-6 border-t shrink-0 ${
          isDark ? 'bg-black border-zinc-800' : 'bg-white border-[#E2E8F0]'
        }`}>
          <div className="max-w-3xl mx-auto space-y-3">
            
            {/* Input Bar Pill */}
            <form
              onSubmit={handleSend}
              className={`relative flex items-center border rounded-2xl p-1.5 shadow-md transition-all ${
                isDark 
                  ? 'bg-zinc-950 border-zinc-800 focus-within:border-[#5AA7A7]' 
                  : 'bg-[#F8FAFC] border-[#E2E8F0] focus-within:border-[#5AA7A7] focus-within:bg-white'
              }`}
            >
              {/* Attach Button */}
              <button
                type="button"
                onClick={() => alert('Attach Ethiopian EUEE result transcript or matriculation certificate...')}
                className={`p-2 rounded-xl transition-all cursor-pointer ml-1 ${
                  isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
                }`}
                title="Attach Document"
              >
                <Plus className="w-4 h-4 text-[#5AA7A7]" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder="Ask anything about Ethiopian universities, admissions, cutoffs, or scholarships..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className={`flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none ${
                  isDark 
                    ? 'text-white placeholder:text-zinc-500' 
                    : 'text-[#0F172A] placeholder:text-[#64748B]'
                }`}
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-1 mr-1">
                <button
                  type="button"
                  onClick={() => alert('Voice input activated. Speak your query in English or Amharic...')}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
                  }`}
                  title="Voice Input"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!inputQuery.trim()}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    inputQuery.trim()
                      ? (isDark ? 'bg-white text-black hover:bg-zinc-200 shadow-md font-bold' : 'bg-[#0C373D] text-[#5AA7A7] hover:bg-[#072428] shadow-md')
                      : (isDark ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed')
                  }`}
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            <p className={`text-[11px] text-center ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              GIBI Advisor answers are grounded in official Ethiopian Ministry of Education & University Registrar records.
            </p>
          </div>
        </div>

      </main>

    </div>
  );
};