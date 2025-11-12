export const getBasename = (): string => {
  const vercelEnv = import.meta.env.VITE_VERCEL_ENV;

  // Vercel production
  if (vercelEnv === 'production') {
    return '/web3messaging';
  }

  // Vercel preview/staging
  if (vercelEnv === 'preview') {
    return '/';
  }

  // Local development
  return '/web3messaging';
};
