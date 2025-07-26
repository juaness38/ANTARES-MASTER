import { FiActivity, FiDroplet, FiWind, FiThermometer, FiClock, FiAlertTriangle, FiWifi, FiWifiOff } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

export default function DashboardHome() {
  const [sensorData, setSensorData] = useState({
    temperature: '--',
    humidity: '--',
    co2: '--',
    pressure: '--',
    status: 'loading'
  })

  const [protocols, setProtocols] = useState([])
  const [activeTab, setActiveTab] = useState('today')
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const socketRef = useRef(null)

  // Umbrales realistas para cada sensor
  const thresholds = {
    temperature: {
      veryLow: 10,    // Peligro por frío extremo
      low: 18,        // Advertencia por frío
      high: 28,       // Advertencia por calor
      veryHigh: 35    // Peligro por calor extremo
    },
    humidity: {
      veryLow: 30,    // Peligro por sequedad extrema
      low: 40,        // Advertencia por sequedad
      high: 70,       // Advertencia por humedad
      veryHigh: 85    // Peligro por humedad extrema
    },
    co2: {
      normal: 600,    // Nivel normal en interiores
      high: 1000,     // Advertencia
      veryHigh: 1500  // Peligro
    },
    pressure: {
      veryLow: 950,   // Tormenta severa
      low: 980,       // Lluvia/tormenta
      high: 1025,     // Tiempo seco
      veryHigh: 1040  // Ola de calor
    }
  }

  // Determinar estado y mensaje para cada sensor
  const getSensorStatus = (type, value) => {
    if (value === '--') return { status: 'loading', message: '' }
    
    const numValue = parseFloat(value)
    const t = thresholds[type]

    switch(type) {
      case 'temperature':
        if (numValue >= t.veryHigh || numValue <= t.veryLow) {
          return { 
            status: 'danger',
            message: numValue >= t.veryHigh ? 'Críticamente Alta' : 'Críticamente Baja'
          }
        }
        if (numValue >= t.high || numValue <= t.low) {
          return { 
            status: 'warning',
            message: numValue >= t.high ? 'Alta' : 'Baja'
          }
        }
        return { status: 'normal', message: 'Normal' }

      case 'humidity':
        if (numValue >= t.veryHigh || numValue <= t.veryLow) {
          return { 
            status: 'danger',
            message: numValue >= t.veryHigh ? 'Ext. Alta' : 'Ext. Baja'
          }
        }
        if (numValue >= t.high || numValue <= t.low) {
          return { 
            status: 'warning',
            message: numValue >= t.high ? 'Alta' : 'Baja'
          }
        }
        return { status: 'normal', message: 'Normal' }

      case 'co2':
        if (numValue >= t.veryHigh) {
          return { status: 'danger', message: 'Peligroso' }
        }
        if (numValue >= t.high) {
          return { status: 'warning', message: 'Elevado' }
        }
        return { status: 'normal', message: 'Normal' }

      case 'pressure':
        if (numValue >= t.veryHigh || numValue <= t.veryLow) {
          return { 
            status: 'danger',
            message: numValue >= t.veryHigh ? 'Ext. Alta' : 'Ext. Baja'
          }
        }
        if (numValue >= t.high || numValue <= t.low) {
          return { 
            status: 'warning',
            message: numValue >= t.high ? 'Alta' : 'Baja'
          }
        }
        return { status: 'normal', message: 'Normal' }

      default:
        return { status: 'normal', message: '' }
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'normal': return 'bg-emerald-500'
      case 'warning': return 'bg-amber-500'
      case 'danger': return 'bg-red-500'
      case 'loading': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  // Componente de alerta reutilizable
  const AlertBadge = ({ status, message }) => (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        absolute bottom-3 right-3 
        text-xs font-medium
        px-2.5 py-1 rounded-full
        flex items-center
        shadow-sm
        ${status === 'danger' 
          ? 'bg-red-500/10 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-700' 
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
        }
      `}
    >
      <span className="relative flex h-2 w-2 mr-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
          status === 'danger' ? 'bg-red-400' : 'bg-amber-400'
        } opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${
          status === 'danger' ? 'bg-red-500' : 'bg-amber-500'
        }`}></span>
      </span>
      {message}
    </motion.div>
  )

  // Conexión WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
    const ws = new WebSocket(`wss://astroflora-backend-production-6a27.up.railway.app/ws/sensors`);
      
      ws.onopen = () => {
        console.log('Conexión WebSocket establecida')
        setIsConnected(true)
        setLoading(false)
        setError(null)
        setSensorData(prev => ({ ...prev, status: 'normal' }))
      }
      
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          console.log('Datos recibidos del WebSocket:', payload)

          const d = payload.data

          const temperatura = parseFloat(d.temperatura)
          const humedad = parseFloat(d.humedad)
          const co2 = parseFloat(d.co2)
          const presion = parseFloat(d.presion)

          const tempStatus = getSensorStatus('temperature', temperatura).status
          const humidStatus = getSensorStatus('humidity', humedad).status
          const co2Status = getSensorStatus('co2', co2).status
          const pressureStatus = getSensorStatus('pressure', presion).status

          const allStatuses = [tempStatus, humidStatus, co2Status, pressureStatus]
          const overallStatus = allStatuses.includes('danger')
            ? 'danger'
            : allStatuses.includes('warning')
            ? 'warning'
            : 'ok'

          setSensorData({
            temperature: !isNaN(temperatura) ? temperatura.toFixed(1) : '--',
            humidity: !isNaN(humedad) ? humedad.toFixed(1) : '--',
            co2: !isNaN(co2) ? co2.toFixed(0) : '--',
            pressure: !isNaN(presion) ? presion.toFixed(1) : '--',
            status: overallStatus
          })
        } catch (err) {
          console.error('Error procesando datos del WebSocket:', err)
        }
      }

      
      ws.onerror = (error) => {
        console.error('Error en WebSocket:', error)
        setError('Error de conexión con el servidor')
        setIsConnected(false)
        setSensorData(prev => ({ ...prev, status: 'danger' }))
      }
      
      ws.onclose = () => {
        console.log('Conexión WebSocket cerrada')
        setIsConnected(false)
        setSensorData(prev => ({ ...prev, status: 'loading' }))
        // Intentar reconectar después de 5 segundos
        setTimeout(connectWebSocket, 5000)
      }
      
      socketRef.current = ws
    }

    connectWebSocket()
   
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto"
        ></motion.div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Conectando con servidor de sensores...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-lg max-w-md w-full">
        <p className="font-bold">Error de conexión</p>
        <p className="mt-1">No se pudo conectar al servidor WebSocket</p>
        <div className="flex items-center mt-3 text-sm">
          <FiWifiOff className="mr-2" />
          <span>Estado: {isConnected ? 'Conectado' : 'Desconectado'}</span>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Reintentar conexión
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
            Panel de Control Ambiental
          </h1>
          <div className="flex items-center mt-1">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isConnected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isConnected ? (
                <>
                  <FiWifi className="inline mr-1 text-emerald-500" />
                  <span>Conectado • Actualización en tiempo real</span>
                </>
              ) : (
                <>
                  <FiWifiOff className="inline mr-1 text-amber-500" />
                  <span>Desconectado • Reconectando...</span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('today')}
            className={`flex-1 sm:flex-none px-3 py-1 text-sm rounded-lg transition-all ${
              activeTab === 'today' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            Hoy
          </button>
          <button 
            onClick={() => setActiveTab('week')}
            className={`flex-1 sm:flex-none px-3 py-1 text-sm rounded-lg transition-all ${
              activeTab === 'week' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            Semana
          </button>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {/* Temperature Card */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 relative transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="w-[calc(100%-24px)]">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Temperatura</h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {sensorData.temperature}°C
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              getStatusColor(getSensorStatus('temperature', sensorData.temperature).status)
            }`}></div>
          </div>
          <div className="flex items-center mt-3 text-emerald-500">
            <FiThermometer className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-xs">Sala Principal</span>
          </div>
          {getSensorStatus('temperature', sensorData.temperature).status !== 'normal' && (
            <AlertBadge 
              status={getSensorStatus('temperature', sensorData.temperature).status}
              message={getSensorStatus('temperature', sensorData.temperature).message}
            />
          )}
        </motion.div>

        {/* Humidity Card */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 relative transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="w-[calc(100%-24px)]">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Humedad</h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {sensorData.humidity}%
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              getStatusColor(getSensorStatus('humidity', sensorData.humidity).status)
            }`}></div>
          </div>
          <div className="flex items-center mt-3 text-blue-500">
            <FiDroplet className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-xs">Sala Principal</span>
          </div>
          {getSensorStatus('humidity', sensorData.humidity).status !== 'normal' && (
            <AlertBadge 
              status={getSensorStatus('humidity', sensorData.humidity).status}
              message={getSensorStatus('humidity', sensorData.humidity).message}
            />
          )}
        </motion.div>

        {/* CO2 Card */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 relative transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="w-[calc(100%-24px)]">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">CO₂</h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {sensorData.co2}ppm
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              getStatusColor(getSensorStatus('co2', sensorData.co2).status)
            }`}></div>
          </div>
          <div className="flex items-center mt-3 text-amber-500">
            <FiWind className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-xs">Sala Principal</span>
          </div>
          {getSensorStatus('co2', sensorData.co2).status !== 'normal' && (
            <AlertBadge 
              status={getSensorStatus('co2', sensorData.co2).status}
              message={getSensorStatus('co2', sensorData.co2).message}
            />
          )}
        </motion.div>

        {/* Pressure Card */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 relative transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="w-[calc(100%-24px)]">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Presión</h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {sensorData.pressure}hPa
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              getStatusColor(getSensorStatus('pressure', sensorData.pressure).status)
            }`}></div>
          </div>
          <div className="flex items-center mt-3 text-purple-500">
            <FiActivity className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-xs">Sala Principal</span>
          </div>
          {getSensorStatus('pressure', sensorData.pressure).status !== 'normal' && (
            <AlertBadge 
              status={getSensorStatus('pressure', sensorData.pressure).status}
              message={getSensorStatus('pressure', sensorData.pressure).message}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}