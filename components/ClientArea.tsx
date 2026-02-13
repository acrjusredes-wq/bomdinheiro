import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexão direta com o Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ClientArea: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({ cpf: '', birthDate: '' });
  const [userProposals, setUserProposals] = useState<any[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanInputCpf = loginData.cpf.replace(/\D/g, '');

      // Busca no banco de dados
      const { data, error: dbError } = await supabase
        .from('propostas')
        .select('*')
        .eq('cpf', cleanInputCpf)
        .eq('data_nascimento', loginData.birthDate);

      if (dbError) throw dbError;

      if (data && data.length > 0) {
        setUserProposals(data);
        setIsLogged(true);
      } else {
        setError('Nenhuma proposta encontrada. Verifique seu CPF e Data de Nascimento.');
      }
    } catch (err) {
      setError('Erro ao acessar o sistema. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <h2 style={{ textAlign: 'center' }}>Área do Cliente</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            required 
            placeholder="Seu CPF" 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            value={loginData.cpf} 
            onChange={e => setLoginData({...loginData, cpf: e.target.value})} 
          />
          <input 
            required 
            type="date" 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            value={loginData.birthDate} 
            onChange={e => setLoginData({...loginData, birthDate: e.target.value})} 
          />
          {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '12px', backgroundColor: '#000', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}
          >
            {loading ? 'Entrando...' : 'Acessar Meu Painel'}
          </button>
        </form>
      </div>
    );
  }

  const latest = userProposals[0];

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Olá, {latest.nome_completo}!</h1>
      <div style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '15px', border: '1px solid #bbf7d0' }}>
        <p><strong>Status:</strong> {latest.status || 'Em Análise'}</p>
        <p><strong>Valor:</strong> R$ {latest.valor_solicitado}</p>
      </div>
      <h3 style={{ marginTop: '30px' }}>Sua Confissão de Dívida:</h3>
      <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap' }}>
        {latest.confissao_texto || "Documento não disponível."}
      </div>
      <button onClick={() => window.print()} style={{ marginTop: '20px', cursor: 'pointer' }}>Imprimir</button>
      <button onClick={() => setIsLogged(false)} style={{ marginLeft: '10px', cursor: 'pointer' }}>Sair</button>
    </div>
  );
};

export default ClientArea;
