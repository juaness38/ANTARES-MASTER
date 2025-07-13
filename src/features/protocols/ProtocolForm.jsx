import { useState } from 'react'
import { executeProtocol } from '../../services/protocolService'

export default function ProtocolForm() {
  const [jsonText, setJsonText] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    try {
      const payload = JSON.parse(jsonText)
      const res = await executeProtocol(payload)
      setStatus(`Protocolo iniciado con ID: ${res.protocol_id}`)
    } catch (err) {
      setStatus('Error al enviar protocolo. Verifica el formato.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block font-medium">Prompt Protocol (JSON)</label>
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        rows={12}
        className="w-full border rounded p-2 font-mono text-sm dark:bg-gray-800"
        placeholder={`{
  "description": "Ejemplo",
  "nodes": [ ... ],
  "initial_context": {},
  "policy_tags": ["public_access"]
}`}
      ></textarea>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Ejecutar Protocolo
      </button>

      {status && <p className="text-sm text-green-600 dark:text-green-400">{status}</p>}
    </form>
  )
}
