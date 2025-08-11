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

/**
 * initial chain evaluated once against the current location when the app loads
 */
export const INITIAL_CHAIN =
  getChainFromSlug(new URL(window.location.href).pathname.split('/')[1]) ||
  getSupportedChains()[0];
