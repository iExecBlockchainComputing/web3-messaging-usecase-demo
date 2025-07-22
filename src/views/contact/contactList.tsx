import { ITEMS_PER_PAGE } from '@/config/config';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert } from '@/components/Alert';
import { CircularLoader } from '@/components/CircularLoader';
import { DocLink } from '@/components/DocLink';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { Button } from '@/components/ui/button';
import {
  getWeb3mailClient,
  getWeb3telegramClient,
} from '@/externals/iexecSdkClient';
import DialogSendMessageConfirmation from '@/modules/myData/DialogSendMessageConfirmation';
import useUserStore from '@/stores/useUser.store';
import { chunkArray } from '@/utils/chunkArray';
import { cn } from '@/utils/style.utils';
import ContactItem from './ContactItem';

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
  if (!userAddress) {
    throw new Error('User address is undefined');
  }

  const web3mail = await getWeb3mailClient();
  const myEmailContacts = await web3mail.fetchMyContacts({
    isUserStrict: true,
  });

  const web3telegram = await getWeb3telegramClient();
  const myTelegramContacts = await web3telegram.fetchMyContacts({
    isUserStrict: true,
  });

  const emailContactsWithType = myEmailContacts.map((contact) => ({
    ...contact,
    contactType: 'mail' as const,
  }));

  const telegramContactsWithType = myTelegramContacts.map((contact) => ({
    ...contact,
    contactType: 'telegram' as const,
  }));

  return [...emailContactsWithType, ...telegramContactsWithType].sort(
    (a, b) =>
      new Date(b.accessGrantTimestamp).getTime() -
      new Date(a.accessGrantTimestamp).getTime()
  );
};

export default function ContactList() {
  const { address: userAddress } = useUserStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'all' | 'telegram' | 'mail'>(
    'all'
  );

  // fetch contacts list
  const {
    data: contacts,
    isLoading: isContactLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['fetchContacts', userAddress],
    queryFn: () => fetchContacts(userAddress as string),
    enabled: !!userAddress,
    refetchOnWindowFocus: true,
  });

  const getFilteredContacts = (type: 'all' | 'telegram' | 'mail') => {
    return (
      contacts?.filter((contact) =>
        type === 'all'
          ? ['telegram', 'mail'].includes(contact.contactType)
          : contact.contactType === type
      ) || []
    );
  };

  const pagesOfContacts = chunkArray(
    getFilteredContacts(selectedTab),
    ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <DialogSendMessageConfirmation />
      <div>
        <h1 className="text-xl font-bold">Send Message to contact</h1>
        <p>Email or telegram that people have authorized you to access</p>
      </div>
      <div className="-mb-2 flex gap-x-6 gap-y-3 overflow-auto pb-2">
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
      <div className="border-grey-600 my-5 grid grid-cols-[2fr_2fr_2fr_2fr_2fr_1fr] items-center overflow-auto rounded-3xl border [&>div]:px-5 [&>div]:py-5">
        <div className="text-grey-300 min-w-32 text-xs font-semibold text-nowrap uppercase">
          Name
        </div>
        <div className="text-grey-300 text-xs font-semibold text-nowrap uppercase">
          Protected data address
        </div>
        <div className="text-grey-300 text-xs font-semibold text-nowrap uppercase">
          Owner address
        </div>
        <div className="text-grey-300 text-xs font-semibold text-nowrap uppercase">
          Remaining access
        </div>
        <div className="text-grey-300 col-span-2 min-w-52 text-xs font-semibold text-nowrap uppercase">
          TYPE (Telegram/Mail)
        </div>
        {!pagesOfContacts || pagesOfContacts?.length === 0 ? (
          <div className="text-text-2 border-grey-600 col-span-6 flex h-48 items-center justify-center border-t text-center">
            {isContactLoading ? (
              <CircularLoader />
            ) : isError ? (
              <Alert variant="error">
                <p>Oops, something went wrong while fetching contact list.</p>
                <p>{error?.toString()}</p>
              </Alert>
            ) : (
              <p>There are no contact yet.</p>
            )}
          </div>
        ) : (
          pagesOfContacts[currentPage].map((contact) => (
            <ContactItem key={contact.address} contact={contact} />
          ))
        )}

        {pagesOfContacts && pagesOfContacts?.length > 1 && (
          <PaginatedNavigation
            className="border-grey-600 col-span-6 border-t"
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
          {'  '}authorizedApp: "[WEB3MAIL_OR_TELEGRAM_IDAPPS_WHITELIST_SC]",
          <br />
          {'}'});
        </a>
      </DocLink>
    </div>
  );
}
