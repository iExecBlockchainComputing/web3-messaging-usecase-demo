import { switchChain } from '@wagmi/core';
import { useAccount } from 'wagmi';
import useUserStore from '@/stores/useUser.store';
import { wagmiAdapter } from '@/utils/wagmiConfig';

export function useChainSwitch() {
  const { isConnected } = useAccount();
  const { setChainId } = useUserStore();
  /**
   * request a chain change
   *
   * the change is either:
   * - immediately effective if the user is not connected
   * - delegated to the user's account provider if the user is connected
   */
  async function requestChainChange(chainId: number) {
    if (isConnected) {
      switchChain(wagmiAdapter.wagmiConfig, { chainId });
    } else {
      setChainId(chainId);
    }
  }
  return { requestChainChange };
}
