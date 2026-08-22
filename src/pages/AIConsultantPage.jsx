import React, { useState } from 'react';
import AIChat from '../components/ai/AIChat';
import ConversationList from '../components/ai/ConversationList';

export default function AIConsultantPage({
  messages = [],
  onSendMessage,
  loading = false,
  onResetChat
}) {
  const [conversations, setConversations] = useState([
    { id: '1', title: 'AAU Software Engineering Cutoffs', date: 'Today' },
    { id: '2', title: 'ASTU vs AAU Engineering Matrix', date: 'Yesterday' },
    { id: '3', title: 'National STEM Grant Eligibility', date: '3 days ago' }
  ]);
  const [activeConvId, setActiveConvId] = useState('1');

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Background Photo */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900 text-white p-6 sm:p-10">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <img
            src="/images/181005columbia00088_cropped.jpg"
            alt="AI Consultant Background"
            className="w-full h-full object-cover filter brightness-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-blue-950/60" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/40 text-xs font-semibold text-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>GIBI-Connect Official Academic Advisor</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">AI Educational Consultant</h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Ask any question about Ethiopian universities, admissions cutoffs, scholarship deadlines, and degree requirements. All answers cite verified platform sources.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1">
          <ConversationList
            conversations={conversations}
            activeId={activeConvId}
            onSelectConversation={(id) => setActiveConvId(id)}
            onNewChat={onResetChat}
            onDeleteConversation={(id) => {
              setConversations(prev => prev.filter(c => c.id !== id));
            }}
          />
        </div>

        <div className="lg:col-span-3">
          <AIChat
            messages={messages}
            onSendMessage={onSendMessage}
            loading={loading}
            onSelectSource={(src) => alert(`Verified Source: ${src.title}`)}
          />
        </div>
      </div>
    </div>
  );
}
