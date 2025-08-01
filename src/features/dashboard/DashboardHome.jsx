import { Activity, Droplet, Wind, Thermometer } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import SensorCard from "../../components/sensors/SensorCard";
import HeaderDashboardHome from "../../components/ui/HeaderDashboardHome";
import ConnectionError from "../../components/ui/ConnectionError";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function DashboardHome() {
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    humidity: "--",
    co2: "--",
    pressure: "--",
    status: "loading",
  });

  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  // Umbrales realistas para cada sensor
  const thresholds = {
    temperature: {
      veryLow: 10, // Peligro por frío extremo
      low: 18, // Advertencia por frío
      high: 28, // Advertencia por calor
      veryHigh: 35, // Peligro por calor extremo
    },
    humidity: {
      veryLow: 30, // Peligro por sequedad extrema
      low: 40, // Advertencia por sequedad
      high: 70, // Advertencia por humedad
      veryHigh: 85, // Peligro por humedad extrema
    },
    co2: {
      normal: 600, // Nivel normal en interiores
      high: 1000, // Advertencia
      veryHigh: 1500, // Peligro
    },
    pressure: {
      veryLow: 950, // Tormenta severa
      low: 980, // Lluvia/tormenta
      high: 1025, // Tiempo seco
      veryHigh: 1040, // Ola de calor
    },
  };

  // Determinar estado y mensaje para cada sensor
  const getSensorStatus = (type, value) => {
    if (value === "--") return { status: "loading", message: "" };

    const numValue = parseFloat(value);
    const t = thresholds[type];

    switch (type) {
      case "temperature":
        if (numValue >= t.veryHigh || numValue <= t.veryLow) {
          return {
            status: "danger",
            message: numValue >= t.veryHigh ? "Ext. Alta" : "Ext. Baja",
          };
        }
        if (numValue >= t.high || numValue <= t.low) {
          return {
            status: "warning",
            message: numValue >= t.high ? "Alta" : "Baja",
          };
        }
        return { status: "normal", message: "Normal" };

      case "humidity":
        if (numValue >= t.veryHigh || numValue <= t.veryLow) {
          return {
            status: "danger",
            message: numValue >= t.veryHigh ? "Ext. Alta" : "Ext. Baja",
          };
        }
        if (numValue >= t.high || numValue <= t.low) {
          return {
            status: "warning",
            message: numValue >= t.high ? "Alta" : "Baja",
          };
        }
        return { status: "normal", message: "Normal" };

      case "co2":
        if (numValue >= t.veryHigh) {
          return { status: "danger", message: "Peligroso" };
        }
        if (numValue >= t.high) {
          return { status: "warning", message: "Elevado" };
        }
        return { status: "normal", message: "Normal" };

      case "pressure":
        if (numValue >= t.veryHigh || numValue <= t.veryLow) {
          return {
            status: "danger",
            message: numValue >= t.veryHigh ? "Ext. Alta" : "Ext. Baja",
          };
        }
        if (numValue >= t.high || numValue <= t.low) {
          return {
            status: "warning",
            message: numValue >= t.high ? "Alta" : "Baja",
          };
        }
        return { status: "normal", message: "Normal" };

      default:
        return { status: "normal", message: "" };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "bg-emerald-500";
      case "warning":
        return "bg-amber-500";
      case "danger":
        return "bg-red-500";
      case "loading":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  // Conexión WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(
        `wss://astroflora-backend-production-6a27.up.railway.app/ws/sensors`
      );

      ws.onopen = () => {
        console.log("Conexión WebSocket establecida");
        setIsConnected(true);
        setLoading(false);
        setError(null);
        setSensorData((prev) => ({ ...prev, status: "normal" }));
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          console.log("Datos recibidos del WebSocket:", payload);

          const d = payload.data;

          const temperatura = parseFloat(d.temperatura);
          const humedad = parseFloat(d.humedad);
          const co2 = parseFloat(d.co2);
          const presion = parseFloat(d.presion);

          const tempStatus = getSensorStatus("temperature", temperatura).status;
          const humidStatus = getSensorStatus("humidity", humedad).status;
          const co2Status = getSensorStatus("co2", co2).status;
          const pressureStatus = getSensorStatus("pressure", presion).status;

          const allStatuses = [
            tempStatus,
            humidStatus,
            co2Status,
            pressureStatus,
          ];
          const overallStatus = allStatuses.includes("danger")
            ? "danger"
            : allStatuses.includes("warning")
            ? "warning"
            : "ok";

          setSensorData({
            temperature: !isNaN(temperatura) ? temperatura.toFixed(1) : "--",
            humidity: !isNaN(humedad) ? humedad.toFixed(1) : "--",
            co2: !isNaN(co2) ? co2.toFixed(0) : "--",
            pressure: !isNaN(presion) ? presion.toFixed(1) : "--",
            status: overallStatus,
          });
        } catch (err) {
          console.error("Error procesando datos del WebSocket:", err);
        }
      };

      ws.onerror = (error) => {
        console.error("Error en WebSocket:", error);
        setError("Error de conexión con el servidor");
        setIsConnected(false);
        setSensorData((prev) => ({ ...prev, status: "danger" }));
      };

      ws.onclose = () => {
        console.log("Conexión WebSocket cerrada");
        setIsConnected(false);
        setSensorData((prev) => ({ ...prev, status: "loading" }));
        // Intentar reconectar después de 5 segundos
        setTimeout(connectWebSocket, 5000);
      };

      socketRef.current = ws;
    };

    connectWebSocket();
  }, []);

  if (loading)
    return <LoadingSpinner message="Cargando datos de los sensores..." />;

  if (error)
    return (
      <ConnectionError
        isConnected={isConnected}
        onRetry={() => {
          // lógica personalizada si no quieres usar window.location.reload()
          window.location.reload();
        }}
      />
    );

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* HeaderDashboardHome  */}
      <HeaderDashboardHome isConnected={isConnected} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {/* Temperature Card */}
        <SensorCard
          title="Temperatura"
          value={sensorData.temperature}
          unit="°C"
          icon={
            <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
          }
          location="Sala Principal"
          type="temperature"
          statusFn={getSensorStatus}
          getStatusColorFn={getStatusColor}
        />

        {/* Humidity Card */}
        <SensorCard
          title="Humedad"
          value={sensorData.humidity}
          unit="%"
          icon={<Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
          location="Sala Principal"
          type="humidity"
          statusFn={getSensorStatus}
          getStatusColorFn={getStatusColor}
        />

        {/* CO2 Card */}
        <SensorCard
          title="CO₂"
          value={sensorData.co2}
          unit="ppm"
          icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />}
          location="Sala Principal"
          type="co2"
          statusFn={getSensorStatus}
          getStatusColorFn={getStatusColor}
        />

        {/* Pressure Card */}
        <SensorCard
          title="Presión"
          value={sensorData.pressure}
          unit="hPa"
          icon={<Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
          location="Sala Principal"
          type="pressure"
          statusFn={getSensorStatus}
          getStatusColorFn={getStatusColor}
        />
      </div>
    </div>
  );
}
