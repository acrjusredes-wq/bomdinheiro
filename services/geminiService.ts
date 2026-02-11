
import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (userMessage: string) => {
  // Verificação defensiva para evitar que a aplicação quebre se a chave estiver ausente
  const apiKey = process.env.API_KEY || "";
  
  if (!apiKey) {
    console.warn("Aviso: Chave de API do Gemini não configurada.");
    return "Olá! Sou o assistente da Afactoring. No momento estou operando em modo offline, mas você pode tirar dúvidas sobre nossos valores (R$100 a R$500) e taxas (20% ao mês) lendo nosso FAQ ou falando conosco pelo WhatsApp!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `Você é o assistente virtual oficial da Afactoring (propriedade do Dr. Kenneth Amorim). 
        Sua função é tirar dúvidas de clientes brasileiros sobre microcrédito.
        REGRAS:
        - Valores: R$ 100 a R$ 500.
        - Taxa: 20% fixa ao mês.
        - Parcelas: 1 a 5 vezes.
        - Liberação: Via PIX após aprovação.
        - Documentos: RG/CNH e Selfie são obrigatórios.
        - Tom: Profissional, confiável e prestativo.
        - Responda sempre em Português do Brasil de forma curta e objetiva.`,
        temperature: 0.7,
      },
    });

    if (!response || !response.text) {
      return "Não consegui processar sua mensagem agora. Pode tentar reformular a pergunta?";
    }

    return response.text;
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return "Olá! Tive um pequeno problema de conexão com minha inteligência artificial. Para sua segurança, você pode falar diretamente com nosso suporte via WhatsApp no botão abaixo.";
  }
};
