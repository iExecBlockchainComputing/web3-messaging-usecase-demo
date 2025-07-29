import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  const getBase = () => {
    // Vercel production
    if (env.VERCEL_ENV === 'production') {
      return '/web3messaging';
    }
    // Vercel preview/staging 
    if (env.VERCEL_ENV === 'preview') {
      return '/';
    }
    // local development
    return '/web3messaging';
  };
  
  return {
    base: getBase(),
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