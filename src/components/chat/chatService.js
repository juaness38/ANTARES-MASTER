import axios from 'axios';

const API_URL = 'http://3.85.5.222:8001'; // URL del servidor backend que configuramos anteriormente

class ChatService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Verificar conexión al inicializar
    this.checkConnection();
  }
  
  async checkConnection() {
    try {
      const response = await this.axiosInstance.get('/api/health');
      console.log('Estado del backend:', response.data.status);
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('Error al verificar conexión con el backend:', error);
      return false;
    }
  }
  
  async sendMessage(message) {
    try {
      const response = await this.axiosInstance.post('/api/chat', { message });
      
      // Verificar si la respuesta tiene el formato esperado
      if (!response.data || response.data.status === 'error') {
        throw new Error(response.data?.detail || 'Error en la respuesta del servidor');
      }
      
      return {
        text: response.data.response,
        timestamp: new Date().toISOString(),
        source: response.data.model_used || 'astroflora',
        success: true
      };
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Devolver objeto de error formateado
      return {
        text: `Lo siento, ha ocurrido un error: ${error.message || 'Error de comunicación'}`,
        timestamp: new Date().toISOString(),
        source: 'error',
        success: false
      };
    }
  }
  
  async analyzeSequence(sequence, analysisType = 'full') {
    try {
      const response = await this.axiosInstance.post('/api/analyze', { 
        sequence,
        analysis_type: analysisType
      });
      
      return {
        results: response.data.results,
        success: true
      };
    } catch (error) {
      console.error('Error al analizar secuencia:', error);
      return {
        error: error.message,
        success: false
      };
    }
  }
}

export default new ChatService();
