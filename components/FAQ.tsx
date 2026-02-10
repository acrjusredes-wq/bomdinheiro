
import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const questions = [
    {
      q: 'Quem pode solicitar o crédito?',
      a: 'Qualquer brasileiro maior de 18 anos, com CPF regular e comprovante de residência. Atendemos assalariados, autônomos e até negativados (sujeito à análise).'
    },
    {
      q: 'Como funciona a aprovação?',
      a: 'Nossa análise é automatizada e leva em conta diversos fatores. Após preencher a proposta, você recebe a resposta em poucos minutos via WhatsApp ou E-mail.'
    },
    {
      q: 'Quando recebo o dinheiro?',
      a: 'Após a aprovação e assinatura do contrato digital, o valor é transferido imediatamente via PIX para a chave informada na proposta.'
    },
    {
      q: 'Existem taxas escondidas?',
      a: 'Não. Na Afactoring somos 100% transparentes. Você sabe exatamente quanto vai pagar antes mesmo de fechar o contrato. A taxa é fixa em 20% ao mês.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Dúvidas Frequentes</h2>
          <p className="text-slate-500 font-medium">Tudo o que você precisa saber sobre o microcrédito da Afactoring.</p>
        </div>

        <div className="space-y-4">
          {questions.map((item, idx) => (
            <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none bg-slate-50/50"
              >
                <span className="font-bold text-slate-800 text-lg">{item.q}</span>
                <span className={`text-2xl transition-transform duration-300 ${openIdx === idx ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openIdx === idx ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-6 pt-0 text-slate-600 leading-relaxed font-medium">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
