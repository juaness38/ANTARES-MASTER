/**
 * 🌐 API SERVICE - INTEGRACIÓN COMPLETA CON BACKEND
 * Servicio actualizado para conectar con todos los endpoints necesarios
 */

const API_URL = 'http://3.85.5.222:8001'; // Backend real

const api = {
  // === ESTADO Y SALUD ===
  
  getHealthStatus: async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Health check error:', error);
      throw error;
    }
  },
  
  // === PROCESAMIENTO DE CHAT ===
  
  processChat: async (message) => {
    try {
      console.log('🌐 Enviando mensaje al backend:', message);
      
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'ANTARES-Frontend/8.0.0'
        },
        body: JSON.stringify({ 
          message: message,
          session_id: `antares_session_${Date.now()}`
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chat API error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Respuesta del backend:', data);
      
      return {
        response: data.response || data.message || 'Respuesta procesada correctamente.',
        model_used: data.model_used || 'astroflora',
        confidence: data.confidence || 0.9,
        session_id: data.session_id,
        timestamp: data.timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error en processChat:', error);
      throw new Error(`Error de comunicación con el chat: ${error.message}`);
    }
  },
  
  // === ANÁLISIS DE ESTRUCTURAS ===
  
  analyzeStructure: async (sequence, analysisType = 'full') => {
    try {
      console.log('🧬 Analizando estructura:', { sequence: sequence.substring(0, 50) + '...', analysisType });
      
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'ANTARES-Frontend/8.0.0'
        },
        body: JSON.stringify({ 
          sequence: sequence,
          analysis_type: analysisType,
          context: {
            source: 'chat_interface',
            user_id: 'antares_user',
            session_id: `analysis_${Date.now()}`
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Analysis API error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Análisis completado:', data);
      
      return {
        results: data.results || data,
        analysis_type: analysisType,
        sequence_length: sequence.length,
        timestamp: new Date().toISOString(),
        success: true
      };
    } catch (error) {
      console.error('❌ Error en analyzeStructure:', error);
      throw new Error(`Error en análisis de estructura: ${error.message}`);
    }
  },
  
  // === CONSULTAS ESPECÍFICAS ===
  
  searchProteins: async (query) => {
    try {
      const response = await fetch(`${API_URL}/api/search/proteins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error en búsqueda de proteínas:', error);
      // Fallback: usar el chat para búsquedas
      return await api.processChat(`Buscar información sobre: ${query}`);
    }
  },
  
  getStructureInfo: async (pdbId) => {
    try {
      const response = await fetch(`${API_URL}/api/structure/${pdbId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Structure info failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error obteniendo info de estructura:', error);
      // Fallback: usar el chat
      return await api.processChat(`Información sobre la estructura PDB ${pdbId}`);
    }
  },
  
  // === UTILIDADES ===
  
  testConnection: async () => {
    try {
      const start = Date.now();
      await api.getHealthStatus();
      const latency = Date.now() - start;
      
      return {
        status: 'connected',
        latency: latency,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },
  
  // === CONFIGURACIÓN ===
  
  getApiInfo: () => ({
    baseUrl: API_URL,
    version: '8.0.0',
    endpoints: {
      health: `${API_URL}/api/health`,
      chat: `${API_URL}/api/chat`,
      analyze: `${API_URL}/api/analyze`,
      search: `${API_URL}/api/search/proteins`,
      structure: `${API_URL}/api/structure/{id}`
    }
  })
};

export default api;
