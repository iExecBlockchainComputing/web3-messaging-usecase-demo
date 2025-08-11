import { useParams, useRouter } from '@tanstack/react-router';
import { switchChain } from '@wagmi/core';
import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { cleanIExecSDKs, initIExecSDKs } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';
import { getChainFromId, INITIAL_CHAIN } from '@/utils/chain.utils';
import { wagmiAdapter } from '@/utils/wagmiConfig';

/**
 * Synchronize URL, account and app state
 *
 * - keep the global store up to date with user's account state
 * - keep the URL up to date with the chain
 * - request chain changes when user's account connects to the wrong chain
 */
export function ChainSyncManager() {
  const { chainSlug } = useParams({ from: '/$chainSlug' });
  const { navigate, history } = useRouter();
  const { pathname } = history.location;
  const {
    chain: accountChain,
    address: accountAddress,
    isConnected: accountIsConnected,
    status: accountStatus,
    connector: accountConnector,
  } = useAccount();
  const { chainId, setChainId, setIsConnected, setAddress } = useUserStore();

  const isNavigating = useRef(false);
  const previousAccountStatus = useRef<string | undefined>(undefined);

  // init store's chain from location (once at mount time)
  useEffect(() => {
    setChainId(INITIAL_CHAIN.id);
  }, []);

  // update store with user account's state
  useEffect(() => {
    setIsConnected(accountIsConnected);
    setAddress(accountAddress);
    if (accountChain?.id && chainId !== accountChain?.id) {
      setChainId(accountChain?.id);
    }
    if (accountStatus === 'connected') {
      initIExecSDKs({ connector: accountConnector });
      return;
    }
    cleanIExecSDKs();
  }, [
    accountAddress,
    accountIsConnected,
    setIsConnected,
    setAddress,
    chainId,
    accountChain?.id,
    setChainId,
    accountStatus,
    accountConnector,
  ]);

  // request chain change if the user connects on chain different from the active chain
  useEffect(() => {
    // auto reconnection case connect to the initial chain
    if (
      (previousAccountStatus.current === undefined ||
        previousAccountStatus.current === 'reconnecting') &&
      accountChain?.id &&
      INITIAL_CHAIN.id !== accountChain?.id
    ) {
      switchChain(wagmiAdapter.wagmiConfig, { chainId: INITIAL_CHAIN.id });
    }
    // connection case connect to the selected chain
    if (
      previousAccountStatus.current === 'connecting' &&
      chainId &&
      accountChain?.id &&
      chainId !== accountChain?.id
    ) {
      switchChain(wagmiAdapter.wagmiConfig, { chainId });
    }

    previousAccountStatus.current = accountStatus;
  }, [accountChain?.id, chainId, accountStatus]);

  // Sync URL with store's chain
  useEffect(() => {
    if (!chainId) {
      return;
    }
    const slug = getChainFromId(chainId)?.slug;

    if (slug !== chainSlug && !isNavigating.current) {
      const [, ...rest] = pathname.split('/').filter(Boolean);
      const newPath = `/${slug}/${rest.join('/')}`;
      isNavigating.current = true;
      const navigationResult = navigate({ to: newPath, replace: true });
      if (navigationResult instanceof Promise) {
        navigationResult.finally(() => {
          isNavigating.current = false;
        });
      } else {
        isNavigating.current = false;
      }
    }
  }, [chainId, chainSlug, navigate, pathname]);

  return null;
}
