import { Address } from '@/types';
import { ProtectedData } from '@iexec/dataprotector';
import { Link, User } from 'react-feather';
import ProtectedDataIcon from '@/components/icons/ProtectedDataIcon';
import { Button } from '@/components/ui/button';

export function ProtectedDataDetails({
  protectedData,
  userAddress,
}: {
  protectedData?: ProtectedData;
  userAddress?: Address;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="radial-bg before:bg-grey-800 md:before:bg-grey-900 rounded-20 relative z-0 flex flex-col gap-6 overflow-hidden p-8 before:absolute before:inset-px before:-z-10 before:rounded-[calc(20px-1px)]">
        <div className="z-30 grid gap-6">
          <div className="font-anybody flex items-center gap-4 font-extrabold">
            <div className="rounded-lg bg-yellow-300/10 p-2.5 text-yellow-300">
              <ProtectedDataIcon size={20} />
            </div>
            Protected data address
          </div>
          <Button
            variant="text"
            className="justify-baseline text-left text-base break-all whitespace-normal"
            size="none"
            asChild
          >
            <a
              href={`https://explorer.iex.ec/bellecour/dataset/${protectedData?.address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {protectedData?.address}
            </a>
          </Button>
        </div>
      </div>
      <div className="radial-bg before:bg-grey-800 md:before:bg-grey-900 rounded-20 relative z-0 flex flex-col gap-6 overflow-hidden p-8 before:absolute before:inset-px before:-z-10 before:rounded-[calc(20px-1px)]">
        <div className="z-30 grid gap-6">
          <div className="font-anybody flex items-center gap-4 font-extrabold">
            <div className="rounded-lg bg-yellow-300/10 p-2.5 text-yellow-300">
              <User size={20} />
            </div>
            Owner address
          </div>
          <Button
            variant="text"
            className="justify-baseline text-left text-base break-all whitespace-normal"
            size="none"
            asChild
          >
            <a
              href={`https://explorer.iex.ec/bellecour/address/${userAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {userAddress}
            </a>
          </Button>
        </div>
      </div>
      <div className="radial-bg before:bg-grey-800 md:before:bg-grey-900 rounded-20 relative z-0 flex flex-col gap-6 overflow-hidden p-8 before:absolute before:inset-px before:-z-10 before:rounded-[calc(20px-1px)]">
        <div className="z-30 grid gap-6">
          <div className="font-anybody flex items-center gap-4 font-extrabold">
            <div className="rounded-lg bg-yellow-300/10 p-2.5 text-yellow-300">
              <Link size={20} />
            </div>
            IPFS link
          </div>
          <p>
            <Button
              variant="text"
              className="text-left text-base break-all whitespace-normal underline hover:no-underline"
              size="none"
              asChild
            >
              <a
                href={`https://ipfs-gateway.v8-bellecour.iex.ec/${protectedData?.multiaddr?.replace('/p2p/', 'ipfs/')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {protectedData?.multiaddr}
              </a>
            </Button>
            <br />
            (encrypted content)
          </p>
        </div>
      </div>
    </div>
  );
}
