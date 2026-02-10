
import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (userMessage: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
        - Responda de forma curta e objetiva.`,
        temperature: 0.7,
      },
    });

    if (!response || !response.text) {
      return "Estou com dificuldade de processar sua mensagem agora. Por favor, tente novamente em instantes.";
    }

    return response.text;
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return "Olá! No momento nosso sistema de IA está em manutenção. Você pode falar diretamente com nossa equipe via WhatsApp pelo ícone no canto inferior.";
  }
};
