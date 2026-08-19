import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa el cliente de Gemini (asegúrate de tener GEMINI_API_KEY en tu .env.local)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getTravelRecommendation(prompt: string, lat: number, lng: number): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `
      Eres un asistente experto en Margarita, Venezuela. 
      El usuario está en las coordenadas ${lat}, ${lng}.
      Responde a la siguiente consulta del usuario de manera corta, útil y enfocada en la ubicación actual: "${prompt}"
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error contactando a Gemini:", error);
    return "Lo siento, no pude contactar al asistente en este momento. Intenta de nuevo más tarde.";
  }
}