import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, User } from 'react-feather';
import { NavLink, useParams } from 'react-router-dom';
import { Alert } from '@/components/Alert';
import { CircularLoader } from '@/components/CircularLoader';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { getDataProtectorCoreClient } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';
import { chunkArray } from '@/utils/chunkArray';
import { cn } from '@/utils/style.utils';

const COLOR_CLASSES: {
  [key: string]: {
    gradientTo?: string;
    chip: string;
  };
} = {
  all: {
    chip: 'before:bg-[#312a1e] bg-yellow-300 text-yellow-300',
  },
  telegram: {
    gradientTo: 'to-[#00115C]',
    chip: 'before:bg-[#161a2a] bg-[#728CFF] text-[#728CFF]',
  },
  mail: {
    gradientTo: 'to-[#50366b]',
    chip: 'before:bg-[#251E31] bg-[#9531E9] text-[#9531E9]',
  },
  other: {
    gradientTo: 'to-[#459388]',
    chip: 'before:bg-[#1a2125] bg-[#459388] text-[#459388]',
  },
};

const ITEMS_PER_PAGE = 8;

export default function ProtectedData() {
  const { address: userAddress } = useUserStore();
  const { protectedDataId } = useParams();
  const [currentPage, setCurrentPage] = useState(0);

  const protectedData = useQuery({
    queryKey: ['protectedData', protectedDataId, userAddress],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('User address is undefined');
      }
      const dataProtectorCore = await getDataProtectorCoreClient();
      // TODO check protectedDataList before
      const protectedDatas = await dataProtectorCore.getProtectedData({
        protectedDataAddress: protectedDataId,
        owner: userAddress,
      });
      return protectedDatas[0];
    },
    enabled: !!userAddress && !!protectedDataId,
    refetchOnWindowFocus: true,
  });

  const grantedAccess = useQuery({
    queryKey: ['granted access', protectedDataId, userAddress],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('User address is undefined');
      }
      const dataProtectorCore = await getDataProtectorCoreClient();
      // TODO check protectedDataList before
      const { grantedAccess } = await dataProtectorCore.getGrantedAccess({
        protectedData: protectedDataId,
      });
      console.log('grantedAccess', grantedAccess);

      return chunkArray(grantedAccess, ITEMS_PER_PAGE);
    },
    enabled: !!userAddress && !!protectedDataId,
    refetchOnWindowFocus: true,
  });

  const getDataType = (schema: { [key: string]: unknown }) => {
    if (schema.email) {
      return 'mail';
    }
    if (schema.telegramChatId || schema.chatId) {
      return 'telegram';
    }
    return 'other';
  };

  return (
    <div className="grid gap-8">
      <h1 className="relative w-fit text-4xl sm:text-left md:text-center">
        {protectedData.data && (
          <span
            className={cn(
              buttonVariants({ variant: 'chip', size: 'sm' }),
              COLOR_CLASSES[getDataType(protectedData.data.schema)].chip,
              'pointer-events-none absolute -top-2 left-0 w-fit -translate-y-full text-xs md:-top-4 md:-right-4 md:left-auto md:mr-0 md:translate-x-full md:translate-y-0'
            )}
          >
            {protectedData.data.schema.email ? 'MAIL' : 'TELEGRAM'}
          </span>
        )}
        {protectedData.data?.name}
      </h1>
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
                href={`https://explorer.iex.ec/bellecour/dataset/${protectedData.data?.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {protectedData.data?.address}
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
                  href={`https://ipfs-gateway.v8-bellecour.iex.ec/${protectedData.data?.multiaddr?.replace('/p2p/', 'ipfs/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {protectedData.data?.multiaddr}
                </a>
              </Button>
              <br />
              (encrypted content)
            </p>
          </div>
        </div>
      </div>
      <div className="space-x-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold">Authorized users</h2>
            <p>
              These are the users who you allowed to access this protected data.
            </p>
          </div>
          <Button onClick={() => {}}>Authorize new user</Button>
        </div>
        <div className="border-grey-600 my-5 grid w-full grid-cols-[2fr_2fr_1fr] items-center overflow-hidden rounded-3xl border [&>div]:px-5 [&>div]:py-5">
          <div className="text-grey-300 text-xs font-semibold">
            User address
          </div>
          <div className="text-grey-300 col-span-2 text-xs font-semibold">
            Number of Access
          </div>
          {!grantedAccess.data || grantedAccess.data?.length === 0 ? (
            <div className="text-text-2 col-span-3 flex h-48 items-center justify-center text-center">
              {grantedAccess.isLoading ? (
                <CircularLoader />
              ) : grantedAccess.isError ? (
                <Alert variant="error">
                  <p>
                    Oops, something went wrong while fetching all granted
                    access.
                  </p>
                  <p>{grantedAccess.error.toString()}</p>
                </Alert>
              ) : (
                <div>
                  <p>No authorized users yet.</p>
                  <Button onClick={() => {}}>Authorize user</Button>
                </div>
              )}
            </div>
          ) : (
            grantedAccess.data[currentPage].map((grantedAccess) => {
              return (
                <div
                  key={grantedAccess.salt}
                  className={cn(
                    'bg-grey-50 odd:*:bg-grey-800 *:border-grey-600 contents text-sm *:flex *:h-full *:items-center *:border-t *:px-5 *:py-3 odd:[a]:bg-red-300'
                  )}
                >
                  <div className="truncate">
                    <span className="truncate whitespace-nowrap">
                      {grantedAccess.requesterrestrict}
                    </span>
                  </div>
                  <div className="truncate">{grantedAccess.volume}</div>
                  <div className="justify-end">
                    <Button variant="outline" className="">
                      Revoke access
                    </Button>
                  </div>
                </div>
              );
            })
          )}
          {grantedAccess.data && grantedAccess.data?.length > 1 && (
            <PaginatedNavigation
              className="col-span-5"
              pages={grantedAccess.data}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
      <Button asChild variant="outline" className="ml-auto w-fit">
        <NavLink to="/my-data">Back to my data</NavLink>
      </Button>
    </div>
  );
}
