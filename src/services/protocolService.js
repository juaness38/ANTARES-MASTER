import api from './api'

/**
 * Ejecuta un PromptProtocol.
 * @param {Object} protocolData - Objeto con descripción, nodos, contexto, policy_tags
 * @returns {Object} - Contiene protocol_id y status
 */
export async function executeProtocol(protocolData) {
  const response = await api.post('/protocols/execute', protocolData)
  return response.data
}

/**
 * Consulta el estado y eventos de un protocolo dado su ID.
 * @param {string} protocolId
 * @returns {Object} - Estado del protocolo, eventos, salida, etc.
 */
export async function getProtocolStatus(protocolId) {
  const response = await api.get(`/protocols/${protocolId}/status`)
  return response.data
}

/**
 * Descarga resultados tabulares de un protocolo.
 * @param {string} protocolId
 * @returns {Blob} - Archivo CSV
 */
export async function downloadProtocolResults(protocolId) {
  const response = await api.get(`/protocols/${protocolId}/download_results`, {
    responseType: 'blob' // Para manejar archivos binarios
  })
  return response.data
}
