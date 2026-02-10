
import React from 'react';

interface HeaderProps {
  onClientAreaClick: () => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClientAreaClick, onLogoClick }) => {
  const scrollToSection = (id: string) => {
    // Primeiro garante que estamos na "home" (escondendo area do cliente/admin se necessário)
    onLogoClick();
    
    // Pequeno delay para garantir que os IDs existam no DOM após a troca de estado
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
          <div className="w-10 h-10 bg-fintech-dark rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl italic">Af</span>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            Afactoring
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('como-funciona')} 
            className="text-slate-600 font-semibold hover:text-fintech-green transition-colors"
          >
            Como funciona
          </button>
          <button 
            onClick={() => scrollToSection('seguranca')} 
            className="text-slate-600 font-semibold hover:text-fintech-green transition-colors"
          >
            Segurança
          </button>
          <button 
            onClick={() => scrollToSection('faq')} 
            className="text-slate-600 font-semibold hover:text-fintech-green transition-colors"
          >
            FAQ
          </button>
        </nav>

        <button 
          onClick={onClientAreaClick}
          className="bg-fintech-dark text-white font-bold px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-md"
        >
          Área do Cliente
        </button>
      </div>
    </header>
  );
};

export default Header;
