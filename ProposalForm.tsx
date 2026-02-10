
import React, { useState, useEffect } from 'react';
import { WORK_SITUATIONS, RELATIONSHIPS } from '../constants';
import { FormStep, ProposalFormData } from '../types';

interface ProposalFormProps {
  initialAmount: number;
  initialInstallments: number;
  onSuccess: (data: ProposalFormData) => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ initialAmount, initialInstallments, onSuccess }) => {
  const [step, setStep] = useState<FormStep>(FormStep.PERSONAL_INFO);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  
  // Form State
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

  // CEP Integration
  useEffect(() => {
    const fetchAddress = async () => {
      const cleanCep = formData.cep.replace(/\D/g, '');
      if (cleanCep.length === 8) {
        setCepLoading(true);
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await response.json();
          if (!data.erro) {
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
        } finally {
          setCepLoading(false);
        }
      }
    };
    fetchAddress();
  }, [formData.cep]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === FormStep.PERSONAL_INFO) setStep(FormStep.ADDRESS);
    else if (step === FormStep.ADDRESS) setStep(FormStep.FINANCIAL);
    else if (step === FormStep.FINANCIAL) setStep(FormStep.DOCUMENTS);
    else if (step === FormStep.DOCUMENTS) setStep(FormStep.REFERENCES);
    else if (step === FormStep.REFERENCES) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSuccess(formData);
      }, 2000);
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
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900">Proposta de Crédito</h2>
        <p className="text-slate-500 mt-2">Você está solicitando <span className="font-bold text-fintech-green">R$ {initialAmount}</span> em <span className="font-bold text-fintech-green">{initialInstallments}x</span></p>
      </div>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === FormStep.PERSONAL_INFO && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
              <input required type="text" name="nome" value={formData.nome} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Como no seu documento" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nacionalidade</label>
                <input required type="text" name="nacionalidade" value={formData.nacionalidade} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Estado Civil</label>
                <select name="estadoCivil" value={formData.estadoCivil} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none">
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Profissão</label>
                <input required type="text" name="profissao" value={formData.profissao} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">RG</label>
                  <input required type="text" name="rg" value={formData.rg} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Emissor</label>
                  <input required type="text" name="orgaoEmissor" value={formData.orgaoEmissor} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="SSP" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">CPF</label>
                <input required type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Data de Nascimento</label>
                <input required type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp</label>
                <input required type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="seu@email.com" />
              </div>
            </div>
          </div>
        )}

        {step === FormStep.ADDRESS && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 relative">
                <label className="block text-sm font-semibold text-slate-700 mb-1">CEP</label>
                <input required type="text" name="cep" value={formData.cep} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="00000-000" />
                {cepLoading && <div className="absolute right-3 bottom-3.5"><div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Rua / Logradouro</label>
                <input required type="text" name="rua" value={formData.rua} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Nome da rua" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Número</label>
                <input required type="text" name="numero" value={formData.numero} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Complemento</label>
                <input type="text" name="complemento" value={formData.complemento} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ap, Bloco, etc" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Bairro</label>
                <input required type="text" name="bairro" value={formData.bairro} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Cidade</label>
                <input required type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Estado</label>
                <input required type="text" name="estado" value={formData.estado} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="UF" />
              </div>
            </div>
          </div>
        )}

        {step === FormStep.FINANCIAL && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Renda Mensal</label>
                <input required type="text" name="renda" value={formData.renda} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="R$ 0.000,00" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Situação de Trabalho</label>
                <select name="situacao" value={formData.situacao} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none">
                  {WORK_SITUATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Chave PIX (Para recebimento)</label>
              <input required type="text" name="pix" value={formData.pix} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="CPF, E-mail, Celular ou Aleatória" />
            </div>
          </div>
        )}

        {step === FormStep.DOCUMENTS && (
          <div className="space-y-6 animate-fadeIn">
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4 text-center">
              <p className="text-sm text-blue-700">Etapa final de validação</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                  <span className="text-2xl block mb-2">📄</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">Documento Frente</span>
               </div>
               <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                  <span className="text-2xl block mb-2">📸</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">Selfie com Doc</span>
               </div>
            </div>
          </div>
        )}

        {step === FormStep.REFERENCES && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">Referência 1</h4>
              <input required type="text" name="ref1Nome" value={formData.ref1Nome} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Nome completo" />
              <div className="grid grid-cols-2 gap-4">
                <select name="ref1Rel" value={formData.ref1Rel} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none">
                  {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input required type="tel" name="ref1Tel" value={formData.ref1Tel} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Telefone" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">Referência 2</h4>
              <input required type="text" name="ref2Nome" value={formData.ref2Nome} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Nome completo" />
              <div className="grid grid-cols-2 gap-4">
                <select name="ref2Rel" value={formData.ref2Rel} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none">
                  {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input required type="tel" name="ref2Tel" value={formData.ref2Tel} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Telefone" />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-6">
          <button type="submit" disabled={loading} className="w-full bg-fintech-green hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center">
            {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : step === FormStep.REFERENCES ? 'Finalizar Solicitação' : 'Continuar'}
          </button>
          {step !== FormStep.PERSONAL_INFO && (
            <button type="button" onClick={() => {
              if (step === FormStep.ADDRESS) setStep(FormStep.PERSONAL_INFO);
              else if (step === FormStep.FINANCIAL) setStep(FormStep.ADDRESS);
              else if (step === FormStep.DOCUMENTS) setStep(FormStep.FINANCIAL);
              else if (step === FormStep.REFERENCES) setStep(FormStep.DOCUMENTS);
            }} className="text-slate-500 font-semibold hover:text-slate-800 transition-colors">Voltar</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;
