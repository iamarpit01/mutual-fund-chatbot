import { TrendingUp, Wallet, User } from 'lucide-react';

export default function WelcomeState({ onSuggestionClick }) {
  const suggestions = [
    {
      icon: <TrendingUp className="text-primary mb-2 w-6 h-6" />,
      text: "What is the expense ratio of the Large Cap Fund?"
    },
    {
      icon: <Wallet className="text-primary mb-2 w-6 h-6" />,
      text: "What is the exit load for the Midcap fund?"
    },
    {
      icon: <User className="text-primary mb-2 w-6 h-6" />,
      text: "Who is the fund manager for the Corporate Bond fund?"
    }
  ];

  return (
    <div id="welcome-state">
      <div className="text-center py-stack-lg">
        <h2 className="text-4xl font-bold text-on-surface mb-4">
          Hello, how can I assist with your <span className="text-primary">portfolio</span> today?
        </h2>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
          Ask me objective facts about ICICI Prudential mutual fund schemes.
        </p>
      </div>
      
      {/* 3 Example Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-stack-lg">
        {suggestions.map((s, idx) => (
          <button 
            key={idx}
            onClick={() => onSuggestionClick(s.text)} 
            className="glass-card p-4 rounded-xl text-left border border-outline-variant hover:border-primary hover:shadow-md transition-all group active:scale-95 cursor-pointer"
          >
            {s.icon}
            <p className="font-bold block">{s.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
