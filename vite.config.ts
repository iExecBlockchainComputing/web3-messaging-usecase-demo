import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: "/web3messaging",
    define: {
      'process.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN': JSON.stringify(
        env.NEXT_PUBLIC_SECURE_SITE_ORIGIN || 'https://secure.walletconnect.org'
      ),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
}
);