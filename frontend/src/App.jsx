import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputFooter from './components/InputFooter';
import MarketInsights from './components/MarketInsights';

function BackgroundEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-container/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}

function App() {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('allChats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        return [];
      }
    }
    const oldSaved = localStorage.getItem('chatHistory');
    if (oldSaved) {
      try {
        const parsed = JSON.parse(oldSaved);
        if (parsed && parsed.length > 0) {
           return [{ id: Date.now().toString(), title: 'Past Conversation', messages: parsed }];
        }
      } catch (err) {
        // Ignored
      }
    }
    return [];
  });
  
  const [currentChatId, setCurrentChatId] = useState(() => {
    return chats && chats.length > 0 ? chats[0].id : null;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('chat');
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? false : true;
  });

  // Effect to apply theme to document root
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('allChats', JSON.stringify(chats));
  }, [chats]);
  
  const currentChat = chats.find(c => c.id === currentChatId);
  const messages = currentChat ? currentChat.messages : [];

  const handleNewChat = () => {
    setCurrentChatId(null);
  };

  const handleSelectChat = (id) => {
    setCurrentChatId(id);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSendQuery = async (query) => {
    if (!query) return;

    let activeChatId = currentChatId;
    let newChatsState = [...chats];
    
    if (!activeChatId) {
      activeChatId = Date.now().toString();
      const newChat = { id: activeChatId, title: query, messages: [] };
      newChatsState = [newChat, ...newChatsState];
      setCurrentChatId(activeChatId);
    }
    
    const userMessage = { role: 'user', content: query };
    const botLoadingMsg = { role: 'bot', isLoading: true };

    setChats(newChatsState.map(chat => {
      if (chat.id === activeChatId) {
        return { ...chat, messages: [...chat.messages, userMessage, botLoadingMsg] };
      }
      return chat;
    }));
    
    setIsLoading(true);

    try {
      const chatForHistory = newChatsState.find(c => c.id === activeChatId);
      const historyToPass = chatForHistory ? chatForHistory.messages.slice(-6) : [];
      
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          history: historyToPass
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          const newMsgs = [...chat.messages];
          newMsgs[newMsgs.length - 1] = { role: 'bot', content: data.response };
          return { ...chat, messages: newMsgs };
        }
        return chat;
      }));
      
    } catch (error) {
      console.error(error);
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          const newMsgs = [...chat.messages];
          newMsgs[newMsgs.length - 1] = { 
            role: 'bot', 
            content: "⚠️ Sorry, I couldn't reach the backend server. Please ensure the API is running." 
          };
          return { ...chat, messages: newMsgs };
        }
        return chat;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = (idToDelete) => {
    const updatedChats = chats.filter(c => c.id !== idToDelete);
    setChats(updatedChats);
    if (currentChatId === idToDelete) {
      setCurrentChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
    }
  };

  return (
    <div className="font-body-md text-body-md overflow-hidden bg-background text-on-surface h-screen">
      <BackgroundEffect />
      <Sidebar 
        chats={chats} 
        currentChatId={currentChatId} 
        onNewChat={handleNewChat} 
        onSelectChat={handleSelectChat} 
        onDeleteChat={handleDeleteChat}
        currentView={currentView}
        onNavigate={setCurrentView}
      />
      
      <header className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-surface border-b border-outline-variant flex items-center justify-end px-space-lg ml-sidebar-width z-20">
        <div className="flex items-center gap-space-md">
          <button onClick={toggleTheme} className="p-2 text-on-surface-variant hover:text-primary transition-colors active:opacity-80">
            <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant ml-2">
            <img className="w-full h-full object-cover" alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnAClnm7rnv3h5v1BmtQwjaMn_31XVCTatBM4PQuCktAOkFwVRA00VfOShAsVTE5r-K6C2NEoJUpEuTTwBsOI-BX1sNCMojRcaxaoX_gI3x4H8InS-8MYOnENsmeErXLk-8jvmrAKdMK4L2-6f3Ok98v1Rc9_ZjBnA0-0ZQRAjiFA3UrH_R_ii24SGUNTt7cubFMDWDeszKWJMOThK-DWfmtQ5-nTYv2ZPEzXdbJGBBGVjTOBZdE3NBg"/>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="ml-sidebar-width pt-16 h-screen flex flex-col bg-transparent z-10 relative">
        {currentView === 'chat' ? (
          <>
            <ChatArea messages={messages} onSuggestionClick={handleSendQuery} />
            <InputFooter onSend={handleSendQuery} isLoading={isLoading} />
          </>
        ) : currentView === 'market_insights' ? (
          <MarketInsights />
        ) : null}
      </main>
    </div>
  );
}

export default App;
