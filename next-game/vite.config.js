import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
    plugins: [
        react(),
        istanbul({
            include: 'src/*',
            exclude: ['node_modules', 'test/', 'cypress/', '**/*.cy.{js,jsx,ts,tsx}'],
            extension: ['.jsx', '.js', '.ts', '.tsx'],
            requireEnv: false,
            checkProd: false,
        }),
    ],
    server: {
        host: true,
        port: 5173,
    },
    optimizeDeps: {
        include: ['react', 'react-dom'],
    },

    builder: {
        buildTarget: 'modules',
    },
    experimental: {
        rolldown: false
    }
})