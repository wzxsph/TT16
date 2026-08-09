import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode, isSsrBuild }) => {
  const base = process.env.TT16_BASE_PATH || (mode === 'pages' ? '/TT16/' : '/')
  const outDir = isSsrBuild
    ? fileURLToPath(new URL('../../dist/ssr', import.meta.url))
    : fileURLToPath(new URL(mode === 'pages' ? '../../dist/pages' : '../../dist/web', import.meta.url))

  return {
    base,
    envPrefix: 'TT16_',
    publicDir: fileURLToPath(new URL('../../public', import.meta.url)),
    plugins: [react()],
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      sourcemap: false,
      outDir,
      emptyOutDir: true,
    },
    resolve: {
      alias: [
        {
          find: '@tt16/core/guess',
          replacement: fileURLToPath(new URL('../../packages/core/src/guess/index.ts', import.meta.url)),
        },
        {
          find: '@tt16/core',
          replacement: fileURLToPath(new URL('../../packages/core/src/index.ts', import.meta.url)),
        },
      ],
    },
    ssr: {
      noExternal: ['react', 'react-dom', 'lucide-react'],
    },
  }
})
