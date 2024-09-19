import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [
    svgr({
      include: '**/*.svg'
    }),
    react(),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true
    })
  ],
  resolve: {
    alias: {
      // web src directories
      '@presentation': resolve(__dirname, 'src/presentation'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@redux': resolve(__dirname, 'src/redux'),

      // other directories
      '@shared': resolve(__dirname, '../shared'),
      '@commons': resolve(__dirname, '../../commons')
    }
  }
})
