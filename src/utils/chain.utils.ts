import { SUPPORTED_CHAINS } from '@/config/config';

export function getSupportedChains() {
  return SUPPORTED_CHAINS;
}

export function getSubgraphUrl(chainId: number): string {
  const chain = getSupportedChains().find((chain) => chain.id === chainId);
  if (!chain?.subgraphUrl) {
    throw new Error(`Subgraph URL not found for chain ID: ${chainId}`);
  }
  return chain.subgraphUrl;
}

export function getWhitelistAddresses(chainId: number | undefined): {
  web3mail: string;
  web3telegram: string;
} {
  if (chainId === undefined) {
    throw new Error('Chain ID is required to get whitelist addresses');
  }

  const chain = getSupportedChains().find((chain) => chain.id === chainId);
  if (!chain?.whitelist) {
    throw new Error(`Whitelist not found for chain ID: ${chainId}`);
  }

  return chain.whitelist;
}

export function getChainFromSlug(slug: string | undefined) {
  return getSupportedChains().find((c) => c.slug === slug);
}

export function getChainFromId(id: number | undefined) {
  return getSupportedChains().find((c) => c.id === id);
}

export function getBlockExplorerUrl(chainId: number): string {
  const chain = getChainFromId(chainId);
  if (!chain?.blockExplorerUrl) {
    console.warn(
      `Block explorer URL not found for chain ID: ${chainId}, using default`
    );
    return 'https://blockscout.com/';
  }
  return chain.blockExplorerUrl;
}

// Helper function to check if a chain is supported
export function isChainSupported(chainId: number): boolean {
  return getSupportedChains().some((chain) => chain.id === chainId);
}

// Helper function to get chain name
export function getChainName(chainId: number): string {
  const chain = getChainFromId(chainId);
  return chain?.name || `Unknown Chain (${chainId})`;
}
