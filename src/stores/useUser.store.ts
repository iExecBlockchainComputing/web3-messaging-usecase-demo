import { Address } from '@/types.ts';
import type { Connector } from 'wagmi';
import { create } from 'zustand';

type UserState = {
  connector: Connector | undefined;
  setConnector: (param: Connector | undefined) => void;
  isConnected: boolean;
  setIsConnected: (param: boolean) => void;
  isInitialized: boolean;
  setInitialized: (isInitialized: boolean) => void;
  address: Address | undefined;
  setAddress: (param: Address | undefined) => void;
  chainId: number | undefined;
  setChainId: (param: number | undefined) => void;
};

const useUserStore = create<UserState>((set) => ({
  connector: undefined,
  setConnector: (connector: Connector | undefined) => {
    console.log('UserStore: setConnector called with:', !!connector);
    set({ connector });
  },
  isConnected: false,
  setIsConnected: (isConnected: boolean) => {
    console.log('UserStore: setIsConnected called with:', isConnected);
    set({ isConnected });
  },
  isInitialized: false,
  setInitialized: (isInitialized) => set({ isInitialized }),
  address: undefined,
  setAddress: (address: Address | undefined) => {
    console.log('UserStore: setAddress called with:', address);
    set({ address: address?.toLowerCase() as Address });
  },
  chainId: undefined,
  setChainId: (chainId: number | undefined) => {
    console.log('UserStore: setChainId called with:', chainId);
    set({ chainId: chainId });
  },
}));

export default useUserStore;
