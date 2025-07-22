import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function DebugRouter() {
  const location = useLocation();

  useEffect(() => {
    console.log('Router Debug:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      key: location.key,
      state: location.state
    });
  }, [location]);

  return null;
} 