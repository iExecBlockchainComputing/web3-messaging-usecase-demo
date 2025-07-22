import '@fontsource-variable/anybody/wdth.css';
import '@fontsource-variable/mulish';
import '@fontsource/inter/latin-400.css';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { initQueryClient } from '@/utils/initQueryClient.ts';
import { initRollbarAlerting } from '@/utils/initRollbarAlerting.ts';
import './index.css';
import { router } from './router.tsx';
import { wagmiAdapter } from './utils/wagmiConfig.ts';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

console.log('Starting app initialization...');

const { rollbar, rollbarConfig } = initRollbarAlerting();
console.log('Rollbar initialized:', { rollbar: !!rollbar, rollbarConfig: !!rollbarConfig });

const queryClient = initQueryClient({ rollbar });
console.log('Query client initialized');

console.log('Wagmi adapter config:', wagmiAdapter);
console.log('Router:', router);

try {
  console.log('Attempting to render app...');
  const rootElement = document.getElementById('root');
  console.log('Root element:', rootElement);
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </WagmiProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
}
