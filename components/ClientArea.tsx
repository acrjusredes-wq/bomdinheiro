import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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
        setError('Nenhuma proposta encontrada.');
      }
    } catch (err) {
      setError('Erro ao acessar o sistema.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
        <h2>Acesso do Cliente</h2>
        <form onSubmit={handleLogin}>
          <input 
            placeholder="CPF" 
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }} 
            value={loginData.cpf} 
            onChange={e => setLoginData({...loginData, cpf: e.target.value})} 
          />
          <input 
            type="date" 
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }} 
            value={loginData.birthDate} 
            onChange={e => setLoginData({...loginData, birthDate: e.target.value})} 
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: 'black', color: 'white' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Olá, {userProposals[0].nome_completo}</h1>
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '10px' }}>
        <p><strong>Status:</strong> {userProposals[0].status}</p>
        <p><strong>Valor:</strong> R$ {userProposals[0].valor_solicitado}</p>
        <hr />
        <h4>Sua Confissão de Dívida:</h4>
        <div style={{ whiteSpace: 'pre-wrap', fontSize: '12px', background: '#f9f9f9', padding: '10px' }}>
          {userProposals[0].confissao_texto || 'Aguardando processamento...'}
        </div>
      </div>
      <button onClick={() => setIsLogged(false)} style={{ marginTop: '20px' }}>Sair</button>
    </div>
  );
};

export default ClientArea;
