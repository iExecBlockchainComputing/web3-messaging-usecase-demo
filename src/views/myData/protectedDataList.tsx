import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'react-feather';
import { NavLink } from 'react-router-dom';
import { Alert } from '@/components/Alert';
import { CircularLoader } from '@/components/CircularLoader';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { Button } from '@/components/ui/button';
import { getDataProtectorCoreClient } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';
import { chunkArray } from '@/utils/chunkArray';
import { formatTimestamp } from '@/utils/formatTimestamp';
import { pluralize } from '@/utils/pluralize';
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
};

const getDataType = (schema: { [key: string]: unknown }) => {
  if (schema.email) {
    return 'mail';
  }
  if (schema.telegramChatId || schema.chatId) {
    return 'telegram';
  }
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default function ProtectedDataList() {
  const { address: userAddress } = useUserStore();
  const [selectedTab, setSelectedTab] = useState<'all' | 'telegram' | 'mail'>(
    'all'
  );
  const [currentPage, setCurrentPage] = useState(0);
  const windowSize = useWindowSize();

  const {
    data: protectedDataList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['apps', userAddress],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('User address is undefined');
      }
      const dataProtectorCore = await getDataProtectorCoreClient();
      return dataProtectorCore.getProtectedData({
        owner: userAddress,
      });
    },
    enabled: !!userAddress,
    refetchOnWindowFocus: true,
  });

  const getProtectedDataByType = (type: 'all' | 'telegram' | 'mail') => {
    return (
      protectedDataList?.filter((data) =>
        type === 'all'
          ? ['telegram', 'mail'].includes(getDataType(data.schema) || '')
          : getDataType(data.schema) === type
      ) || []
    );
  };

  const getItemsPerPage = () => {
    if (windowSize.width > 80 * 16) {
      return 4;
    }
    if (windowSize.width > 48 * 16) {
      return 3;
    }
    if (windowSize.width > 40 * 16) {
      return 2;
    }
    return 3;
  };

  const itemsPerPage = getItemsPerPage();

  const pagesOfProtectedData =
    protectedDataList &&
    chunkArray(getProtectedDataByType(selectedTab) || [], itemsPerPage);

  return (
    <div className="grid gap-10">
      <div className="radial-bg before:bg-grey-800 relative z-0 flex flex-col gap-6 overflow-hidden rounded-2xl p-8 before:absolute before:inset-px before:-z-10 before:rounded-[15px]">
        <div>
          <h1 className="text-center sm:text-left">Protect a new data</h1>
          <p>
            Fully encrypt your email address or your Telegram chatID to enable
            confidential messaging.
          </p>
        </div>
        <Button className="mx-auto sm:ml-0">
          <NavLink to="/my-data/add-protected-data">Create new</NavLink>
        </Button>
        <div className="absolute inset-0 -z-10 blur-2xl sm:blur-[100px] lg:blur-[150px]">
          <div className="absolute top-1/4 right-0 aspect-[23/30] w-1/2 rounded-full bg-[#00115C] sm:-top-12" />
          <div className="absolute top-0 right-0 hidden aspect-square h-full translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FCECC0] sm:block" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold">
            My protected data{' '}
            <span className="text-lg font-normal">
              (
              {pluralize(
                protectedDataList ? protectedDataList.length : 0,
                'item'
              )}
              )
            </span>
          </h2>
          <p>Remove Confidentially</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {Object.keys(COLOR_CLASSES).map((key) => {
            return (
              <Button
                key={key}
                variant="chip"
                className={cn(
                  'text-sm font-medium whitespace-nowrap',
                  selectedTab === key && COLOR_CLASSES[key].chip
                )}
                onClick={() => {
                  setSelectedTab(key as 'all' | 'telegram' | 'mail');
                  if (currentPage !== 0) {
                    setCurrentPage(0);
                  }
                }}
              >
                {key.toUpperCase()}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex min-h-72 flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {!pagesOfProtectedData || pagesOfProtectedData?.length === 0 ? (
          <div className="text-text-2 col-span-5 flex h-48 items-center justify-center text-center">
            {isLoading ? (
              <CircularLoader />
            ) : isError ? (
              <Alert variant="error">
                <p>
                  Oops, something went wrong while fetching your protected data
                  data.
                </p>
                <p className="mt-1 text-sm">{error?.toString()}</p>
              </Alert>
            ) : (
              <p>No protected data yet.</p>
            )}
          </div>
        ) : (
          pagesOfProtectedData[currentPage]?.map((protectedData) => {
            const dataType = getDataType(protectedData.schema);
            const colorConfig =
              COLOR_CLASSES[dataType ?? 'all'] || COLOR_CLASSES.other;

            return (
              <div
                key={protectedData.address}
                className="radial-bg before:bg-grey-800 rounded-20 relative z-0 flex flex-col gap-6 overflow-hidden p-8 pt-[calc(--spacing(8)+42px)] before:absolute before:inset-px before:-z-10 before:rounded-[calc(20px-1px)]"
              >
                <div
                  className={cn(
                    'absolute inset-x-px top-px h-[42px] rounded-t-[calc(20px-1px)] bg-gradient-to-r from-[#14141B] from-25%',
                    colorConfig.gradientTo
                  )}
                />
                <Button
                  variant="chip"
                  size="sm"
                  className={cn(colorConfig.chip, 'w-fit')}
                  onClick={() => {
                    setSelectedTab(dataType as 'all' | 'telegram' | 'mail');
                    if (currentPage !== 0) {
                      setCurrentPage(0);
                    }
                  }}
                >
                  {dataType && dataType.toUpperCase()}
                </Button>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">
                    {protectedData.name ? protectedData.name : '(No name)'}
                  </h3>
                  <p className="text-grey-200 text-lg">
                    {formatTimestamp(protectedData.creationTimestamp)}
                  </p>
                </div>
                <Button
                  variant="text"
                  size="none"
                  className="group mt-auto w-fit text-lg font-bold"
                >
                  Manage Access{' '}
                  <ArrowRight
                    size="20"
                    className="duration-300 group-hover:translate-x-1"
                  />
                </Button>
              </div>
            );
          })
        )}
        {pagesOfProtectedData && pagesOfProtectedData?.length > 1 && (
          <PaginatedNavigation
            className="sm:col-span-2 md:col-span-3 xl:col-span-4"
            pages={pagesOfProtectedData}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
