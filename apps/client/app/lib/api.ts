import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2512';  // Remove trailing slash
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
  //timeout: 50000,
});

// Add request interceptor to handle API versioning
api.interceptors.request.use((config) => {
  // If the URL doesn't start with /v1/, add it
  if (!config.url?.startsWith('/v1/') && !config.url?.startsWith('/query')) {
    config.url = `/v1${config.url}`;
  }
  return config;
});

export default api;
