
import React from 'react';

const TrustSection: React.FC = () => {
  const items = [
    { icon: '🔒', title: 'Processo seguro', desc: 'Dados protegidos por criptografia bancária.' },
    { icon: '⚡', title: 'Aprovação rápida', desc: 'Análise inteligente em poucos minutos.' },
    { icon: '💎', title: 'Condições transparentes', desc: 'Sem taxas escondidas ou surpresas.' },
    { icon: '🤝', title: 'Atendimento humanizado', desc: 'Suporte real para pessoas reais.' },
  ];

  return (
    <section id="seguranca" className="py-20 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Transparência, rapidez e respeito pelo cliente.
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Nascemos para desburocratizar o acesso ao crédito para quem mais precisa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
              <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
