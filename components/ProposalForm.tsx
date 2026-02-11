import React, { useState, useEffect } from 'react';
import { WORK_SITUATIONS, RELATIONSHIPS } from '../constants';
import { FormStep, ProposalFormData } from '../types';
// PASSO 1: Importar o cliente do Supabase
import { createClient } from '@supabase/supabase-js';

// PASSO 2: Configurar a conexão com as chaves da Vercel
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ProposalFormProps {
  initialAmount: number;
  initialInstallments: number;
  onSuccess: (data: ProposalFormData) => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ initialAmount, initialInstallments, onSuccess }) => {
  const [step, setStep] = useState<FormStep>(FormStep.PERSONAL_INFO);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  
  const [formData, setFormData] = useState<ProposalFormData>({
    nome: '', nacionalidade: 'Brasileiro(a)', estadoCivil: 'Solteiro(a)', profissao: '', rg: '', orgaoEmissor: 'SSP',
    cpf: '', birthDate: '', whatsapp: '', email: '',
    cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
    renda: '', situacao: WORK_SITUATIONS[0], pix: '',
    ref1Nome: '', ref1Rel: RELATIONSHIPS[0], ref1Tel: '',
    ref2Nome: '', ref2Rel: RELATIONSHIPS[0], ref2Tel: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchAddress = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setCepLoading(true);
    setCepError('');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      if (!response.ok) throw new Error('Falha na rede');
      const data = await response.json();
      
      if (data.erro) {
        setCepError('CEP não encontrado.');
      } else {
        setFormData(prev => ({
          ...prev,
          rua: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setCepError('Erro ao buscar CEP online.');
    } finally {
      setCepLoading(false);
    }
  };

  useEffect(() => {
    const cleanCep = formData.cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      fetchAddress(cleanCep);
    }
  }, [formData.cep]);

  // PASSO 3: Modificar a função handleSubmit para salvar no banco
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === FormStep.PERSONAL_INFO) setStep(FormStep.ADDRESS);
    else if (step === FormStep.ADDRESS) setStep(FormStep.FINANCIAL);
    else if (step === FormStep.FINANCIAL) setStep(FormStep.DOCUMENTS);
    else if (step === FormStep.DOCUMENTS) setStep(FormStep.REFERENCES);
    else if (step === FormStep.REFERENCES) {
      setLoading(true);
      
      try {
        // Envia os dados para a tabela 'propostas' do Supabase
        const { error } = await supabase
          .from('propostas')
          .insert([
            { 
              nome_completo: formData.nome, 
              cpf: formData.cpf, 
              data_nascimento: formData.birthDate,
              valor_solicitado: initialAmount,
              status: 'Pendente'
              // Você pode adicionar mais campos aqui conforme a sua tabela crescer
            }
          ]);

        if (error) throw error;

        // Se deu certo, executa a função original de sucesso do site
        onSuccess(formData);
        
      } catch (err) {
        console.error("Erro ao salvar proposta:", err);
        alert("Erro ao enviar sua proposta para a nuvem. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: FormStep.PERSONAL_INFO, label: 'Dados' },
      { id: FormStep.ADDRESS, label: 'Endereço' },
      { id: FormStep.FINANCIAL, label: 'Financeiro' },
      { id: FormStep.DOCUMENTS, label: 'Documentos' },
      { id: FormStep.REFERENCES, label: 'Referências' }
    ];

    return (
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {steps.map((s, idx) => {
          const isActive = step === s.id;
          const isDone = steps.findIndex(x => x.id === step) > idx;
          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center min-w-[60px]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isActive ? 'bg-fintech-dark text-white scale-110' : 
                  isDone ? 'bg-fintech-green text-white' : 'bg-gray-200 text-slate-400'
                }`}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <span className={`text-[10px] mt-1 font-semibold uppercase tracking-tight ${isActive ? 'text-fintech-dark' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-[2px] flex-1 mx-2 min-w-[20px] ${isDone ? 'bg-fintech-green' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-12 border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 leading-tight">Proposta Digital</h2>
        <p className="text-slate-500 mt-2 font-medium">Solicitando <span className="font-bold text-fintech-green">R$ {initialAmount}</span> em <span className="font-bold text-fintech-green">{initialInstallments}x</span></p>
      </div>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === FormStep.PERSONAL_INFO && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo</label>
              <input required type="text" name="nome" value={formData.nome} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Ex: João Silva Santos" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nacionalidade</label>
                <input required type="text" name="nacionalidade" value={formData.nacionalidade} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Estado Civil</label>
                <select name="estadoCivil" value={formData.estadoCivil} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option>Solteiro(a)</option>
                  <option>Casado(a)</option>
                  <option>Divorciado(a)</option>
                  <option>Viúvo(a)</option>
                  <option>União Estável</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Profissão</label>
                <input required type="text" name="profissao" value={formData.profissao} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">RG</label>
                  <input required type="text" name="rg" value={formData.rg} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Emissor</label>
                  <input required type="text" name="orgaoEmissor" value={formData.orgaoEmissor} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="SSP" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">CPF</label>
                <input required type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Data de Nascimento</label>
                <input required type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp</label>
                <input required type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="seu@email.com" />
              </div>
            </div>
          </div>
        )}

        {step === FormStep.ADDRESS && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 relative">
                <label className="block text-sm font-bold text-slate-700 mb-1">CEP</label>
                <div className="relative">
                  <input 
                    required 
                    type="text" 
                    name="cep" 
                    maxLength={9}
                    value={formData.cep} 
                    onChange={handleInputChange} 
                    className={`w-full px-5 py-3.5 rounded-2xl bg-slate-50 border ${cepError ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-emerald-500 outline-none`} 
                    placeholder="00000-000" 
                  />
                  {cepLoading && <div className="absolute right-3 top-1/2 -translate-y-1/2"><div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}
                </div>
                {cepError && <span className="text-[10px] text-red-500 font-bold ml-1">{cepError}</span>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Rua / Logradouro</label>
                <input required type="text" name="rua" value={formData.rua} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Número</label>
                <input required type="text" name="numero" value={formData.numero} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-slate-700 mb-1">Complemento</label>
                <input type="text" name="complemento" value={formData.complemento} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Apto, Bloco, etc" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Bairro</label>
                <input required type="text" name="bairro" value={formData.bairro} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Cidade</label>
                <input required type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Estado</label>
                <input required type="text" name="estado" value={formData.estado} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="UF" />
              </div>
            </div>
          </div>
        )}

        {step === FormStep.FINANCIAL && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Renda Mensal</label>
                <input required type="text" name="renda" value={formData.renda} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="R$ 0.000,00" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Situação de Trabalho</label>
                <select name="situacao" value={formData.situacao} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none">
                  {WORK_SITUATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Chave PIX (Para o Depósito)</label>
              <input required type="text" name="pix" value={formData.pix} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-mono" placeholder="CPF, E-mail ou Celular" />
            </div>
          </div>
        )}

        {step === FormStep.DOCUMENTS && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-4 text-center">
              <p className="text-sm text-emerald-700 font-bold">⚠️ Atenção: Fotos nítidas agilizam sua aprovação!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">RG ou CNH (Frente)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center bg-slate-50 group hover:border-emerald-500 transition-all cursor-pointer relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">📄</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Anexar Documento</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Sua Selfie com Doc</label>
                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center bg-slate-50 group hover:border-emerald-500 transition-all cursor-pointer relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" capture="user" />
                  <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">📸</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tirar Foto</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === FormStep.REFERENCES && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-black text-slate-800 text-sm uppercase mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px]">1</span> Referência Pessoal
              </h4>
              <input required type="text" name="ref1Nome" value={formData.ref1Nome} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200 mb-3" placeholder="Nome Completo" />
              <div className="grid grid-cols-2 gap-4">
                <select name="ref1Rel" value={formData.ref1Rel} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200">
                  {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input required type="tel" name="ref1Tel" value={formData.ref1Tel} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200" placeholder="Telefone" />
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-black text-slate-800 text-sm uppercase mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px]">2</span> Referência Pessoal
              </h4>
              <input required type="text" name="ref2Nome" value={formData.ref2Nome} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200 mb-3" placeholder="Nome Completo" />
              <div className="grid grid-cols-2 gap-4">
                <select name="ref2Rel" value={formData.ref2Rel} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200">
                  {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input required type="tel" name="ref2Tel" value={formData.ref2Tel} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-200" placeholder="Telefone" />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-6">
          <button type="submit" disabled={loading} className="w-full bg-fintech-green hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center text-lg transform hover:scale-[1.02] active:scale-95">
            {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : step === FormStep.REFERENCES ? 'Finalizar e Enviar' : 'Continuar'}
          </button>
          {step !== FormStep.PERSONAL_INFO && (
            <button type="button" onClick={() => {
              if (step === FormStep.ADDRESS) setStep(FormStep.PERSONAL_INFO);
              else if (step === FormStep.FINANCIAL) setStep(FormStep.ADDRESS);
              else if (step === FormStep.DOCUMENTS) setStep(FormStep.FINANCIAL);
              else if (step === FormStep.REFERENCES) setStep(FormStep.DOCUMENTS);
            }} className="text-slate-400 font-bold hover:text-slate-700 transition-colors py-2 text-sm uppercase tracking-widest">Voltar</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;
