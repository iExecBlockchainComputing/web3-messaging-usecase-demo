import { switchChain } from '@wagmi/core';
import useUserStore from '@/stores/useUser.store.ts';
import { getSupportedChains } from '@/utils/chain.utils.ts';
import { wagmiAdapter } from '@/utils/wagmiConfig.ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.tsx';

export function ChainSelector({ className }: { className?: string }) {
  const { chainId } = useUserStore();
  const handleChainChange = async (value: string) => {
    const chainId = Number(value);
    await switchChain(wagmiAdapter.wagmiConfig, { chainId });
  };

  const filteredChains = getSupportedChains();

  return (
    <Select
      value={chainId?.toString()}
      onValueChange={handleChainChange}
      defaultValue="-1"
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select Chain" />
      </SelectTrigger>
      <SelectContent className="border-grey-600">
        {filteredChains.map((chain) => (
          <SelectItem key={chain.id} value={chain.id.toString()}>
            <img src={chain.icon} className="size-4" alt="" /> {chain.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
