import {
  ITEMS_PER_PAGE,
  WEB3MAIL_IDAPPS_WHITELIST_SC,
  WEB3TELEGRAM_IDAPPS_WHITELIST_SC,
} from '@/config/config';
import { Address } from '@/types';
import { ProtectedData } from '@iexec/dataprotector';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Alert } from '@/components/Alert';
import { CircularLoader } from '@/components/CircularLoader';
import { DocLink } from '@/components/DocLink';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { Button } from '@/components/ui/button';
import {
  getDataProtectorCoreClient,
  getWeb3mailClient,
  getWeb3telegramClient,
} from '@/externals/iexecSdkClient';
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
  mail: {
    gradientTo: 'to-[#50366b]',
    chip: 'before:bg-[#251E31] bg-[#BC70FD] text-[#BC70FD]',
  },
  telegram: {
    gradientTo: 'to-[#00115C]',
    chip: 'before:bg-[#161a2a] bg-[#728CFF] text-[#728CFF]',
  },
};

export default function ContactList() {
  const { address: userAddress } = useUserStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'all' | 'telegram' | 'mail'>(
    'all'
  );

  const contactList = useQuery({
    queryKey: ['fetchContact', userAddress],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('User address is undefined');
      }

      const web3mail = await getWeb3mailClient();
      const myEmailContacts = await web3mail.fetchMyContacts({
        isUserStrict: true,
      });

      const web3telegram = await getWeb3telegramClient();
      const myTelegramContacts = await web3telegram.fetchMyContacts();

      const mergedContacts = [...myEmailContacts, ...myTelegramContacts];

      const sortedContacts = mergedContacts.sort(
        (a, b) =>
          new Date(a.accessGrantTimestamp).getTime() -
          new Date(b.accessGrantTimestamp).getTime()
      );

      const contactsWithProtectedDataAndGrantedAccess = await Promise.all(
        sortedContacts.map(async (contact) => {
          const contactProtectedData = await oneProtectedData.mutateAsync(
            contact.address as Address
          );
          const contactGrantedAccess =
            await oneGrantedAccess.mutateAsync(contactProtectedData);
          return {
            ...contact,
            protectedData: contactProtectedData,
            grantedAccess: contactGrantedAccess,
          };
        })
      );
      return contactsWithProtectedDataAndGrantedAccess;
    },
    enabled: !!userAddress,
    refetchOnWindowFocus: true,
  });

  const oneProtectedData = useMutation({
    mutationFn: async (protectedDataAddress: Address) => {
      const dataProtectorCore = await getDataProtectorCoreClient();
      const oneProtectedData = await dataProtectorCore.getProtectedData({
        protectedDataAddress: protectedDataAddress,
      });
      return oneProtectedData[0];
    },
  });

  const oneGrantedAccess = useMutation({
    mutationFn: async (protectedData: ProtectedData) => {
      const dataProtectorCore = await getDataProtectorCoreClient();
      const oneGrantedAccess = await dataProtectorCore.getGrantedAccess({
        protectedData: protectedData.address,
        authorizedUser: userAddress,
        authorizedApp:
          getDataType(protectedData.schema) === 'mail'
            ? WEB3MAIL_IDAPPS_WHITELIST_SC
            : WEB3TELEGRAM_IDAPPS_WHITELIST_SC,
      });
      return oneGrantedAccess.grantedAccess[0];
    },
  });

  const getDataType = (schema: { [key: string]: unknown }) => {
    if (schema.email) {
      return 'mail';
    }
    if (schema.telegram_chatId) {
      return 'telegram';
    }
  };

  const getProtectedDataByType = (type: 'all' | 'telegram' | 'mail') => {
    return (
      contactList.data?.filter((contact) =>
        type === 'all'
          ? ['telegram', 'mail'].includes(
              getDataType(contact.protectedData.schema) || ''
            )
          : getDataType(contact.protectedData.schema) === type
      ) || []
    );
  };

  const pagesOfContacts =
    contactList &&
    chunkArray(getProtectedDataByType(selectedTab) || [], ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Send Message to contact</h1>
        <p>Email or telegram contact info</p>
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
      <div className="border-grey-600 my-5 grid w-full grid-cols-[2fr_2fr_2fr_2fr_2fr_1fr] items-center overflow-hidden rounded-3xl border [&>div]:px-5 [&>div]:py-5">
        <div className="text-grey-300 text-xs font-semibold">Name</div>
        <div className="text-grey-300 text-xs font-semibold">
          Protected data address
        </div>
        <div className="text-grey-300 text-xs font-semibold">Owner address</div>
        <div className="text-grey-300 text-xs font-semibold">
          Remaining access
        </div>
        <div className="text-grey-300 col-span-2 text-xs font-semibold">
          TYPE (Telegram/Mail)
        </div>
        {!pagesOfContacts || pagesOfContacts?.length === 0 ? (
          <div className="text-text-2 border-grey-600 col-span-6 flex h-48 items-center justify-center border-t text-center">
            {contactList.isLoading ? (
              <CircularLoader />
            ) : contactList.isError ? (
              <Alert variant="error">
                <p>Oops, something went wrong while fetching contact list.</p>
                <p>{contactList.error.toString()}</p>
              </Alert>
            ) : (
              <p>There are no contact yet.</p>
            )}
          </div>
        ) : (
          pagesOfContacts[currentPage].map((contact) => {
            return (
              <div
                key={contact.address}
                className={cn(
                  'bg-grey-50 even:*:bg-grey-800 *:border-grey-600 contents text-sm *:flex *:h-full *:items-center *:border-t *:px-5 *:py-3 odd:[a]:bg-red-300'
                )}
              >
                <div className="truncate">
                  {contact.protectedData.name
                    ? contact.protectedData.name
                    : '(No name)'}
                </div>
                <div className="truncate">
                  <span className="truncate whitespace-nowrap">
                    {contact.address}
                  </span>
                </div>
                <div className="truncate">
                  <span className="truncate whitespace-nowrap">
                    {contact.owner === userAddress ? 'Me' : contact.owner}
                  </span>
                </div>
                <div className="truncate">
                  {contact.grantedAccess && contact.grantedAccess.volume}
                </div>
                <div className="text-primary truncate uppercase">
                  {getDataType(contact.protectedData.schema)}
                </div>
                <div className="justify-end">
                  <Button asChild variant="discreet_outline">
                    <NavLink
                      to={`/contacts/${contact.protectedData.address}/send-message`}
                    >
                      Send
                    </NavLink>
                  </Button>
                </div>
              </div>
            );
          })
        )}
        {pagesOfContacts && pagesOfContacts?.length > 1 && (
          <PaginatedNavigation
            className=""
            pages={pagesOfContacts}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
      <DocLink>
        web3mail / Method called:{' '}
        <a
          href="https://tools.docs.iex.ec/tools/web3mail/methods/fetchMyContacts"
          target="_blank"
          rel="noreferrer"
          className="text-primary whitespace-pre hover:underline"
        >
          <br />
          fetchMyContacts({'{'}
          <br />
          {'  '}isUserStrict: true,
          <br />
          {'}'});
        </a>
      </DocLink>
      <DocLink>
        web3telegram / Method called:{' '}
        <a
          href="https://tools.docs.iex.ec/tools/web3telegram/methods/fetchMyContacts"
          target="_blank"
          rel="noreferrer"
          className="text-primary whitespace-pre hover:underline"
        >
          <br />
          fetchMyContacts();
        </a>
      </DocLink>
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
          {'  '}protectedDataAddress: "0x123abc...",
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
          {'  '}protectedData: "0x123abc...",
          <br />
          {'  '}authorizedUser: "{userAddress}",
          <br />
          {'  '}authorizedApp: "{WEB3MAIL_IDAPPS_WHITELIST_SC}",
          <br />
          {'}'});
        </a>
      </DocLink>
    </div>
  );
}
