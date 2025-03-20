import { Address } from '@/types';
import { ProtectedData } from '@iexec/dataprotector';
import { Link, User } from 'react-feather';
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
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-yellow-300/10 p-2.5 text-yellow-300">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.5 16H2.3C1.58203 16 1 14.5449 1 12.75V6.25C1 4.45507 1.58203 3 2.3 3H12.7C13.418 3 14 4.45507 14 6.25V8.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.8574 13.5005H9.85742C9.30514 13.5005 8.85742 13.9482 8.85742 14.5005V18.0005C8.85742 18.5528 9.30514 19.0005 9.85742 19.0005H16.8574C17.4097 19.0005 17.8574 18.5528 17.8574 18.0005V14.5005C17.8574 13.9482 17.4097 13.5005 16.8574 13.5005Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.7861 13.1426V11.2379C10.7861 10.6064 11.0571 10.0008 11.5393 9.5543C12.0215 9.10778 12.6756 8.85693 13.3576 8.85693C14.0395 8.85693 14.6936 9.10778 15.1758 9.5543C15.6581 10.0008 15.929 10.6064 15.929 11.2379V13.1426"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
          <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-4">
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
