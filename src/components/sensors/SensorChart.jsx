import useSensorStore from '../../store/sensorStore'

export default function SensorChart({ title, type }) {
  const { data } = useSensorStore()
  const values = data[type] || []

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="h-48 overflow-y-auto text-sm font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
        {values.length === 0 ? (
          <p className="text-gray-400">No hay datos disponibles</p>
        ) : (
          values.map((v, i) => (
            <div key={i} className="text-green-600 dark:text-green-300">
              {v.timestamp} → {v.value}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
