import SensorMonitor from '../features/sensors/SensorMonitor'

export default function Sensors() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sensores en Tiempo Real</h1>
      <SensorMonitor />
    </div>
  )
}
