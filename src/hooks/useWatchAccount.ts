import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { cleanIExecSDKs, initIExecSDKs } from '@/externals/iexecSdkClient.ts';
import useUserStore from '@/stores/useUser.store';

export function useWatchAccount() {
  const {
    connector,
    status,
    address,
    chain: accountChain,
    isConnected,
  } = useAccount();
  const { setConnector, setIsConnected, setAddress, setChainId, chainId } =
    useUserStore();

  useEffect(() => {
    setConnector(connector);
    setIsConnected(isConnected);
    setAddress(address);

    if (accountChain?.id && chainId !== accountChain.id) {
      setChainId(accountChain.id);
    }

    // Update dataProtector client
    if (status === 'connected') {
      initIExecSDKs({ connector });
      return;
    }
    cleanIExecSDKs();
  }, [
    connector,
    status,
    address,
    accountChain,
    chainId,
    isConnected,
    setConnector,
    setIsConnected,
    setAddress,
    setChainId,
  ]);
}
