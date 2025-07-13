import { useEffect } from 'react'
import useSensorStore from '../../store/sensorStore'
import SensorChart from '../../components/sensors/SensorChart'

export default function SensorMonitor() {
  const { data, addSensorData, clearData } = useSensorStore()

  useEffect(() => {
    clearData()

    const socket = new WebSocket('ws://localhost:8000/ws/sensors')

    socket.onmessage = (event) => {
      const sensorPayload = JSON.parse(event.data)
      addSensorData(sensorPayload)
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    socket.onclose = () => {
      console.warn('WebSocket cerrado')
    }

    return () => socket.close()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SensorChart title="Temperatura (°C)" type="temperature" />
      <SensorChart title="Humedad (%)" type="humidity" />
      <SensorChart title="CO₂ (ppm)" type="co2" />
      <SensorChart title="Presión (hPa)" type="pressure" />
    </div>
  )
}
