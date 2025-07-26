import EventTable from '../features/events/EventTable'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'

export default function Events() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 overflow-auto">
          <EventTable />
        </main>
      </div>
    </div>
  )
}
