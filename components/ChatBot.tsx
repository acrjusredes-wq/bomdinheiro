
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Olá! Sou o assistente da Afactoring. Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const botMsg = await getGeminiResponse(userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: botMsg || 'Desculpe, não consegui processar sua dúvida.' }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {isOpen ? (
        <div className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-3xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-fintech-dark p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-fintech-green rounded-lg flex items-center justify-center text-sm font-bold">Af</div>
              <div>
                <h4 className="text-white font-bold text-sm">Assistente Afactoring</h4>
                <p className="text-emerald-400 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:opacity-70">✕</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-50 scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-fintech-dark text-white rounded-br-none' 
                    : 'bg-white text-slate-700 rounded-bl-none border border-gray-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida..."
              className="flex-grow px-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button 
              onClick={handleSend}
              className="bg-fintech-green hover:bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all active:scale-90"
            >
              ➔
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-fintech-dark hover:bg-slate-800 text-white w-16 h-16 rounded-3xl shadow-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110 active:scale-95 group relative"
        >
          🤖
          <span className="absolute -top-2 -right-2 bg-fintech-green text-fintech-dark text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">AI</span>
          <div className="absolute right-20 bg-fintech-dark text-white text-xs font-bold py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            Precisa de ajuda? Fale comigo!
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
