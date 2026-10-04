import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, proxy websocket traffic to the Node server so no URL config is needed.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/socket.io': { target: 'http://localhost:4000', ws: true } } },
});
