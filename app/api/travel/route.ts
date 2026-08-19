import { NextResponse } from 'next/server';
import { getTravelRecommendation } from '@/services/travel_agent';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, lat, lng } = body;

    if (!prompt || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: 'Faltan parámetros obligatorios (prompt, lat, lng)' },
        { status: 400 }
      );
    }

    const recommendation = await getTravelRecommendation(prompt, lat, lng);

    return NextResponse.json({ success: true, data: recommendation });
  } catch (error) {
    console.error('Error en la API de viajes:', error);
    return NextResponse.json(
      { error: 'Error interno al procesar la recomendación' },
      { status: 500 }
    );
  }
}