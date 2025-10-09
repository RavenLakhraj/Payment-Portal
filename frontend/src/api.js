import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:2000'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

export default api
