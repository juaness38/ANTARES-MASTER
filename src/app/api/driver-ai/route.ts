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
    const body = await req.json()
    console.log('🔍 API Route received body:', body)
    
    // 🧠 DETECCIÓN INTELIGENTE EN EL PROXY
    let processedBody: any;
    
    // Si ya tiene 'sequence', es análisis de proteína directo
    if (body.sequence) {
      console.log('🧬 Direct protein analysis detected')
      processedBody = body;
    } 
    // Si tiene 'query' y NO es secuencia de proteína, convertir
    else if (body.query) {
      const isProteinSequence = isLikelyProteinSequence(body.query);
      console.log('🔍 Query analysis - is protein sequence:', isProteinSequence)
      
      if (isProteinSequence) {
        // Es una secuencia enviada como query
        processedBody = {
          sequence: body.query,
          analysis_type: 'blast'
        };
      } else {
        // Es consulta conversacional - usar secuencia mínima + metadata
        processedBody = {
          sequence: 'MALVRDPEPA', // Secuencia mínima para evitar error
          analysis_type: 'general_query',
          original_query: body.query,
          user_message: body.query,
          context: body.context || {}
        };
      }
    }
    // Fallback: tratar como conversacional
    else {
      console.log('🗣️ Treating as conversational query')
      const messageContent = body.message || body.content || JSON.stringify(body);
      processedBody = {
        sequence: 'MALVRDPEPA',
        analysis_type: 'general_query', 
        original_query: messageContent,
        user_message: messageContent
      };
    }
    
    console.log('📤 Sending to Driver AI:', processedBody)
    
    // Usar el endpoint del Driver AI 7.0
    const response = await fetch('http://3.85.5.222:8001/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'ANTARES-Frontend/1.0.0'
      },
      body: JSON.stringify(processedBody)
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const errorText = await response.text()
      return NextResponse.json(
        { status: 'ERROR', message: 'Backend error', error: errorText }, 
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
