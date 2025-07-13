import DashboardHome from '../features/dashboard/DashboardHome'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 overflow-auto">
          <DashboardHome />
        </main>
      </div>
    </div>
  )
}
