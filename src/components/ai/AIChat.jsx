import React, { useRef, useEffect } from 'react';
import AIMessage from './AIMessage';
import AIInput from './AIInput';
import VerificationStatus from './VerificationStatus';

const AIChat = ({
  messages = [],
  onSendMessage,
  loading = false,
  onSelectSource,
  suggestions = [
    'Which universities offer Artificial Intelligence in Ethiopia?',
    'What are the admission requirements for AAU Medicine?',
    'Compare Addis Ababa University and ASTU engineering programs',
    'List fully funded scholarships for undergraduate students'
  ],
  className = ''
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className={`flex flex-col h-[650px] max-h-[85vh] border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm ${className}`}>
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            ✦
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">GIBIConnect AI Educational Consultant</h3>
            <p className="text-[11px] text-slate-500">Structured SQL-grounded retrieval from verified higher ed databases</p>
          </div>
        </div>
        <VerificationStatus status="DB Grounded" />
      </div>
      
      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-4 shadow-2xs">
              🤖
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">How can I assist your educational journey?</h4>
            <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
              Ask about Ethiopian university programs, tuition fees, faculty details, cutoff points, scholarships, or compare universities side by side.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <AIMessage 
              key={idx} 
              role={msg.role} 
              content={msg.content} 
              sources={msg.sources}
              timestamp={msg.timestamp}
              onSelectSource={onSelectSource}
            />
          ))
        )}
        
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium text-slate-600">
                Retrieving verified database records & formulating response...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input section */}
      <AIInput
        onSend={onSendMessage}
        disabled={loading}
        suggestions={messages.length === 0 ? suggestions : []}
      />
    </div>
  );
};

export default AIChat;
