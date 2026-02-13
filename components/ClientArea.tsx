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
  const [propostas, setPropostas] = useState<any[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: dbError } = await supabase
        .from('propostas')
        .select('*')
        .eq('cpf', loginData.cpf.replace(/\D/g, ''))
        .eq('data_nascimento', loginData.birthDate);

      if (dbError || !data || data.length === 0) {
        setError('Dados não encontrados.');
      } else {
        setPropostas(data);
        setIsLogged(true);
      }
    } catch (err) {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Acesso Cliente</h2>
        <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left' }}>
          <input placeholder="CPF" style={{ display: 'block', margin: '10px 0', padding: '10px' }} value={loginData.cpf} onChange={e => setLoginData({...loginData, cpf: e.target.value})} />
          <input type="date" style={{ display: 'block', margin: '10px 0', padding: '10px' }} value={loginData.birthDate} onChange={e => setLoginData({...loginData, birthDate: e.target.value})} />
          <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>{loading ? 'Entrando...' : 'Entrar'}</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Bem-vindo, {propostas[0].nome_completo}</h1>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <p><strong>Status:</strong> {propostas[0].status}</p>
        <p><strong>Valor:</strong> R$ {propostas[0].valor_solicitado}</p>
        <hr />
        <p><strong>Confissão de Dívida:</strong></p>
        <div style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '15px' }}>
          {propostas[0].confissao_texto || 'Documento em geração...'}
        </div>
      </div>
      <button onClick={() => setIsLogged(false)} style={{ marginTop: '20px' }}>Sair</button>
    </div>
  );
};

export default ClientArea;
