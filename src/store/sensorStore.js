import { create } from 'zustand'

const MAX_ENTRIES = 30

const useSensorStore = create((set) => ({
  data: {
    temperature: [],
    humidity: [],
    co2: [],
    pressure: []
  },

  addSensorData: (payload) =>
    set((state) => {
      const { type, value, timestamp } = payload
      const updated = [...(state.data[type] || []), { value, timestamp }]
      return {
        data: {
          ...state.data,
          [type]: updated.slice(-MAX_ENTRIES)
        }
      }
    }),

  clearData: () =>
    set({
      data: {
        temperature: [],
        humidity: [],
        co2: [],
        pressure: []
      }
    })
}))

export default useSensorStore
