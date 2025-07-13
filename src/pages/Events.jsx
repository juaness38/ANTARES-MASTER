import EventTable from '../features/events/EventTable'

export default function Events() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historial de Eventos</h1>
      <EventTable />
    </div>
  )
}
