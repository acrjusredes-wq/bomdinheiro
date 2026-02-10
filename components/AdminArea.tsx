
import React, { useState } from 'react';
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
    const divider = "------------------------------------------------------------";
    const text = `
INSTRUMENTO PARTICULAR DE CONFISSÃO DE DÍVIDA E TERMO DE ACORDO

CREDOR: KENNETH DEUBER ALMEIDA DE AMORIM, OAB/AL 18.523.
DEVEDOR: ${data.nome.toUpperCase()}
CPF: ${data.cpf}
DATA: ${new Date(data.submittedAt).toLocaleDateString('pt-BR')}

${divider}
CONFISSÃO DE VALORES
${divider}

VALOR DO CRÉDITO: ${formatCurrency(data.amount)}
TOTAL A PAGAR (COM JUROS): ${formatCurrency(data.totalAmount)}
EXTENSO: ${numberToWords(data.totalAmount).toUpperCase()}

PAGAMENTO: ${data.installments} parcelas de ${formatCurrency(data.installmentValue)}

CRONOGRAMA DE VENCIMENTOS:
${data.installmentDates.map((d, i) => `Parcela ${i+1}: Vencimento em ${d}`).join('\n')}

${divider}
INFORMAÇÕES ADICIONAIS
${divider}
PIX PARA DEPÓSITO DO CLIENTE: ${data.pix}
ENDEREÇO: ${data.rua}, ${data.numero}, ${data.bairro}, ${data.cidade}-${data.estado}

Este documento digital possui validade jurídica como título executivo extrajudicial.
Maceió-AL, ${new Date(data.submittedAt).toLocaleDateString('pt-BR')}
    `;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CONTRATO_AFACTORING_${data.cpf.replace(/\D/g, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            <h2 className="text-2xl font-black text-slate-900">Painel Administrativo</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium tracking-tight uppercase">Dr. Kenneth Amorim</p>
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
            {loginError && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">Dados incorretos.</p>}
            <button type="submit" className="w-full bg-fintech-dark text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-slate-800 transition-all text-lg mt-4">Acessar Painel</button>
          </form>
          <button onClick={onBack} className="w-full mt-6 text-slate-400 font-bold hover:text-slate-600 transition-colors text-xs uppercase tracking-widest">Sair</button>
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
            {cloudUrl ? 'Sincronizado' : 'Offline'}
          </div>
          <h1 className="text-4xl font-black text-slate-900">Gestão de Títulos</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setViewMode('cloud')} className="px-6 py-2 rounded-xl font-bold bg-blue-50 text-blue-600">Configurações</button>
          <button onClick={() => setIsAuthenticated(false)} className="bg-slate-200 text-slate-600 px-6 py-2 rounded-xl font-bold">Logout</button>
        </div>
      </div>

      {viewMode === 'contract' && selectedClient ? (
        <div className="min-h-screen">
          <div className="max-w-4xl mx-auto mb-10 flex flex-wrap gap-4 justify-between items-center print-hide">
            <button onClick={() => setViewMode('list')} className="bg-white px-6 py-3 rounded-xl font-black text-slate-600 shadow-md border border-gray-100 hover:bg-slate-50">
              ← Lista de Clientes
            </button>
            <div className="flex gap-4">
              <button 
                onClick={() => downloadTxtContract(selectedClient)} 
                className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-black hover:bg-slate-200 transition-all flex items-center gap-2"
              >
                💾 Baixar Contrato (.txt)
              </button>
              <button 
                onClick={() => window.print()} 
                className="bg-fintech-green text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2"
              >
                🖨️ Imprimir para PDF
              </button>
            </div>
          </div>
          <div id="printable-contract">
            <Contract data={selectedClient} amount={selectedClient.amount} installments={selectedClient.installments} submissionDate={selectedClient.submittedAt} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-xl">Solicitações Recebidas ({allProposals.length})</h3>
            <button onClick={fetchFromCloud} className="text-xs font-black bg-blue-100 text-blue-700 px-4 py-2 rounded-full">Atualizar Nuvem</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <th className="px-8 py-5">Data</th>
                  <th className="px-8 py-5">Cliente</th>
                  <th className="px-8 py-5">CPF</th>
                  <th className="px-8 py-5">Valor</th>
                  <th className="px-8 py-5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allProposals.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 group">
                    <td className="px-8 py-5 text-sm text-slate-500">{formatDate(p.submittedAt)}</td>
                    <td className="px-8 py-5 font-bold text-slate-800 uppercase text-xs">{p.nome}</td>
                    <td className="px-8 py-5 text-sm font-mono text-slate-600">{p.cpf}</td>
                    <td className="px-8 py-5 font-black text-fintech-green">{formatCurrency(p.totalAmount)}</td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => { setSelectedClient(p); setViewMode('contract'); }} className="text-white bg-fintech-dark px-6 py-2 rounded-xl font-bold text-[10px] uppercase transition-all shadow-md">Abrir Título</button>
                    </td>
                  </tr>
                ))}
                {allProposals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">Nenhuma proposta encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArea;
