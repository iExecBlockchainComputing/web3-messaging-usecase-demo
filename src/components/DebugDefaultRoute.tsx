import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export function DebugDefaultRoute() {
  useEffect(() => {
    console.log('DebugDefaultRoute: Default route hit, redirecting to /my-data');
  }, []);

  return <Navigate to="/my-data" replace />;
} 