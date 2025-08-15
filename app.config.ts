// app.config.ts
import { defineConfig } from '@tanstack/start/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: { preset: 'netlify' },   // <-- important
  vite: { plugins: [react(), tsconfigPaths()] },
})
