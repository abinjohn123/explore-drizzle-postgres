import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { LOCAL_IP } from '../local.config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: LOCAL_IP,
    port: 3001,
    open: true,
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
  },
});
