import { Activity, Droplet, Wind, Thermometer, Wifi, WifiOff, Database, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ScientificKPICard from "../../components/ui/ScientificKPICard";
import ConnectionError from "../../components/ui/ConnectionError";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import "../../styles/scientific.css";

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
    <div className="min-h-screen bg-background scientific-font">
      {/* Scientific Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card scientific-border-b p-6 scientific-shadow"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary">ANTARES AstroFlora</h1>
                  <p className="text-secondary text-sm">Sistema de Monitoreo Científico en Tiempo Real</p>
                </div>
              </div>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center space-x-4">
              <motion.div 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                  isConnected 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
                animate={{ scale: isConnected ? 1 : [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: isConnected ? 0 : Infinity, repeatType: "reverse" }}
              >
                {isConnected ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </motion.div>
              
              {/* Overall Status */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                sensorData.status === 'ok' 
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : sensorData.status === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : sensorData.status === 'danger'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}>
                {sensorData.status === 'danger' && <AlertTriangle className="w-4 h-4" />}
                {sensorData.status === 'warning' && <TrendingUp className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {sensorData.status === 'ok' ? 'Sistema Normal' : 
                   sensorData.status === 'warning' ? 'Advertencia' :
                   sensorData.status === 'danger' ? 'Alerta Crítica' : 'Cargando...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Scientific Grid Layout */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {/* Temperature Card */}
          <ScientificKPICard
            title="Temperatura Ambiental"
            value={sensorData.temperature}
            unit="°C"
            icon={<Thermometer className="w-6 h-6" />}
            location="Laboratorio Principal"
            type="temperature"
            statusFn={getSensorStatus}
            getStatusColorFn={getStatusColor}
            changeType={parseFloat(sensorData.temperature) > 25 ? 'increase' : 'decrease'}
            change={isConnected ? `${Math.abs(parseFloat(sensorData.temperature || 0) - 22).toFixed(1)}°` : null}
          />

          {/* Humidity Card */}
          <ScientificKPICard
            title="Humedad Relativa"
            value={sensorData.humidity}
            unit="%"
            icon={<Droplet className="w-6 h-6" />}
            location="Laboratorio Principal"
            type="humidity"
            statusFn={getSensorStatus}
            getStatusColorFn={getStatusColor}
            changeType={parseFloat(sensorData.humidity) > 50 ? 'increase' : 'decrease'}
            change={isConnected ? `${Math.abs(parseFloat(sensorData.humidity || 0) - 45).toFixed(1)}%` : null}
          />

          {/* CO2 Card */}
          <ScientificKPICard
            title="Dióxido de Carbono"
            value={sensorData.co2}
            unit="ppm"
            icon={<Wind className="w-6 h-6" />}
            location="Laboratorio Principal"
            type="co2"
            statusFn={getSensorStatus}
            getStatusColorFn={getStatusColor}
            changeType={parseFloat(sensorData.co2) > 800 ? 'increase' : 'decrease'}
            change={isConnected ? `${Math.abs(parseFloat(sensorData.co2 || 0) - 400).toFixed(0)}ppm` : null}
          />

          {/* Pressure Card */}
          <ScientificKPICard
            title="Presión Atmosférica"
            value={sensorData.pressure}
            unit="hPa"
            icon={<Activity className="w-6 h-6" />}
            location="Laboratorio Principal"
            type="pressure"
            statusFn={getSensorStatus}
            getStatusColorFn={getStatusColor}
            changeType={parseFloat(sensorData.pressure) > 1013 ? 'increase' : 'decrease'}
            change={isConnected ? `${Math.abs(parseFloat(sensorData.pressure || 0) - 1013).toFixed(1)}hPa` : null}
          />
        </motion.div>

        {/* Scientific Footer Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card scientific-border rounded-lg p-4 scientific-shadow"
        >
          <div className="flex items-center justify-between text-sm text-secondary">
            <div className="flex items-center space-x-4">
              <span>Última actualización: {new Date().toLocaleTimeString('es-ES')}</span>
              <span>•</span>
              <span>Protocolo: WebSocket Seguro</span>
              <span>•</span>
              <span>Frecuencia: Tiempo Real</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} scientific-pulse`}></div>
              <span>Estado: {isConnected ? 'Activo' : 'Inactivo'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
