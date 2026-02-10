
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Olá! Sou o assistente da Afactoring. Como posso te ajudar com seu microcrédito hoje?' }
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
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const botMsg = await getGeminiResponse(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: botMsg }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Tive um problema de conexão. Por favor, tente novamente.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans chatbot-container print:hidden">
      {isOpen ? (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-[2.5rem] shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-fintech-dark p-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-fintech-green rounded-xl flex items-center justify-center text-fintech-dark font-black italic">Af</div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-tight">Suporte Afactoring</h4>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Sistema Ativo
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors text-xl">✕</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow p-5 space-y-4 overflow-y-auto bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${
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
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none flex gap-1.5 items-center shadow-sm">
                  <div className="w-1.5 h-1.5 bg-fintech-green rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-fintech-green rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-fintech-green rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-5 border-t border-gray-100 bg-white shrink-0">
            <div className="flex gap-2 bg-slate-100 rounded-2xl p-1.5 border border-slate-200 focus-within:ring-2 focus-within:ring-fintech-green transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Como podemos ajudar?"
                className="flex-grow px-3 py-2 bg-transparent text-sm focus:outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                className="bg-fintech-dark hover:bg-slate-800 disabled:opacity-50 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90"
              >
                ➔
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-3 font-bold uppercase tracking-widest">IA Afactoring v3.0</p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-fintech-dark hover:bg-slate-800 text-white w-16 h-16 rounded-3xl shadow-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110 active:scale-95 group relative border-4 border-white"
        >
          🤖
          <span className="absolute -top-1 -right-1 bg-fintech-green text-fintech-dark text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">AI</span>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
