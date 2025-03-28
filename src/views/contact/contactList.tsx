/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ITEMS_PER_PAGE,
  WEB3MAIL_IDAPPS_WHITELIST_SC,
  WEB3TELEGRAM_IDAPPS_WHITELIST_SC,
} from '@/config/config';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Alert } from '@/components/Alert';
import { CircularLoader } from '@/components/CircularLoader';
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

const fetchContacts = async (userAddress: string) => {
  if (!userAddress) { throw new Error('User address is undefined'); }

  const web3mail = await getWeb3mailClient();
  const myEmailContacts = await web3mail.fetchMyContacts({ isUserStrict: true });

  const web3telegram = await getWeb3telegramClient();
  const myTelegramContacts = await web3telegram.fetchMyContacts();

  return [...myEmailContacts, ...myTelegramContacts].sort(
    (a, b) => new Date(a.accessGrantTimestamp).getTime() - new Date(b.accessGrantTimestamp).getTime()
  );
};

const fetchContactDetails = async (contact: any, userAddress: string) => {
  const dataProtectorCore = await getDataProtectorCoreClient();

  const contactProtectedData = await dataProtectorCore.getProtectedData({
    protectedDataAddress: contact.address,
  });

  const grantedAccess = await dataProtectorCore.getGrantedAccess({
    protectedData: contact.address,
    authorizedUser: userAddress,
    authorizedApp:
      contactProtectedData[0].schema.email
        ? WEB3MAIL_IDAPPS_WHITELIST_SC
        : WEB3TELEGRAM_IDAPPS_WHITELIST_SC,
  });
  return {
    ...contactProtectedData[0],
    volume: grantedAccess.grantedAccess[0].volume,
  };
};

export default function ContactList() {
  const { address: userAddress } = useUserStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'all' | 'telegram' | 'mail'>('all');

  // fetch contacts list
  const { data: contacts, isLoading: isContactLoading, isError, error } = useQuery({
    queryKey: ['fetchContacts', userAddress],
    queryFn: () => fetchContacts(userAddress as string),
    enabled: !!userAddress,
    refetchOnWindowFocus: true,
  });

  // fetch detailed data for each contact
  const { data: contactDetails, isLoading: detailsLoading, error: detailsError } = useQuery({
    queryKey: ['contactDetails', contacts],
    queryFn: async () => {
      const details = await Promise.all(
        contacts?.map((contact) => fetchContactDetails(contact, userAddress as string)) || []
      );
      return details;
    },
    enabled: !!contacts, // only run when contacts are fetched
    refetchOnWindowFocus: true,
  });

  const getDataType = (schema: { [key: string]: unknown }) => {
    if (schema.email) { return 'mail'; }
    if (schema.telegram_chatId) { return 'telegram'; }
    return 'unknown';
  };

  const getFilteredContacts = (type: 'all' | 'telegram' | 'mail') => {

    return (
      contactDetails?.filter((contact) =>
        type === 'all'
          ? ['telegram', 'mail'].includes(getDataType(contact.schema))
          : getDataType(contact.schema) === type
      ) || []
    );
  };

  const pagesOfContacts = chunkArray(getFilteredContacts(selectedTab), ITEMS_PER_PAGE);

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
            {isContactLoading || detailsLoading ? (
              <CircularLoader />
            ) : isError || detailsError ? (
              <Alert variant="error">
                <p>Oops, something went wrong while fetching contact list.</p>
                <p>{error?.toString() || detailsError?.toString()}</p>
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
                  {contact.name || '(No name)'}
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
                  {contact.volume}
                </div>
                <div className="text-primary truncate uppercase">
                  {getDataType(contact.schema)}
                </div>
                <div className="justify-end">
                  <Button asChild variant="discreet_outline">
                    <NavLink
                      to={`/contacts/${contact.address}/send-message`}
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
    </div>
  );
}
