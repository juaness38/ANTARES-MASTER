import api from './api'
import qs from 'qs'  // asegúrate de haberlo instalado

export async function login(username, password) {
  const data = qs.stringify({ username, password })

  const res = await api.post('/auth/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  const token = res.data?.access_token
  if (!token) throw new Error('Token no recibido')
  localStorage.setItem('token', token)
  return token
}

export async function register(username, password) {
  const res = await api.post('/auth/register', {
    username,
    password
  })
  return res.data
}

export async function getMe() {
  const res = await api.get('/auth/me')
  return res.data
}
