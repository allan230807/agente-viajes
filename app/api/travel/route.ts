import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Modelos en orden de preferencia para el intercambio automático (fallback)
const MODELS = ['gemini-3.5-flash', 'gemini-3.6-flash'];

export async function POST(request: Request) {
  try {
    const { prompt, lat, lng, datasets, budget } = await request.json();

    const systemInstruction = `
    Eres un asistente turístico humano, amigable y muy directo en la Isla de Margarita, Venezuela.
    REGLAS ESTRICTAS DE ESTILO:
    1. Escribe con total naturalidad, como si estuvieras chateando por WhatsApp o hablando cara a cara.
    2. PROHIBIDO usar símbolos de formato Markdown como hashtags (#), asteriscos (*), negritas (**), ni guiones (-) para listas. Escribe únicamente en párrafos de texto fluido y conversacional.
    3. Sé preciso, amable y ve al grano (evita dar bloques masivos de texto).
    4. Al final de tu respuesta, termina obligatoriamente con una sola pregunta específica de seguimiento sobre el tema para mantener la charla fluida.
    5. Presupuesto: Considera que el monto indicado es de ${budget || 500} dólares en total para un grupo de 4 personas. Adapta los planes, comidas o entradas a ese presupuesto basado en los datasets locales.
    `;

    let responseText = null;
    let lastError = null;

    // Bucle para intentar con el modelo principal y hacer swap si se agota la cuota (429)
    for (const modelName of MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
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

        if (response && response.text) {
          responseText = response.text;
          break; // Éxito, salimos del bucle
        }
      } catch (error: any) {
        lastError = error;
        // Detecta error de límite superado (429 / RESOURCE_EXHAUSTED) para pasar al siguiente modelo
        if (
          error.status === 429 || 
          error.statusCode === 429 || 
          error.message?.includes('RESOURCE_EXHAUSTED') || 
          error.message?.includes('429') ||
          error.message?.includes('rate limit')
        ) {
          console.warn(`Modelo ${modelName} sin cuota. Cambiando al siguiente...`);
          continue;
        }
        throw error; // Si es otro tipo de error, lo lanza de inmediato
      }
    }

    if (!responseText) {
      throw new Error(lastError?.message || 'Se agotaron los límites diarios de todos los modelos disponibles.');
    }

    return NextResponse.json({
      success: true,
      response: responseText,
    });

  } catch (error: any) {
    console.error('Error en /api/travel:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}