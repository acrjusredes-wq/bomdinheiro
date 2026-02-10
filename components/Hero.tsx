
import React from 'react';
import Simulator from './Simulator';

interface HeroProps {
  onStartRequest: (amount: number, installments: number) => void;
}

const Hero: React.FC<HeroProps> = ({ onStartRequest }) => {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-12 md:py-24 px-6">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-emerald-100/30 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-blue-100/30 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="text-center lg:text-left space-y-6">
          <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm mb-2 animate-bounce">
            🚀 Liberação Imediata
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1]">
            Crédito rápido, <br />
            <span className="text-fintech-green">simples</span> e sem burocracia.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 font-medium">
            Solicite de <span className="font-bold text-slate-800">R$100 a R$500</span> e receba via PIX direto na sua conta. Sem letras miúdas, com total transparência.
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
              className="bg-fintech-dark text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:bg-slate-800 transition-all"
            >
              Simular agora
            </button>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/50 rounded-2xl backdrop-blur-sm border border-white">
              <div className="flex -space-x-2">
                <img src="https://picsum.photos/seed/p1/32/32" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                <img src="https://picsum.photos/seed/p2/32/32" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                <img src="https://picsum.photos/seed/p3/32/32" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
              </div>
              <span className="text-xs font-bold text-slate-700">+10k clientes satisfeitos</span>
            </div>
          </div>
        </div>

        <div className="animate-float">
          <Simulator onStartRequest={onStartRequest} />
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
