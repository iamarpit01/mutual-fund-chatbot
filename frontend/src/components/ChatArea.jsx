import WelcomeState from './WelcomeState';
import MessageBubble from './MessageBubble';
import { useEffect, useRef } from 'react';

export default function ChatArea({ messages, onSuggestionClick }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Facts-only Warning Banner */}
      <div className="flex-none px-space-lg pt-space-md">
        <div className="max-w-max-content-width mx-auto">
          <div className="bg-surface-container border border-outline-variant px-4 py-2 rounded-full flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">info</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Facts-only Assistant: Responses are based on regulatory filings and historical data.</span>
          </div>
        </div>
      </div>

      {/* Chat History Window */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-space-lg py-space-xl custom-scrollbar">
        <div className="max-w-max-content-width mx-auto space-y-space-xl">
          {messages.length === 0 ? (
            <WelcomeState onSuggestionClick={onSuggestionClick} />
          ) : (
            messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
