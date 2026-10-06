import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Later: proxy /api to Spring Boot (http://localhost:8080)
export default defineConfig({ plugins: [react()], server: { proxy: { '/api': 'http://localhost:8080' } } })
