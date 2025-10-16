import arbitrumIcon from '@/assets/chain-icons/arbitrum.svg';
import iexecLogo from '@/assets/iexec-logo.svg';
import wagmiNetworks from '@/utils/wagmiNetworks';

export const ITEMS_PER_PAGE = 6;

export const LOCAL_STORAGE_PREFIX = 'Web3Messaging';
export const CONTACT_URL =
  'https://airtable.com/appDiKrXe5wJgGpdP/pagm2GF2eNdX2ysw3/form';

// Chain ID constants
export const BELLECOUR_CHAIN_ID = 134;
export const ARBITRUM_CHAIN_ID = 42161;
export const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;

// Workerpool configuration
export const WORKERPOOL_ADDRESS_OR_ENS = 'prod-v8-learn.main.pools.iexec.eth';
export const WORKERPOOL_MAX_PRICE = 0.1 * 1e9; // 0.1 RLC in wei

/**
 * See smart-contract transactions:
 * https://blockscout-bellecour.iex.ec/address/0x781482C39CcE25546583EaC4957Fb7Bf04C277D2
 *
 * See all idapps in the whitelist:
 * https://explorer.iex.ec/bellecour/address/0x0c6c77a11068db9fadfba25182e02863361f58da
 */
export const SUPPORTED_CHAINS = [
  {
    id: ARBITRUM_CHAIN_ID,
    name: 'Arbitrum',
    slug: 'arbitrum-mainnet',
    color: '#F4942566',
    icon: arbitrumIcon,
    blockExplorerUrl: 'https://arbiscan.io/',
    subgraphUrl:
      'https://thegraph.arbitrum.iex.ec/api/subgraphs/id/B1comLe9SANBLrjdnoNTJSubbeC7cY7EoNu6zD82HeKy',
    wagmiNetwork: wagmiNetworks.arbitrum,
    tokenSymbol: 'RLC',
    whitelist: {
      web3mail: '0xD5054a18565c4a9E5c1aa3cEB53258bd59d4c78C',
      web3telegram: '0x53AFc09a647e7D5Fa9BDC784Eb3623385C45eF89',
    },
  },
  {
    id: ARBITRUM_SEPOLIA_CHAIN_ID,
    name: 'Arbitrum Sepolia',
    slug: 'arbitrum-sepolia-testnet',
    color: '#28A0F080',
    icon: arbitrumIcon,
    blockExplorerUrl: 'https://sepolia.arbiscan.io/',
    subgraphUrl: {
      poco: 'https://thegraph.arbitrum-sepolia-testnet.iex.ec/api/subgraphs/id/2GCj8gzLCihsiEDq8cYvC5nUgK6VfwZ6hm3Wj8A3kcxz',
      dataprotector:
        'https://thegraph.arbitrum-sepolia-testnet.iex.ec/api/subgraphs/id/5YjRPLtjS6GH6bB4yY55Qg4HzwtRGQ8TaHtGf9UBWWd',
    },
    wagmiNetwork: wagmiNetworks.arbitrumSepolia,
    tokenSymbol: 'RLC',
    whitelist: {
      web3mail: '0x8d46d40840f1Aa2264F96184Ffadf04e5D573B9B',
      web3telegram: '0x54cb7f6d417b2b29c2a4b2e95a66f670812c869d',
    },
  },
  {
    id: BELLECOUR_CHAIN_ID,
    name: 'Bellecour',
    slug: 'bellecour',
    color: '#F4942566',
    icon: iexecLogo,
    blockExplorerUrl: 'https://blockscout-bellecour.iex.ec',
    subgraphUrl: 'https://thegraph.iex.ec/subgraphs/name/bellecour/poco-v5',
    wagmiNetwork: wagmiNetworks.bellecour,
    tokenSymbol: 'xRLC',
    whitelist: {
      web3mail: '0x781482c39cce25546583eac4957fb7bf04c277d2',
      web3telegram: '0x192C6f5AccE52c81Fcc2670f10611a3665AAA98F',
    },
  },
] as const;
