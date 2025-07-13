import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function EventTable() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get('/events') // Asegúrate que exista este endpoint
        setEvents(res.data)
      } catch (err) {
        console.error('Error al cargar eventos', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) return <p>Cargando eventos...</p>

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
        <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2">Protocolo</th>
            <th className="px-4 py-2">Tipo de Evento</th>
            <th className="px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr key={i} className="border-b border-gray-300 dark:border-gray-600">
              <td className="px-4 py-2">{e.protocol_id}</td>
              <td className="px-4 py-2">{e.event_type}</td>
              <td className="px-4 py-2">{new Date(e.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
