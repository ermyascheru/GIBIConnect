import React from 'react';
import Button from '../common/Button';

const ConversationList = ({
  conversations = [], // [{ id: '1', title: 'AAU AI & Software Engineering programs', date: 'Today', active: true }]
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  className = ''
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-3 flex flex-col h-full shadow-xs ${className}`}>
      {/* New Chat Button */}
      <div className="mb-3">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={onNewChat}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          New Consultation
        </Button>
      </div>

      {/* Header */}
      <div className="px-2 py-1.5 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
        <span>Recent Chats</span>
        <span>{conversations.length}</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            No previous conversations.
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = activeId === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation?.(conv.id)}
                className={`group flex items-center justify-between p-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-100 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <svg className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="truncate">{conv.title || 'Consultation Session'}</span>
                </div>

                {onDeleteConversation && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded transition-opacity cursor-pointer shrink-0"
                    title="Delete conversation"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
