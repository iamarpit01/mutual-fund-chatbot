export default function Sidebar({ chats, currentChatId, onNewChat, onSelectChat, onDeleteChat, currentView, onNavigate }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-sidebar-width bg-surface-container-low flex flex-col py-space-lg px-space-md z-30">
      {/* Brand Header */}
      <div className="mb-space-xl">
        <h1 className="font-headline-md text-headline-md font-bold text-primary leading-tight">Mutual Fund AI</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">Expert Financial Assistant</p>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 flex flex-col min-h-0 space-y-space-sm">
        {/* Active Tab: New Chat */}
        <button onClick={() => { onNewChat(); onNavigate('chat'); }} className={`w-full flex items-center gap-space-sm py-3 px-4 rounded-lg font-medium transition-all duration-200 active:scale-95 transition-transform duration-100 ${currentView === 'chat' ? 'text-primary font-bold bg-surface-container-high border-r-4 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: currentView === 'chat' ? "'FILL' 1" : "'FILL' 0" }}>add_comment</span>
          <span className="font-label-md text-label-md">New Chat</span>
        </button>
        <button onClick={() => onNavigate('market_insights')} className={`w-full flex items-center gap-space-sm py-3 px-4 rounded-lg font-medium transition-all duration-200 active:scale-95 ${currentView === 'market_insights' ? 'text-primary font-bold bg-surface-container-high border-r-4 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: currentView === 'market_insights' ? "'FILL' 1" : "'FILL' 0" }}>insights</span>
          <span className="font-label-md text-label-md">Fund Insights</span>
        </button>

        <div className="pt-space-lg flex flex-col flex-1 min-h-0">
          <h3 className="px-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2 opacity-50 shrink-0">Chat History</h3>
          <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pb-4">
            {chats && chats.length === 0 ? (
               <div className="text-sm text-on-surface-variant/50 px-4 italic">No previous chats</div>
            ) : (
              chats && chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => { onSelectChat(chat.id); onNavigate('chat'); }}
                  className={`w-full flex items-center justify-between pl-4 pr-2 py-2 rounded-lg font-medium transition-colors text-xs cursor-pointer group select-none ${
                    currentChatId === chat.id 
                      ? 'bg-surface-container-high text-primary' 
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="truncate flex-1 pr-2">{chat.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-error p-1 rounded transition-all duration-100 flex items-center justify-center hover:bg-surface-container-highest/20"
                    title="Delete Chat"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="mt-auto space-y-space-sm pt-space-lg border-t border-outline-variant/30">
        <button className="w-full flex items-center gap-space-sm py-2 px-4 rounded-lg text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-md text-label-md">Settings</span>
        </button>
        <button className="w-full flex items-center gap-space-sm py-2 px-4 rounded-lg text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">help</span>
          <span className="font-label-md text-label-md">Help Center</span>
        </button>
      </div>
    </aside>
  );
}
