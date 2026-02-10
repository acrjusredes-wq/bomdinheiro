
export interface LoanOption {
  amount: number;
  installments: {
    [key: number]: number;
  };
}

export interface ProposalFormData {
  nome: string;
  nacionalidade: string;
  estadoCivil: string;
  profissao: string;
  rg: string;
  orgaoEmissor: string;
  cpf: string;
  birthDate: string;
  whatsapp: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  renda: string;
  situacao: string;
  pix: string;
  ref1Nome: string;
  ref1Rel: string;
  ref1Tel: string;
  ref2Nome: string;
  ref2Rel: string;
  ref2Tel: string;
}

export interface SavedProposal extends ProposalFormData {
  id: string;
  submittedAt: string;
  amount: number;
  installments: number;
  totalAmount: number;
  installmentValue: number;
  installmentDates: string[];
}

export enum FormStep {
  SIMULATION = 'simulation',
  PERSONAL_INFO = 'personal_info',
  ADDRESS = 'address',
  FINANCIAL = 'financial',
  DOCUMENTS = 'documents',
  REFERENCES = 'references',
  SUCCESS = 'success',
  CLIENT_AREA = 'client_area',
  ADMIN_AREA = 'admin_area'
}
