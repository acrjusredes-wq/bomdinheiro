import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function ProposalForm() {

  const [step,setStep] = useState(1);
  const [loading,setLoading] = useState(false);

  const [formData,setFormData] = useState({
    nome:"",
    cpf:"",
    nascimento:"",
    valor:"",
  });

  function handleChange(e:any){
    setFormData(prev=>({...prev,[e.target.name]:e.target.value}))
  }

  async function handleSubmit(e:any){
    e.preventDefault();

    if(step < 3){
      setStep(step+1);
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("propostas")
      .insert([
        {
          nome_cor: formData.nome,
          cpf: formData.cpf,
          data_nasc: formData.nascimento,
          valor_solic: formData.valor,
          status:"Pendente"
        }
      ]);

    setLoading(false);

    if(error){
      alert("Erro ao enviar proposta");
      console.log(error);
      return;
    }

    alert("Proposta enviada com sucesso!");
    setStep(1);
    setFormData({
      nome:"",
      cpf:"",
      nascimento:"",
      valor:""
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:500,margin:"auto"}}>

      {step===1 && (
        <>
          <h2>Dados pessoais</h2>
          <input name="nome" placeholder="Nome completo" value={formData.nome} onChange={handleChange} required/>
          <input name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} required/>
          <button type="submit">Próximo</button>
        </>
      )}

      {step===2 && (
        <>
          <h2>Dados adicionais</h2>
          <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} required/>
          <input name="valor" placeholder="Valor solicitado" value={formData.valor} onChange={handleChange} required/>
          <button type="submit">Próximo</button>
        </>
      )}

      {step===3 && (
        <>
          <h2>Finalizar</h2>
          <button type="submit">
            {loading ? "Enviando..." : "Enviar proposta"}
          </button>
        </>
      )}

    </form>
  );
}
