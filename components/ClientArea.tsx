import React, { useState } from 'react';
import { SavedProposal, ProposalStatus } from '../types';
import { formatCurrency } from '../utils/formatters';
// PASSO 1: Importar o cliente do Supabase
import { createClient } from '@supabase/supabase-js';

// PASSO 2: Configurar a conexão (utiliza as chaves que você salvou na Vercel)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ClientArea: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({ cpf: '', birthDate: '' });
  const [userProposals, setUserProposals] = useState<any[]>([]);

  // PASSO 3: Nova função de busca no Supabase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanInputCpf = loginData.cpf.replace(/\D/g, '');

      // Busca no banco de dados a tabela 'propostas'
      const { data, error: dbError } = await supabase
        .from('propostas')
        .select('*')
        .eq('cpf', cleanInputCpf)
        .eq('data_nascimento', loginData.birthDate);

      if (dbError) throw dbError;

      if (data && data.length > 0) {
        setUserProposals(data);
        setIsLogged(true);
      } else {
        setError('Nenhuma proposta encontrada. Verifique seu CPF e Data de Nascimento.');
      }
    } catch (err) {
      console.error('Erro de login:', err);
      setError('Erro ao acessar o banco de dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    // Ajustado para aceitar os textos que definimos no banco
    switch(status.toLowerCase()) {
      case 'aprovado': return { label: 'Aprovado', color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500', msg: 'Seu crédito foi aprovado! O contrato foi enviado para seu e-mail.' };
      case 'recusado': case 'rejected': return { label: 'Recusado', color: 'text-red-600', bg: 'bg-red-100', dot: 'bg-red-500', msg: 'Infelizmente sua proposta não foi aprovada neste momento.' };
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
  const statusInfo = getStatusDisplay(latest.status || 'Pendente');

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight uppercase">Olá, {latest.nome_completo?.split(' ')[0]}!</h1>
          <p className="text-slate-500 font-medium italic">Acompanhe suas solicitações abaixo.</p>
        </div>
        <button onClick={() => setIsLogged(false)} className="bg-slate-100 text-slate-500 font-black px-6 py-3 rounded-2xl transition-all text-xs uppercase tracking-widest border border-gray-200 hover:bg-slate-200">Sair</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2rem
