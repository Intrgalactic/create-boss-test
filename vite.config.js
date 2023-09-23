import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { splitVendorChunkPlugin } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),splitVendorChunkPlugin()],
  resolve: {
    alias: {
      src: path.resolve('src/'),
    }
  }
  
})
