
import { LoanOption } from './types';

export const WHATSAPP_NUMBER = '82988750346';
export const WHATSAPP_LINK = `https://wa.me/55${WHATSAPP_NUMBER}`;
export const EMAIL_CONTACT = 'contato@afactoring.com.br';
export const CNPJ_PLACEHOLDER = '00.000.000/0001-00';

export const LOAN_TABLE: LoanOption[] = [
  {
    amount: 100,
    installments: { 1: 120, 2: 70, 3: 53.20, 4: 45, 5: 40 }
  },
  {
    amount: 200,
    installments: { 1: 240, 2: 140, 3: 106.40, 4: 90, 5: 80 }
  },
  {
    amount: 300,
    installments: { 1: 360, 2: 210, 3: 159.60, 4: 135, 5: 120 }
  },
  {
    amount: 400,
    installments: { 1: 480, 2: 280, 3: 213.60, 4: 180, 5: 160 }
  },
  {
    amount: 500,
    installments: { 1: 600, 2: 350, 3: 266, 4: 225, 5: 200 }
  }
];

export const WORK_SITUATIONS = [
  'Registrado (CLT)',
  'Autônomo',
  'Informal',
  'Desempregado',
  'Aposentado/Pensionista'
];

export const RELATIONSHIPS = [
  'Amigo(a)',
  'Pai/Mãe',
  'Irmão/Irmã',
  'Cônjuge',
  'Outro Familiar',
  'Colega de Trabalho'
];
