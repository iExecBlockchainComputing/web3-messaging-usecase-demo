import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // In prod, app will be served under `demo.iex.ec/web3messaging` path
  console.log(env.SET_SUBPATH_FOR_PROD);
  
  const basePath =
    env.SET_SUBPATH_FOR_PROD === 'true' ? '/web3messaging' : '/';
  console.log('[vite] Building with base path:', basePath);
  return {
    base: basePath,
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