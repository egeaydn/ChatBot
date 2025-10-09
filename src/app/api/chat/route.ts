export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { buildGeminiBody } from '../../../ultils/gemini';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    if (!message) return NextResponse.json({ error: 'Mesaj gerekli' }, { status: 400 });

    // ← Buraya yazıyoruz
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/projects/${process.env.GL_PROJECT_ID}/locations/${process.env.GL_LOCATION}/publishers/google/models/${process.env.GL_MODEL_ID}:generateContent`;
    const apiKey = process.env.GL_API_KEY;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(buildGeminiBody(message)),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Gemini API hatası: ${response.status} - ${text}`);
    }

    const data = await response.json();
    const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      || 'Üzgünüm, şu anda cevap veremiyorum.';

    return NextResponse.json({ message: botResponse, timestamp: new Date().toISOString() });
  } catch (e: any) {
    return NextResponse.json({
      message: `Üzgünüm, şu anda teknik bir sorun yaşıyorum.\n(Hata: ${e?.message || 'Bilinmeyen'})`,
      timestamp: new Date().toISOString(),
    });
  }
}
