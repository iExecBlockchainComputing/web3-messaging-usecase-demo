import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/stores/useUser.store';

export function useChainChangeRedirect(redirectPath: string) {
  const navigate = useNavigate();
  const { chainId } = useUserStore();
  const initialChainId = useRef<number | undefined>(undefined);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && chainId !== undefined) {
      initialChainId.current = chainId;
      hasInitialized.current = true;
      return;
    }

    if (
      hasInitialized.current &&
      initialChainId.current !== undefined &&
      chainId !== undefined &&
      chainId !== initialChainId.current
    ) {
      navigate(redirectPath);
    }
  }, [chainId, redirectPath, navigate]);
}
