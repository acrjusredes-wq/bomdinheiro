
import React, { useState, useEffect } from 'react';
import { SavedProposal } from '../types';
import { formatCurrency } from '../utils/formatters';

const ClientArea: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({ cpf: '', birthDate: '' });
  const [userProposals, setUserProposals] = useState<SavedProposal[]>([]);
  const [cloudUrl] = useState(localStorage.getItem('afactoring_cloud_url') || '');

  // Tenta carregar dados da nuvem se o CPF for válido
  const findClientData = async (cpf: string, birthDate: string) => {
    // 1. Busca no LocalStorage primeiro
    const local = localStorage.getItem('afactoring_proposals');
    let allData: SavedProposal[] = local ? JSON.parse(local) : [];

    // 2. Se tiver Nuvem configurada, tenta buscar os dados globais
    if (cloudUrl) {
      try {
        const response = await fetch(cloudUrl);
        const cloudData = await response.json();
        if (Array.isArray(cloudData)) {
          // Mescla e remove duplicados por ID
          allData = [...allData, ...cloudData].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        }
      } catch (e) {
        console.error("Erro ao sincronizar com nuvem no login do cliente:", e);
      }
    }

    // Limpa pontuação do CPF para comparar
    const cleanInputCpf = cpf.replace(/\D/g, '');
    
    // Filtra propostas do usuário
    const matches = allData.filter(p => {
      const cleanDataCpf = p.cpf.replace(/\D/g, '');
      return cleanDataCpf === cleanInputCpf && p.birthDate === birthDate;
    });

    return matches;
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
        setError('Nenhuma proposta encontrada para os dados informados. Verifique se o CPF e a Data de Nascimento estão corretos.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao acessar o sistema. Tente novamente.');
    } finally {
      setLoading(false);
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
            <p className="text-slate-500 text-sm mt-2 font-medium">Acesse suas propostas e contratos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 tracking-widest">Seu CPF</label>
              <input 
                required 
                type="text" 
                placeholder="000.000.000-00" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-fintech-green outline-none transition-all font-semibold"
                value={loginData.cpf}
                onChange={e => setLoginData({...loginData, cpf: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 tracking-widest">Data de Nascimento</label>
              <input 
                required 
                type="date" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-fintech-green outline-none transition-all font-semibold"
                value={loginData.birthDate}
                onChange={e => setLoginData({...loginData, birthDate: e.target.value})}
              />
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-red-600 text-xs font-bold text-center leading-relaxed">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-fintech-dark text-white font-black py-5 rounded-2xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center text-lg mt-4 disabled:opacity-50"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Entrar no Painel'}
            </button>
          </form>
          <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
            🔒 Ambiente Seguro e Criptografado <br/>
            Afactoring Intermediação de Crédito
          </p>
        </div>
      </div>
    );
  }

  // Pega a proposta mais recente para o resumo do dashboard
  const latest = userProposals[0];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-fintech-green font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
            <span className="w-2 h-2 bg-fintech-green rounded-full animate-pulse"></span> Sistema Ativo
          </div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">Olá, {latest.nome.split(' ')[0]}!</h1>
          <p className="text-slate-500 font-medium">Bem-vindo à sua central de crédito e contratos.</p>
        </div>
        <button 
          onClick={() => setIsLogged(false)}
          className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 font-black px-6 py-3 rounded-2xl transition-all text-xs uppercase tracking-widest border border-transparent hover:border-red-100"
        >
          Sair da Conta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl group-hover:scale-110 transition-transform">📊</div>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total de Propostas</span>
          <p className="text-4xl font-black text-slate-900 mt-2">{userProposals.length.toString().padStart(2, '0')}</p>
        </div>

        <div className="bg-fintech-dark p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">💰</div>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Próxima Parcela</span>
          <p className="text-4xl font-black text-fintech-green mt-2">{formatCurrency(latest.installmentValue)}</p>
          <div className="mt-4 flex items-center gap-2">
             <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full uppercase">Vencimento: {latest.installmentDates[0]}</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl">🛡️</div>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Status da Análise</span>
          <div className="mt-2 flex items-center gap-3">
             <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
             <p className="text-xl font-black text-blue-600 uppercase">Em Análise</p>
          </div>
          <p className="text-slate-400 text-[10px] mt-2 font-bold leading-relaxed italic">Nosso prazo médio é de 48h úteis.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Histórico de Contratos</h3>
          <span className="text-[10px] font-black text-slate-400 bg-slate-200 px-3 py-1 rounded-full">DADOS PROTEGIDOS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5">Identificador</th>
                <th className="px-8 py-5">Data Solicitação</th>
                <th className="px-8 py-5">Crédito Base</th>
                <th className="px-8 py-5">Confissão Total</th>
                <th className="px-8 py-5">Parcelas</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userProposals.map(loan => (
                <tr key={loan.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400">#{loan.id}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-700">{new Date(loan.submittedAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-500">{formatCurrency(loan.amount)}</td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900">{formatCurrency(loan.totalAmount)}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-500">{loan.installments}x de {formatCurrency(loan.installmentValue)}</td>
                  <td className="px-8 py-5 text-right">
                    <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter">
                      Em Análise
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-8 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-center justify-between group hover:bg-blue-100 transition-all cursor-pointer">
           <div>
              <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-1">Dúvidas sobre o contrato?</h4>
              <p className="text-blue-700 text-sm font-medium">Fale diretamente com nosso suporte jurídico.</p>
           </div>
           <span className="text-2xl group-hover:translate-x-2 transition-transform">💬</span>
        </div>
        <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center justify-between group hover:bg-emerald-100 transition-all cursor-pointer">
           <div>
              <h4 className="font-black text-emerald-900 uppercase text-xs tracking-widest mb-1">Pagamento via PIX</h4>
              <p className="text-emerald-700 text-sm font-medium">Envie seu comprovante para agilizar a baixa.</p>
           </div>
           <span className="text-2xl group-hover:translate-x-2 transition-transform">💸</span>
        </div>
      </div>
    </div>
  );
};

export default ClientArea;
