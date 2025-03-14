import { useQuery } from '@tanstack/react-query';
import { JSX, useState } from 'react';
import { Mail, User } from 'react-feather';
import { getDataProtectorCoreClient } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';
import { cn } from '@/utils/style.utils';

const COLOR_CLASSES: {
  [key: string]: {
    gradientTo: string;
    dataReadableType: string;
    icon: JSX.Element;
  };
} = {
  mail: {
    gradientTo: 'after:to-[#50366b]',
    dataReadableType: 'Email address',
    icon: <Mail size={20} />,
  },
  telegram: {
    gradientTo: 'after:to-[#00115C]',
    dataReadableType: 'Telegram ChatId',
    icon: <User size={20} />,
  },
};

export default function AddProtectedData() {
  const { address: userAddress } = useUserStore();
  const [selectedTab, setSelectedTab] = useState<'telegram' | 'mail'>();
  const [currentPage, setCurrentPage] = useState(0);

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
        owner: '0x1d6ce6c05043c28672218b103acb1e017babb68e',
      });
    },
    enabled: !!userAddress,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="grid gap-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-center sm:text-left">Protect new data</h1>
          <p>
            Protect new email or telegram: encrypt, monetize and control access.
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Select your data type</h2>
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Object.keys(COLOR_CLASSES).map((key) => (
          <label
            key={key}
            htmlFor={key}
            className={cn(
              'radial-bg rounded-20 relative z-0 flex cursor-pointer flex-col gap-6 overflow-hidden p-8 duration-300',
              'before:bg-grey-800 before:absolute before:inset-px before:z-20 before:rounded-[calc(20px-1px)] before:duration-300 hover:before:bg-transparent',
              'after:from-grey-800 after:absolute after:inset-px after:-z-10 after:rounded-[calc(20px-1px)] after:bg-gradient-to-br after:from-50%',
              selectedTab === key && 'before:bg-grey-800/30',
              COLOR_CLASSES[key].gradientTo
            )}
            onClick={() => setSelectedTab(key as 'telegram' | 'mail')}
          >
            <input className="absolute -z-10" type="radio" name="" id={key} />
            <div className="z-30 grid gap-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-yellow-300/10 p-2.5 text-yellow-300">
                  {COLOR_CLASSES[key].icon}
                </div>
                <p className="font-anybody capitalize">{key}</p>
              </div>
              <p>{COLOR_CLASSES[key].dataReadableType}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
