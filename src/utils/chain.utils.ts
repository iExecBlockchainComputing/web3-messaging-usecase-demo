import { SUPPORTED_CHAINS } from '@/config/config';

export function getSupportedChains() {
  return SUPPORTED_CHAINS;
}

export function getSubgraphUrl(chainId: number) {
  const subgraphUrl = getSupportedChains().find(
    (chain) => chain.id === chainId
  )?.subgraphUrl;
  if (!subgraphUrl) {
    throw new Error(`Subgraph URL not found for chain ID: ${chainId}`);
  }
  return subgraphUrl;
}

export function getWhitelistAddresses(chainId: number | undefined) {
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

export function getBlockExplorerUrl(chainId: number) {
  const chain = getChainFromId(chainId);
  return chain?.blockExplorerUrl ?? 'https://blockscout.com/';
}
