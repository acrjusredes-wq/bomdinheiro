
import React, { useState, useEffect } from 'react';
import Contract from './Contract';
import { SavedProposal } from '../types';
import { formatCurrency, numberToWords } from '../utils/formatters';

interface AdminAreaProps {
  proposals: SavedProposal[];
  onBack: () => void;
}

const AdminArea: React.FC<AdminAreaProps> = ({ proposals: localProposals, onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState(false);
  const [selectedClient, setSelectedClient] = useState<SavedProposal | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details' | 'contract' | 'cloud'>('list');
  const [cloudUrl, setCloudUrl] = useState(localStorage.getItem('afactoring_cloud_url') || '');
  const [cloudProposals, setCloudProposals] = useState<SavedProposal[]>([]);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);

  const allProposals = [...cloudProposals, ...localProposals].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.user === 'DomAmorim' && loginForm.pass === 'Kenneth1508') {
      setIsAuthenticated(true);
      setLoginError(false);
      fetchFromCloud();
    } else {
      setLoginError(true);
    }
  };

  const fetchFromCloud = async () => {
    if (!cloudUrl) return;
    setIsLoadingCloud(true);
    try {
      const response = await fetch(cloudUrl);
      const data = await response.json();
      if (Array.isArray(data)) setCloudProposals(data);
    } catch (e) {
      console.error("Erro ao baixar da nuvem:", e);
    } finally {
      setIsLoadingCloud(false);
    }
  };

  const saveCloudUrl = () => {
    localStorage.setItem('afactoring_cloud_url', cloudUrl);
    alert("URL da Nuvem Google salva com sucesso!");
    fetchFromCloud();
  };

  const downloadTxtContract = (data: SavedProposal) => {
    const text = `
INSTRUMENTO PARTICULAR DE CONFISSÃO DE DÍVIDA E TERMO DE ACORDO

CREDOR: KENNETH DEUBER ALMEIDA DE AMORIM, OAB/AL 18.523, CPF 045.556.404-38.
DEVEDOR: ${data.nome}
CPF: ${data.cpf}

VALOR TOTAL: ${formatCurrency(data.totalAmount)} (${numberToWords(data.totalAmount)})
PAGAMENTO: ${data.installments} parcelas de ${formatCurrency(data.installmentValue)}

VENCIMENTOS:
${data.installmentDates.map((d, i) => `Parcela ${i+1}: ${d}`).join('\n')}

Maceió-AL, ${new Date(data.submittedAt).toLocaleDateString('pt-BR')}
    `;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Contrato_Afactoring_${data.id}_${data.nome.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
            <h2 className="text-2xl font-black text-slate-900">Painel do Dr. Kenneth</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium tracking-tight uppercase">Gestão de Títulos Executivos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 tracking-widest">Usuário</label>
              <input 
                required 
                type="text" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-fintech-green outline-none transition-all font-semibold"
                value={loginForm.user}
                onChange={e => setLoginForm({...loginForm, user: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 tracking-widest">Senha</label>
              <input 
                required 
                type="password" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-fintech-green outline-none transition-all font-semibold"
                value={loginForm.pass}
                onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
              />
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">Acesso negado.</p>}
            <button type="submit" className="w-full bg-fintech-dark text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center text-lg mt-4">Entrar no Sistema</button>
          </form>
          <button onClick={onBack} className="w-full mt-6 text-slate-400 font-bold hover:text-slate-600 transition-colors text-xs uppercase tracking-widest">Voltar para a Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-fadeIn">
      <div className="flex justify-between items-end mb-10 print-hide">
        <div>
          <div className="flex items-center gap-2 text-fintech-green font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
            <span className={`w-2 h-2 rounded-full ${cloudUrl ? 'bg-fintech-green animate-pulse' : 'bg-orange-400'}`}></span> 
            {cloudUrl ? 'Sincronizado' : 'Nuvem Desconectada'}
          </div>
          <h1 className="text-4xl font-black text-slate-900">Gestão de Clientes</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setViewMode('cloud')} className="px-6 py-2 rounded-xl font-bold bg-blue-50 text-blue-600">☁️ Nuvem</button>
          <button onClick={() => setIsAuthenticated(false)} className="bg-slate-200 text-slate-600 px-6 py-2 rounded-xl font-bold">Sair</button>
        </div>
      </div>

      {viewMode === 'contract' && selectedClient ? (
        <div className="min-h-screen">
          <div className="max-w-4xl mx-auto mb-10 flex flex-wrap gap-4 justify-between items-center print-hide">
            <button onClick={() => setViewMode('list')} className="bg-white px-6 py-3 rounded-xl font-black text-slate-600 shadow-md border border-gray-100 hover:bg-slate-50">
              ← Voltar à Lista
            </button>
            <div className="flex gap-4">
               <button 
                onClick={() => downloadTxtContract(selectedClient)} 
                className="bg-slate-800 text-white px-6 py-3 rounded-xl font-black shadow-lg hover:bg-slate-900 transition-all flex items-center gap-2"
              >
                💾 Download (TXT)
              </button>
              <button 
                onClick={() => window.print()} 
                className="bg-fintech-green text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2"
              >
                🖨️ Imprimir / Salvar PDF
              </button>
            </div>
          </div>
          <div id="printable-contract">
            <Contract data={selectedClient} amount={selectedClient.amount} installments={selectedClient.installments} submissionDate={selectedClient.submittedAt} />
          </div>
        </div>
      ) : viewMode === 'cloud' ? (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 space-y-8">
           <div className="flex justify-between items-center">
             <h2 className="text-2xl font-black text-slate-900">Nuvem Google</h2>
             <button onClick={() => setViewMode('list')} className="text-slate-400 font-bold uppercase text-xs tracking-widest">Fechar</button>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
            <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">URL do WebApp</label>
            <div className="flex gap-2">
              <input type="text" className="flex-grow px-5 py-4 rounded-2xl border border-gray-200" value={cloudUrl} onChange={e => setCloudUrl(e.target.value)} />
              <button onClick={saveCloudUrl} className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black">Salvar</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-xl">Propostas ({allProposals.length})</h3>
            <button onClick={fetchFromCloud} className="text-xs font-black bg-blue-100 text-blue-700 px-4 py-2 rounded-full">🔄 Atualizar</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <th className="px-8 py-5">Data</th>
                  <th className="px-8 py-5">Devedor</th>
                  <th className="px-8 py-5">CPF</th>
                  <th className="px-8 py-5">Total</th>
                  <th className="px-8 py-5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allProposals.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 group">
                    <td className="px-8 py-5 text-sm text-slate-500">{formatDate(p.submittedAt)}</td>
                    <td className="px-8 py-5 font-bold text-slate-800 uppercase text-xs">{p.nome}</td>
                    <td className="px-8 py-5 text-sm font-mono text-slate-600">{p.cpf}</td>
                    <td className="px-8 py-5 font-black text-fintech-green">{formatCurrency(p.totalAmount || (p.amount * 1.2))}</td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => { setSelectedClient(p); setViewMode('contract'); }} className="text-white bg-fintech-dark px-6 py-2 rounded-xl font-bold text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-all">Ver Contrato</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArea;
