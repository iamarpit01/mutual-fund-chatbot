import { Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function InputFooter({ onSend, isLoading }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-none px-space-lg pb-space-lg">
      <div className="max-w-max-content-width mx-auto">
        <div className="relative bg-surface-container-high rounded-[24px] p-2 flex items-end gap-2 shadow-sm focus-within:ring-1 focus-within:ring-primary/30 transition-all">
          <button className="p-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors self-end mb-0.5">
            <span className="material-symbols-outlined text-[20px]">attach_file</span>
          </button>
          
          <textarea 
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 border-none outline-none focus:ring-0 bg-transparent py-4 resize-none font-body-md text-on-surface placeholder:text-on-surface-variant/50 custom-scrollbar max-h-32 self-center" 
            placeholder="Ask your mutual fund query..." 
            rows={1}
          />
          
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-primary text-on-primary p-3.5 rounded-[16px] shadow-sm hover:opacity-90 active:scale-95 transition-all self-end mb-0.5 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
        
        <div className="flex justify-center items-center mt-3 px-2">
          <p className="text-[10px] tracking-widest uppercase font-bold text-on-surface-variant opacity-50">
            POWERED BY REG-TECH DATA ENGINE
          </p>
        </div>
      </div>
    </div>
  );
}
