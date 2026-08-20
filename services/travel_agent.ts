import { GoogleGenAI } from '@google/genai';

// Inicialización correcta usando la variable de entorno
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateTravelResponse(prompt: string, lat: number, lng: number, datasets: any, budget: number) {
  try {
    const systemInstruction = `
    Eres un asistente turístico humano, amigable y muy directo en la Isla de Margarita, Venezuela.
    REGLAS ESTRICTAS DE ESTILO:
    1. Escribe con total naturalidad, como si estuvieras chateando por WhatsApp o hablando cara a cara.
    2. PROHIBIDO usar símbolos de formato Markdown como hashtags (#), asteriscos (*), negritas (**), ni guiones (-) para listas. Escribe únicamente en párrafos de texto fluido y conversacional.
    3. Sé preciso, amable y ve al grano (evita dar bloques masivos de texto).
    4. Al final de tu respuesta, termina obligatoriamente con una sola pregunta específica de seguimiento sobre el tema para mantener la charla fluida.
    5. Presupuesto: Considera que el monto indicado es de ${budget || 500} dólares en total para un grupo de 4 personas. Adapta los planes, comidas o entradas a ese presupuesto basado en los datasets locales.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `Datasets locales: ${JSON.stringify(datasets || {})}` },
            { text: `Ubicación: Lat ${lat}, Lng ${lng}` },
            { text: `Presupuesto para 4 personas: ${budget} USD` },
            { text: `Solicitud: ${prompt}` }
          ]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      },
    });

    return response.text || "¡Hola! ¿En qué te puedo ayudar hoy?";
  } catch (error: any) {
    console.error('Error en travel_agent service:', error);
    throw new Error(error.message);
  }
}