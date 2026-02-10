
import React from 'react';
import { WHATSAPP_LINK, EMAIL_CONTACT, CNPJ_PLACEHOLDER } from '../constants';

interface FooterProps {
  onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-fintech-dark text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-fintech-green rounded-xl flex items-center justify-center">
                <span className="text-fintech-dark font-black text-xl italic">Af</span>
              </div>
              <span className="text-2xl font-black tracking-tight">Afactoring</span>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed">
              Afactoring — Soluções financeiras com responsabilidade e transparência. Crédito justo para o seu dia a dia.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contato</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li><a href={WHATSAPP_LINK} target="_blank" className="hover:text-fintech-green transition-colors">WhatsApp: (82) 98875-0346</a></li>
              <li><a href={`mailto:${EMAIL_CONTACT}`} className="hover:text-fintech-green transition-colors">E-mail: {EMAIL_CONTACT}</a></li>
              <li>Atendimento: Seg à Sex, 08h às 18h</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Links Úteis</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li><a href="#" className="hover:text-fintech-green transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-fintech-green transition-colors">Termos de Uso</a></li>
              <li><button onClick={onAdminClick} className="hover:text-white/50 transition-colors opacity-30 text-[10px] uppercase font-bold mt-4">Acesso Administrativo</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Institucional</h4>
            <p className="text-slate-400 font-medium mb-4">CNPJ: {CNPJ_PLACEHOLDER}</p>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-fintech-green transition-colors cursor-pointer">In</span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-fintech-green transition-colors cursor-pointer">Fb</span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-fintech-green transition-colors cursor-pointer">Ig</span>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-800 text-center text-slate-500 text-sm font-medium">
          <p>© {new Date().getFullYear()} Afactoring Intermediação de Crédito Ltda. Todos os direitos reservados.</p>
          <p className="mt-2 text-[10px] leading-relaxed max-w-4xl mx-auto opacity-50">
            A Afactoring não é uma instituição financeira e não realiza operações de crédito diretamente. Atuamos como correspondente bancário para facilitar o processo de contratação de empréstimos entre o cliente e as instituições parceiras. O microcrédito deve ser utilizado com responsabilidade.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
