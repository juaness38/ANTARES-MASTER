import { NextRequest, NextResponse } from 'next/server'

/**
 * 🧠 Detecta si un texto es probablemente una secuencia de proteína
 */
function isLikelyProteinSequence(text: string): boolean {
  const cleanText = text.replace(/\s+/g, '').toUpperCase();
  
  if (cleanText.length < 10) return false;
  if (cleanText.length > 200 && !/[ACDEFGHIKLMNPQRSTVWY]/.test(cleanText)) return false;
  
  const aminoAcids = 'ACDEFGHIKLMNPQRSTVWY';
  let aminoAcidCount = 0;
  
  for (const char of cleanText) {
    if (aminoAcids.includes(char)) {
      aminoAcidCount++;
    }
  }
  
  const percentAminoAcids = aminoAcidCount / cleanText.length;
  return percentAminoAcids > 0.80;
}

export async function GET() {
  try {
    const response = await fetch('http://3.85.5.222:8001/api/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ANTARES-Frontend/1.0.0'
      }
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json(
        { status: 'ERROR', message: 'Backend unavailable' }, 
        { status: response.status }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { status: 'ERROR', message: 'Connection failed', error: String(error) }, 
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('🔍 [PROXY] Body recibido:', body);

    let endpointUrl: string;
    let requestBody: any;

    // --- Lógica de Enrutamiento Inteligente ---
    if (body.sequence) {
      // 1. Análisis de proteína explícito
      console.log('🧬 [PROXY] Detectado: Análisis de proteína explícito.');
      endpointUrl = 'http://3.85.5.222:8001/api/analyze';
      requestBody = body;
    } else if (body.query) {
      if (isLikelyProteinSequence(body.query)) {
        // 2. Secuencia de proteína enviada como texto
        console.log('🧬 [PROXY] Detectado: Secuencia de proteína en la consulta.');
        endpointUrl = 'http://3.85.5.222:8001/api/analyze';
        requestBody = {
          sequence: body.query,
          analysis_type: 'blast' // Asumir BLAST por defecto
        };
      } else {
        // 3. Consulta conversacional
        console.log('💬 [PROXY] Detectado: Consulta conversacional.');
        endpointUrl = 'http://3.85.5.222:8001/api/chat';
        requestBody = {
          message: body.query,
          session_id: 'antares_session_' + Date.now()
        };
      }
    } else {
      // 4. Fallback para formatos no esperados (tratar como chat)
      console.log('🗣️ [PROXY] Fallback: Tratando como consulta de chat genérica.');
      endpointUrl = 'http://3.85.5.222:8001/api/chat';
      const messageContent = body.message || body.content || JSON.stringify(body);
      requestBody = {
        message: messageContent,
        session_id: 'antares_session_' + Date.now()
      };
    }

    // --- Ejecución de la Solicitud ---
    console.log(`📤 [PROXY] Enviando a: ${endpointUrl}`);
    console.log(`📦 [PROXY] Body a enviar:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'ANTARES-Frontend/1.0.0'
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000) // Timeout de 30 segundos
    });

    // --- Manejo de la Respuesta ---
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ [PROXY] Respuesta exitosa de ${endpointUrl}:`, data);
      return NextResponse.json(data);
    } else {
      const errorText = await response.text();
      console.error(`❌ [PROXY] Error de ${endpointUrl}: ${response.status}`, errorText);
      return NextResponse.json(
        { message: `El servicio backend devolvió un error (${response.status})`, error: errorText },
        { status: response.status }
      );
    }

  } catch (error) {
    console.error('🚨 [PROXY] Error inesperado en la ruta API:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: 'Error interno en el proxy API.', error: errorMessage },
      { status: 500 }
    );
  }
}
