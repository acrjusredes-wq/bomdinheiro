
import React, { useState } from 'react';
import Contract from './Contract';
import { SavedProposal, ProposalStatus } from '../types';
import { formatCurrency, numberToWords } from '../utils/formatters';

interface AdminAreaProps {
  proposals: SavedProposal[];
  onBack: () => void;
  onUpdateStatus: (id: string, status: ProposalStatus) => void;
  onDelete: (id: string) => void;
}

const AdminArea: React.FC<AdminAreaProps> = ({ proposals: localProposals, onBack, onUpdateStatus, onDelete }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState(false);
  const [selectedClient, setSelectedClient] = useState<SavedProposal | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'profile' | 'contract'>('list');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.user === 'DomAmorim' && loginForm.pass === 'Kenneth1508') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const getStatusBadge = (status: ProposalStatus) => {
    switch(status) {
      case 'approved': return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Aprovado</span>;
      case 'rejected': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Recusado</span>;
      default: return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Pendente</span>;
    }
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString('pt-BR');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 animate-fadeIn">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-fintech-dark text-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl">
              <span className="italic font-black">Af</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">Painel Administrativo</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium tracking-tight uppercase">Seja bem-vindo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 tracking-widest">Usuário</label>
              <input 
                required 
                type="text" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-fintech-green outline-none font-semibold"
                value={loginForm.user}
                onChange={e => setLoginForm({...loginForm, user: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 tracking-widest">Senha</label>
              <input 
                required 
                type="password" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-fintech-green outline-none font-semibold"
                value={loginForm.pass}
                onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
              />
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">Dados incorretos.</p>}
            <button type="submit" className="w-full bg-fintech-dark text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-slate-800 transition-all text-lg mt-4">Acessar Painel</button>
          </form>
          <button onClick={onBack} className="w-full mt-6 text-slate-400 font-bold hover:text-slate-600 transition-colors text-xs uppercase tracking-widest">Sair</button>
        </div>
      </div>
    );
  }

  // Visualização da Ficha Cadastral Completa
  if (viewMode === 'profile' && selectedClient) {
    const p = selectedClient;
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setViewMode('list')} className="text-slate-500 font-bold flex items-center gap-2 hover:text-slate-800 transition-colors">
            ← Voltar para Lista
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => { setViewMode('contract') }}
              className="bg-slate-100 text-slate-600 px-6 py-2 rounded-xl font-bold text-xs uppercase"
            >
              Ver Contrato Completo
            </button>
            <button 
              onClick={() => { onDelete(p.id); setViewMode('list'); }}
              className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold text-xs uppercase hover:bg-red-100"
            >
              Excluir Cliente
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-slate-50 flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo: #{p.id}</span>
              <h2 className="text-3xl font-black text-slate-900 uppercase">{p.nome}</h2>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                <button 
                  onClick={() => onUpdateStatus(p.id, 'approved')}
                  className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase transition-all ${p.status === 'approved' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                >
                  Aprovar
                </button>
                <button 
                  onClick={() => onUpdateStatus(p.id, 'rejected')}
                  className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase transition-all ${p.status === 'rejected' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                >
                  Recusar
                </button>
              </div>
              {getStatusBadge(p.status)}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Bloco 1: Dados Pessoais */}
            <div className="space-y-6">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] border-b pb-2">Dados Pessoais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">CPF</p>
                  <p className="font-mono text-sm font-bold">{p.cpf}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Nascimento</p>
                  <p className="font-bold text-sm">{new Date(p.birthDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">RG</p>
                  <p className="font-bold text-sm">{p.rg} ({p.orgaoEmissor})</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Estado Civil</p>
                  <p className="font-bold text-sm">{p.estadoCivil}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">WhatsApp / Email</p>
                  <p className="font-bold text-sm">{p.whatsapp} | {p.email}</p>
                </div>
              </div>
            </div>

            {/* Bloco 2: Endereço */}
            <div className="space-y-6">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] border-b pb-2">Endereço</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Logradouro</p>
                  <p className="font-bold text-sm">{p.rua}, {p.numero} {p.complemento && `(${p.complemento})`}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Bairro</p>
                  <p className="font-bold text-sm">{p.bairro}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">CEP</p>
                  <p className="font-bold text-sm">{p.cep}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Cidade/UF</p>
                  <p className="font-bold text-sm">{p.cidade}/{p.estado}</p>
                </div>
              </div>
            </div>

            {/* Bloco 3: Financeiro */}
            <div className="space-y-6">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] border-b pb-2">Financeiro & PIX</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Renda Informada</p>
                  <p className="font-bold text-sm">{p.renda}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Situação</p>
                  <p className="font-bold text-sm">{p.situacao}</p>
                </div>
                <div className="col-span-2 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">Chave PIX para Depósito</p>
                  <p className="font-mono text-sm font-black text-emerald-900">{p.pix}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Crédito Solicitado</p>
                  <p className="font-black text-lg text-slate-900">{formatCurrency(p.amount)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Plano</p>
                  <p className="font-black text-lg text-slate-900">{p.installments}x de {formatCurrency(p.installmentValue)}</p>
                </div>
              </div>
            </div>

            {/* Bloco 4: Referências */}
            <div className="space-y-6">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] border-b pb-2">Referências Pessoais</h3>
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{p.ref1Rel}</p>
                  <p className="font-bold text-sm">{p.ref1Nome}</p>
                  <p className="text-xs text-slate-500">{p.ref1Tel}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{p.ref2Rel}</p>
                  <p className="font-bold text-sm">{p.ref2Nome}</p>
                  <p className="text-xs text-slate-500">{p.ref2Tel}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Visualização do Contrato Digital (Impressão)
  if (viewMode === 'contract' && selectedClient) {
    return (
      <div className="min-h-screen py-12 px-6">
        <div className="max-w-4xl mx-auto mb-10 flex flex-wrap gap-4 justify-between items-center print-hide">
          <button onClick={() => setViewMode('profile')} className="bg-white px-6 py-3 rounded-xl font-black text-slate-600 shadow-md border border-gray-100 hover:bg-slate-50">
            ← Voltar para Ficha
          </button>
          <button 
            onClick={() => window.print()} 
            className="bg-fintech-dark text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            🖨️ Imprimir Contrato
          </button>
        </div>
        <div id="printable-contract">
          <Contract data={selectedClient} amount={selectedClient.amount} installments={selectedClient.installments} submissionDate={selectedClient.submittedAt} />
        </div>
      </div>
    );
  }

  // Lista Principal
  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-fadeIn">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Gestão de Títulos</h1>
          <p className="text-slate-500 font-medium">Acompanhe e controle todas as solicitações de microcrédito.</p>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="bg-slate-200 text-slate-600 px-6 py-2 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 transition-all">Logout</button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-xl">Solicitações Recentes ({localProposals.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Data</th>
                <th className="px-8 py-5">Cliente</th>
                <th className="px-8 py-5">CPF</th>
                <th className="px-8 py-5">Valor Solicitado</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {localProposals.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 group">
                  <td className="px-8 py-5 text-sm text-slate-500">{formatDate(p.submittedAt)}</td>
                  <td className="px-8 py-5 font-bold text-slate-800 uppercase text-xs">{p.nome}</td>
                  <td className="px-8 py-5 text-sm font-mono text-slate-600">{p.cpf}</td>
                  <td className="px-8 py-5 font-black text-slate-900">{formatCurrency(p.amount)}</td>
                  <td className="px-8 py-5">{getStatusBadge(p.status)}</td>
                  <td className="px-8 py-5 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => { setSelectedClient(p); setViewMode('profile'); }} 
                      className="text-white bg-fintech-dark px-6 py-2 rounded-xl font-bold text-[10px] uppercase transition-all shadow-md hover:scale-105"
                    >
                      Ver Cadastro
                    </button>
                    <button 
                      onClick={() => onDelete(p.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      title="Excluir Permanentemente"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {localProposals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-medium">Nenhum título para gerenciar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminArea;
