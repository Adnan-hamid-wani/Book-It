import axios from 'axios'
const API = axios.create({ baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000' })
export default API
