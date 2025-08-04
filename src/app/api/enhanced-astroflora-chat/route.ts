import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// --- CONFIGURACIÓN BACKEND ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.85.5.222/api/v1';
const MCP_SERVER_URL = 'http://localhost:8080';

// --- INTERFACES ---
interface CommandResponse {
  type: 'command';
  action: string;
  parameters: any;
  message: string;
  files?: FileAttachment[];
  status: 'success' | 'error' | 'info';
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
}

interface ChatResponse {
  type: 'chat';
  message: string;
  files?: FileAttachment[];
}

// --- CONEXIÓN AL MCP SERVER ---
async function sendToDriverAI(message: string) {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/driver-ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: message,
        context: { source: 'enhanced_chat' }
      }),
      signal: AbortSignal.timeout(30000)
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    }
    throw new Error(`MCP Server error: ${response.status}`);
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// --- CONEXIÓN AL BACKEND API ---
async function fetchBackendFiles(fileType: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/files?type=${fileType}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000)
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, files: data.files || [] };
    }
    throw new Error(`Backend API error: ${response.status}`);
  } catch (error) {
    return { success: false, files: [] };
  }
}

// --- PARSEO DE COMANDOS ---
async function parseDriverCommand(text: string): Promise<CommandResponse | null> {
  const input = text.toLowerCase().trim();
  
  // Comando PDB
  if (input.includes('pdb') && (input.includes('pasame') || input.includes('muestra'))) {
    const backendFiles = await fetchBackendFiles('pdb');
    
    const files = backendFiles.success && backendFiles.files.length > 0 
      ? backendFiles.files.slice(0, 3).map((file: any, i: number) => ({
          id: `pdb-${i}`,
          name: file.name || `protein_${i}.pdb`,
          type: 'application/x-pdb',
          size: file.size || 1024,
          data: btoa(generateMockPDB(`pdb_${i}`))
        }))
      : [
          {
            id: 'pdb-1',
            name: '1crn.pdb',
            type: 'application/x-pdb',
            size: 1024,
            data: btoa(generateMockPDB('1crn'))
          },
          {
            id: 'pdb-2', 
            name: '3zik.pdb',
            type: 'application/x-pdb',
            size: 2048,
            data: btoa(generateMockPDB('3zik'))
          }
        ];

    return {
      type: 'command',
      action: 'SHOW_FILES',
      parameters: { fileType: 'pdb' },
      message: `🧬 Archivos PDB disponibles (${backendFiles.success ? 'backend' : 'demo'}):`,
      files,
      status: backendFiles.success ? 'success' : 'info'
    };
  }

  // Comando BLAST
  if (input.includes('blast')) {
    const files = [{
      id: 'blast-1',
      name: 'blast_results.csv',
      type: 'text/csv',
      size: 2048,
      data: btoa(generateMockBlast())
    }];

    return {
      type: 'command',
      action: 'SHOW_FILES',
      parameters: { fileType: 'blast' },
      message: '📊 Resultados BLAST disponibles:',
      files,
      status: 'success'
    };
  }

  // Comando Load PDB
  if (input.includes('load') && input.includes('pdb')) {
    const pdbMatch = input.match(/(?:pdb\s+)(\w+)/);
    const pdbId = pdbMatch ? pdbMatch[1] : '1crn';
    
    return {
      type: 'command',
      action: 'LOAD_PDB',
      parameters: { pdbId },
      message: `🔬 Cargando estructura ${pdbId.toUpperCase()}...`,
      status: 'success'
    };
  }

  return null;
}

// --- GENERADORES MOCK ---
function generateMockPDB(id: string): string {
  return `HEADER    PROTEIN                             ${new Date().toISOString().slice(0,10)}   ${id.toUpperCase()}
ATOM      1  N   MET A   1      20.154  16.967  22.293  1.00 20.00           N
ATOM      2  CA  MET A   1      19.032  16.866  23.220  1.00 20.00           C
END`;
}

function generateMockBlast(): string {
  return `Query,Subject,Identity,E-value,Score
PROTEIN_1,sp|P12345|EXAMPLE,95.2,2e-156,562
PROTEIN_1,sp|Q67890|SAMPLE,87.3,1e-142,489`;
}

// --- ENDPOINT PRINCIPAL ---
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // 1. Intentar comando driver
    const commandResponse = await parseDriverCommand(message);
    if (commandResponse) {
      return NextResponse.json(commandResponse);
    }

    // 2. Intentar MCP Server
    const mcpResponse = await sendToDriverAI(message);
    if (mcpResponse.success) {
      const chatResponse: ChatResponse = {
        type: 'chat',
        message: `${mcpResponse.data.analysis?.result || 'Respuesta del MCP Server'}\n\n*Powered by AstroFlora MCP Server*`
      };
      return NextResponse.json(chatResponse);
    }

    // 3. Fallback OpenAI
    console.log('⚠️ Usando fallback OpenAI');
    const result = streamText({
      model: openai('gpt-4o'),
      prompt: `Eres AstroFlora AI, asistente de biología molecular en ANTARES.

Especialidades: BLAST, estructuras proteicas, bioinformática.
Pregunta: ${message}

Responde de forma técnica y concisa.`,
      temperature: 0.1,
    });

    return result.toTextStreamResponse();
    
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json({ 
      type: 'chat',
      message: 'Error procesando solicitud.'
    }, { status: 500 });
  }
}
