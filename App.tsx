
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustSection from './components/TrustSection';
import HowItWorks from './components/HowItWorks';
import ProposalForm from './components/ProposalForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import ClientArea from './components/ClientArea';
import AdminArea from './components/AdminArea';
import { FormStep, ProposalFormData, SavedProposal } from './types';
import { formatCurrency, numberToWords, generateInstallmentDates } from './utils/formatters';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.SIMULATION);
  const [loanData, setLoanData] = useState({ amount: 300, installments: 3 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposals, setProposals] = useState<SavedProposal[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('afactoring_proposals');
      if (saved) {
        setProposals(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Erro ao carregar dados locais:", e);
    }
  }, []);

  const startRequest = (amount: number, installments: number) => {
    setLoanData({ amount, installments });
    setCurrentStep(FormStep.PERSONAL_INFO);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToClientArea = () => {
    setCurrentStep(FormStep.CLIENT_AREA);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdminArea = () => {
    setCurrentStep(FormStep.ADMIN_AREA);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatContractForEmail = (data: SavedProposal) => {
    const date = new Date(data.submittedAt).toLocaleDateString('pt-BR');
    const vencimentos = data.installmentDates.map((d, i) => `Parcela ${i+1}: ${d}`).join('\n');

    return `
INSTRUMENTO PARTICULAR DE CONFISSÃO DE DÍVIDA E TERMO DE ACORDO

CREDOR: KENNETH DEUBER ALMEIDA DE AMORIM, OAB/AL 18.523, CPF 045.556.404-38.

DEVEDOR: ${data.nome}
CPF: ${data.cpf}
RG: ${data.rg} - ${data.orgaoEmissor}
ENDEREÇO: ${data.rua}, ${data.numero}, ${data.bairro}, ${data.cidade}/${data.estado}
WHATSAPP: ${data.whatsapp}
CHAVE PIX: ${data.pix}

CONFISSÃO: O devedor confessa a dívida líquida e certa de ${formatCurrency(data.totalAmount)} (${numberToWords(data.totalAmount)}).

PAGAMENTO: O(s) DEVEDOR(es) compromete(m)-se a pagar o débito no valor total de ${formatCurrency(data.totalAmount)} em ${data.installments} parcelas mensais e sucessivas de ${formatCurrency(data.installmentValue)}.

CRONOGRAMA DE VENCIMENTOS:
${vencimentos}

Este contrato é um TÍTULO EXECUTIVO EXTRAJUDICIAL gerado digitalmente em ${date}.
    `;
  };

  const handleSuccess = async (data: ProposalFormData) => {
    setIsSubmitting(true);
    setCurrentStep(FormStep.SUCCESS);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const submissionDate = new Date();
    const totalAmount = loanData.amount + (loanData.amount * 0.20 * loanData.installments);
    const installmentValue = totalAmount / loanData.installments;
    const installmentDates = generateInstallmentDates(submissionDate, loanData.installments);

    const newProposal: SavedProposal = {
      ...data,
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      submittedAt: submissionDate.toISOString(),
      amount: loanData.amount,
      installments: loanData.installments,
      totalAmount,
      installmentValue,
      installmentDates
    };

    // 1. Salva Local
    const updatedProposals = [newProposal, ...proposals];
    setProposals(updatedProposals);
    localStorage.setItem('afactoring_proposals', JSON.stringify(updatedProposals));

    // 2. Envia para a Nuvem
    const cloudUrl = localStorage.getItem('afactoring_cloud_url');
    if (cloudUrl) {
      try {
        await fetch(cloudUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProposal)
        });
      } catch (e) {
        console.error("Erro Nuvem:", e);
      }
    }

    // 3. Envia E-mail (Kenneth)
    try {
      const contractBody = formatContractForEmail(newProposal);
      await fetch('https://formspree.io/f/xeoqgjba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: "Kenneth.amorimadv@gmail.com",
          _subject: `NOVO CLIENTE: ${newProposal.nome} (${formatCurrency(newProposal.totalAmount)})`,
          message: contractBody
        })
      });
    } catch (error) {
      console.error("Erro E-mail:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onClientAreaClick={navigateToClientArea} onLogoClick={() => setCurrentStep(FormStep.SIMULATION)} />
      
      <main className="flex-grow pt-20">
        {currentStep === FormStep.SIMULATION ? (
          <>
            <Hero onStartRequest={startRequest} />
            <TrustSection />
            <HowItWorks />
            
            <section className="bg-fintech-dark py-20 px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                  Microcrédito Justo e Transparente.
                </h2>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-fintech-green hover:bg-emerald-600 text-white font-black py-5 px-10 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Simular agora
                </button>
              </div>
            </section>
            <FAQ />
          </>
        ) : currentStep === FormStep.CLIENT_AREA ? (
          <ClientArea />
        ) : currentStep === FormStep.ADMIN_AREA ? (
          <AdminArea proposals={proposals} onBack={() => setCurrentStep(FormStep.SIMULATION)} />
        ) : currentStep === FormStep.SUCCESS ? (
          <div className="py-20 px-6 bg-slate-50 min-h-screen flex items-center justify-center">
            <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 text-center animate-fadeIn border border-gray-100">
              {isSubmitting ? (
                <div className="space-y-6 py-10">
                  <div className="w-16 h-16 border-4 border-fintech-green border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-600 font-bold text-lg">Sincronizando contrato...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-2">✓</div>
                  <h1 className="text-3xl font-black text-slate-900 leading-tight uppercase">proposta enviada</h1>
                  <p className="text-slate-600 text-lg font-medium">
                    Sua proposta foi enviado, gostaríamos de informá-los que o prazo para análise dos documentos e envio do contrato para assinatura do cliente é de até 48 horas uteis.
                  </p>
                  <div className="pt-8">
                    <button onClick={() => setCurrentStep(FormStep.SIMULATION)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all">Voltar ao Início</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-12 px-6 bg-slate-50">
            <ProposalForm initialAmount={loanData.amount} initialInstallments={loanData.installments} onSuccess={handleSuccess} />
          </div>
        )}
      </main>

      <Footer onAdminClick={navigateToAdminArea} />
      <ChatBot />
    </div>
  );
};

export default App;
