
import React, { useState, useMemo } from 'react';
import { LOAN_TABLE } from '../constants';

interface SimulatorProps {
  onStartRequest: (amount: number, installments: number) => void;
}

const Simulator: React.FC<SimulatorProps> = ({ onStartRequest }) => {
  const [amount, setAmount] = useState(300);
  const [installments, setInstallments] = useState(3);

  const selectedLoan = useMemo(() => {
    return LOAN_TABLE.find(l => l.amount === amount) || LOAN_TABLE[0];
  }, [amount]);

  const installmentValue = selectedLoan.installments[installments];
  const totalToPay = installmentValue * installments;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Simule seu Crédito</h3>
      
      <div className="space-y-8">
        {/* Valor do Empréstimo */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Quanto você precisa?</label>
            <span className="text-2xl font-bold text-fintech-green">R$ {amount}</span>
          </div>
          <input
            type="range"
            min="100"
            max="500"
            step="100"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
            <span>R$ 100</span>
            <span>R$ 500</span>
          </div>
        </div>

        {/* Parcelas */}
        <div>
          <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Em quantas vezes?</label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setInstallments(num)}
                className={`py-3 rounded-xl font-bold transition-all duration-200 ${
                  installments === num
                    ? 'bg-fintech-dark text-white shadow-lg scale-105'
                    : 'bg-gray-50 text-slate-600 hover:bg-gray-100'
                }`}
              >
                {num}x
              </button>
            ))}
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 font-medium">Valor da parcela</span>
            <span className="text-xl font-bold text-slate-800">R$ {installmentValue.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-medium">Total a pagar</span>
            <span className="text-lg font-semibold text-slate-800">R$ {totalToPay.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-400">
              Taxa de juros: 20% a.m. aplicada sob o montante total. Transparência total Afactoring.
            </p>
          </div>
        </div>

        <button
          onClick={() => onStartRequest(amount, installments)}
          className="w-full bg-fintech-green hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-lg"
        >
          Solicitar agora
        </button>
      </div>
    </div>
  );
};

export default Simulator;
