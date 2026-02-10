
import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (userMessage: string) => {
  // Inicialização obrigatória com process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Uso do modelo gemini-3-flash-preview conforme instruído para tarefas básicas
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: `Você é o assistente virtual da Afactoring, uma fintech brasileira de microcrédito. 
        Seu objetivo é ajudar clientes a entenderem como funciona o empréstimo, tirar dúvidas sobre taxas (20% ao mês) 
        e prazos (1 a 5 parcelas). Seja profissional, amigável, direto e transmita segurança. 
        Lembre-se: o valor máximo é R$500 e o mínimo R$100. Pagamentos via PIX. 
        Responda sempre em Português do Brasil de forma concisa.`,
        temperature: 0.8,
        topP: 0.95,
        topK: 40
      },
    });

    // .text é uma propriedade getter, não um método.
    if (!response || !response.text) {
      throw new Error("Resposta vazia da API");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error details:", error);
    return "Olá! Tive um pequeno problema técnico ao processar sua dúvida. Você pode tentar novamente ou falar conosco via WhatsApp pelo botão no rodapé da página.";
  }
};
