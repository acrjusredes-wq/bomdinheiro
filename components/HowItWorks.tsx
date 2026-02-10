
import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    { title: 'Simule', desc: 'Escolha o valor e as parcelas ideais.' },
    { title: 'Proposta', desc: 'Preencha seus dados em 2 minutos.' },
    { title: 'Assine', desc: 'Assinatura digital rápida e segura.' },
    { title: 'Receba', desc: 'Dinheiro na sua conta via PIX.' },
  ];

  return (
    <section id="como-funciona" className="py-24 bg-slate-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-fintech-green font-bold tracking-widest uppercase text-sm">Passo a Passo</span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">Como solicitar seu crédito</h2>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-fintech-dark text-white rounded-3xl flex items-center justify-center text-2xl font-black mb-6 shadow-xl ring-8 ring-slate-50">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 mb-3">{step.title}</h3>
                <p className="text-slate-500 font-medium max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
