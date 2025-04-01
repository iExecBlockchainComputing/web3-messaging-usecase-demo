import { Address } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Alert } from '@/components/Alert';
import { CircularLoader } from '@/components/CircularLoader';
import { DocLink } from '@/components/DocLink';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { getDataProtectorCoreClient } from '@/externals/iexecSdkClient';
import RevokeAccess from '@/modules/myData/RevokeAccess';
import GrantAccessModal from '@/modules/myData/protectedData/GrantAccessModal';
import { ProtectedDataDetails } from '@/modules/myData/protectedData/ProtectedDataDetails';
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
    chip: 'before:bg-[#251E31] bg-[#BC70FD] text-[#BC70FD]',
  },
  other: {
    gradientTo: 'to-[#459388]',
    chip: 'before:bg-[#1a2125] bg-[#459388] text-[#459388]',
  },
};

const ITEMS_PER_PAGE = 8;

export default function ProtectedData() {
  const { address: userAddress } = useUserStore();
  const { protectedDataAddress } = useParams<{
    protectedDataAddress: Address;
  }>();
  const [currentPage, setCurrentPage] = useState(0);
  const [isGrantAccessModalOpen, setGrantAccessModalOpen] = useState(false);

  const protectedData = useQuery({
    queryKey: ['protectedData', protectedDataAddress, userAddress],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('User address is undefined');
      }
      const dataProtectorCore = await getDataProtectorCoreClient();
      // TODO check protectedDataList before
      const protectedDatas = await dataProtectorCore.getProtectedData({
        protectedDataAddress: protectedDataAddress,
        owner: userAddress,
      });
      return protectedDatas[0];
    },
    enabled: !!userAddress && !!protectedDataAddress,
    refetchOnWindowFocus: true,
  });

  const grantedAccess = useQuery({
    queryKey: ['granted access', protectedDataAddress, userAddress],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('User address is undefined');
      }
      const dataProtectorCore = await getDataProtectorCoreClient();
      // TODO check protectedDataList before
      const { grantedAccess } = await dataProtectorCore.getGrantedAccess({
        protectedData: protectedDataAddress,
      });

      return chunkArray(grantedAccess, ITEMS_PER_PAGE);
    },
    enabled: !!userAddress && !!protectedDataAddress,
    refetchOnWindowFocus: true,
  });

  const getDataType = (schema: { [key: string]: unknown }) => {
    if (schema.email) {
      return 'mail';
    }
    if (schema.telegram_chatId) {
      return 'telegram';
    }
    return 'other';
  };

  return (
    <div className="grid gap-8">
      {protectedData.data && (
        <GrantAccessModal
          isSwitchingModalOpen={isGrantAccessModalOpen}
          setSwitchingModalOpen={setGrantAccessModalOpen}
          protectedData={protectedData.data}
        />
      )}
      <h1 className="relative w-fit text-4xl sm:text-left md:max-w-3/4 md:text-center">
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
        <span className="line-clamp-2 text-left">
          {protectedData.data?.name ? protectedData.data.name : '(No name)'}
        </span>
      </h1>
      <ProtectedDataDetails
        protectedData={protectedData.data}
        userAddress={userAddress}
      />
      <div className="space-x-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold">Authorized users</h2>
            <p>
              These are the users who you allowed to access this protected data.
            </p>
          </div>
          <Button
            onClick={() => {
              setGrantAccessModalOpen(true);
            }}
          >
            Authorize new user
          </Button>
        </div>
        <div className="border-grey-600 my-5 grid w-full grid-cols-[2fr_2fr_1fr] items-center overflow-hidden rounded-3xl border [&>div]:px-5 [&>div]:py-5">
          <div className="text-grey-300 text-xs font-semibold">
            User address
          </div>
          <div className="text-grey-300 col-span-2 text-xs font-semibold">
            Number of Access
          </div>
          {!grantedAccess.data || grantedAccess.data?.length === 0 ? (
            <div className="text-text-2 border-grey-600 col-span-3 flex h-48 items-center justify-center border-t text-center">
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
                <p>No authorized users yet.</p>
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
                    <RevokeAccess grantAccess={grantedAccess} />
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
      <DocLink>
        dataprotector-sdk / Method called:{' '}
        <a
          href="https://tools.docs.iex.ec/tools/dataProtector/dataProtectorCore/getProtectedData"
          target="_blank"
          rel="noreferrer"
          className="text-primary whitespace-pre hover:underline"
        >
          <br />
          getProtectedData({'{'}
          <br />
          {'  '}protectedDataAddress: "{protectedDataAddress}",
          <br />
          {'  '}owner: "{userAddress}",
          <br />
          {'}'});
        </a>
      </DocLink>
      <DocLink>
        dataprotector-sdk / Method called:{' '}
        <a
          href="https://tools.docs.iex.ec/tools/dataProtector/dataProtectorCore/getGrantedAccess"
          target="_blank"
          rel="noreferrer"
          className="text-primary whitespace-pre hover:underline"
        >
          <br />
          getGrantedAccess({'{'}
          <br />
          {'  '}protectedData: "{protectedDataAddress}",
          <br />
          {'}'});
        </a>
      </DocLink>
      <DocLink>
        dataprotector-sdk / Method called:{' '}
        <a
          href="https://tools.docs.iex.ec/tools/dataProtector/dataProtectorCore/revokeOneAccess"
          target="_blank"
          rel="noreferrer"
          className="text-primary whitespace-pre hover:underline"
        >
          <br />
          revokeOneAccess({'{'}
          <br />
          {'  '}grantAccess: {'{}'},
          <br />
          {'}'});
        </a>
      </DocLink>
    </div>
  );
}
