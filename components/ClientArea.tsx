
import React, { useState } from 'react';
import { SavedProposal, ProposalStatus } from '../types';
import { formatCurrency } from '../utils/formatters';

const ClientArea: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({ cpf: '', birthDate: '' });
  const [userProposals, setUserProposals] = useState<SavedProposal[]>([]);

  const findClientData = async (cpf: string, birthDate: string) => {
    const local = localStorage.getItem('afactoring_proposals');
    const allData: SavedProposal[] = local ? JSON.parse(local) : [];
    const cleanInputCpf = cpf.replace(/\D/g, '');
    
    return allData.filter(p => {
      const cleanDataCpf = p.cpf.replace(/\D/g, '');
      return cleanDataCpf === cleanInputCpf && p.birthDate === birthDate;
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const matches = await findClientData(loginData.cpf, loginData.birthDate);
      if (matches.length > 0) {
        setUserProposals(matches);
        setIsLogged(true);
      } else {
        setError('Nenhuma proposta encontrada. Verifique seus dados.');
      }
    } catch (err) {
      setError('Erro ao acessar sistema.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: ProposalStatus) => {
    switch(status) {
      case 'approved': return { label: 'Aprovado', color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500', msg: 'Seu crédito foi aprovado! O contrato foi enviado para seu e-mail.' };
      case 'rejected': return { label: 'Recusado', color: 'text-red-600', bg: 'bg-red-100', dot: 'bg-red-500', msg: 'Infelizmente sua proposta não foi aprovada neste momento.' };
      default: return { label: 'Em Análise', color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-500', msg: 'Estamos analisando seus documentos. Prazo de até 48h.' };
    }
  };

  if (!isLogged) {
    return (
      <div className="max-w-md mx-auto py-12 px-6">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-fintech-dark text-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl">
              <span className="italic font-black">Af</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">Área do Cliente</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Consulte o status da sua proposta</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="text" placeholder="Seu CPF" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-fintech-green outline-none" value={loginData.cpf} onChange={e => setLoginData({...loginData, cpf: e.target.value})} />
            <input required type="date" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-fintech-green outline-none" value={loginData.birthDate} onChange={e => setLoginData({...loginData, birthDate: e.target.value})} />
            {error && <p className="text-red-600 text-xs font-bold text-center">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-fintech-dark text-white font-black py-5 rounded-2xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center text-lg mt-4 disabled:opacity-50">
              {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Acessar Meu Painel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const latest = userProposals[0];
  const statusInfo = getStatusDisplay(latest.status);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight uppercase">Olá, {latest.nome.split(' ')[0]}!</h1>
          <p className="text-slate-500 font-medium italic">Acompanhe suas solicitações abaixo.</p>
        </div>
        <button onClick={() => setIsLogged(false)} className="bg-slate-100 text-slate-500 font-black px-6 py-3 rounded-2xl transition-all text-xs uppercase tracking-widest border border-gray-200 hover:bg-slate-200">Sair</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Resumo do Plano</span>
          <p className="text-3xl font-black text-slate-900 mt-2">{latest.installments}x de {formatCurrency(latest.installmentValue)}</p>
          <p className="text-xs text-slate-400 mt-2">Valor Total: {formatCurrency(latest.totalAmount)}</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 relative overflow-hidden">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Status Atual</span>
          <div className="mt-2 flex items-center gap-3">
             <div className={`w-3 h-3 ${statusInfo.dot} rounded-full animate-pulse`}></div>
             <p className={`text-2xl font-black ${statusInfo.color} uppercase`}>{statusInfo.label}</p>
          </div>
          <p className="text-slate-500 text-xs mt-3 font-bold leading-relaxed">{statusInfo.msg}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-slate-50">
          <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Histórico de Propostas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5">Protocolo</th>
                <th className="px-8 py-5">Data</th>
                <th className="px-8 py-5">Crédito</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userProposals.map(loan => (
                <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400">#{loan.id}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-700">{new Date(loan.submittedAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900">{formatCurrency(loan.amount)}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`${getStatusDisplay(loan.status).bg} ${getStatusDisplay(loan.status).color} px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter`}>
                      {getStatusDisplay(loan.status).label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientArea;
