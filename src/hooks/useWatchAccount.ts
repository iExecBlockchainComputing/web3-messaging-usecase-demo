import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { cleanIExecSDKs, initIExecSDKs } from '@/externals/iexecSdkClient.ts';
import useUserStore from '@/stores/useUser.store';

export function useWatchAccount() {
  console.log('useWatchAccount: Hook called');
  const { connector, status, address, chain, isConnected } = useAccount();
  const { setConnector, setIsConnected, setAddress, setChainId } =
    useUserStore();

  console.log('useWatchAccount: Account state:', {
    connector: !!connector,
    status,
    address,
    chainId: chain?.id,
    isConnected,
  });

  useEffect(() => {
    console.log('useWatchAccount: useEffect triggered with status:', status);

    // Update userStore
    setConnector(connector);
    setIsConnected(isConnected);
    setAddress(address);
    setChainId(chain?.id);

    // Update dataProtector client
    if (status === 'connected') {
      console.log('useWatchAccount: Initializing iExec SDKs');
      initIExecSDKs({ connector });
      return;
    }
    console.log('useWatchAccount: Cleaning iExec SDKs');
    cleanIExecSDKs();
  }, [connector, status, address, chain]);
}
