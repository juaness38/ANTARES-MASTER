import { useEffect } from 'react'
import useSensorStore from '../../store/sensorStore'
import SensorChart from '../../components/sensors/SensorChart'

export default function SensorMonitor() {
  const { data, addSensorData, clearData } = useSensorStore()

  useEffect(() => {
    clearData()

    const baseWsUrl =
    window.location.protocol === "https:"
      ? "wss://astroflora-backend-production-6a27.up.railway.app"
      : "ws://localhost:8000";

    const socket = new WebSocket(`${baseWsUrl}/ws/sensors/live`);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Nuevo dato recibido:", data);

        if ("temperatura" in data) {
            updateTemperatura(data.temperatura);
        }
        if ("humedad" in data) {
            updateHumedad(data.humedad);
        }
        if ("co2" in data) {
            updateCO2(data.co2);
        }
        if ("presion" in data) {
            updatePresion(data.presion);
        }
    };


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
