import axios from 'axios'

const API_URL = 'http://localhost:5000'

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default $api
