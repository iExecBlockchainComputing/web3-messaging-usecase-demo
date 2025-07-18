import {
  WEB3MAIL_IDAPPS_WHITELIST_SC,
  WEB3TELEGRAM_IDAPPS_WHITELIST_SC,
} from '@/config/config';
import { Contact as Web3mailContact } from '@iexec/web3mail';
import { Contact as Web3telegramContact } from '@iexec/web3telegram';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CircularLoader } from '@/components/CircularLoader';
import { Button } from '@/components/ui/button';
import { getDataProtectorCoreClient } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';
import { cn } from '@/utils/style.utils';

interface ContactItemProps {
  contact: (Web3telegramContact | Web3mailContact) & {
    contactType: 'mail' | 'telegram';
  };
}

const fetchContactDetails = async (
  contact: (Web3telegramContact | Web3mailContact) & {
    contactType: 'mail' | 'telegram';
  },
  userAddress: string
) => {
  const dataProtectorCore = await getDataProtectorCoreClient();

  const contactProtectedData = await dataProtectorCore.getProtectedData({
    protectedDataAddress: contact.address,
  });

  const grantedAccess = await dataProtectorCore.getGrantedAccess({
    protectedData: contact.address,
    authorizedUser: userAddress,
    authorizedApp:
      contact.contactType === 'mail'
        ? WEB3MAIL_IDAPPS_WHITELIST_SC
        : WEB3TELEGRAM_IDAPPS_WHITELIST_SC,
  });

  return {
    ...contactProtectedData[0],
    contactType: contact.contactType,
    volume: grantedAccess.grantedAccess[0].volume,
  };
};

export default function ContactItem({ contact }: ContactItemProps) {
  const { address: userAddress } = useUserStore();

  const {
    data: contactDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['contactDetails', contact.address, userAddress],
    queryFn: () => fetchContactDetails(contact, userAddress as string),
    enabled: !!userAddress,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="contents">
        <div className="col-span-6 flex items-center justify-center py-4">
          <CircularLoader />
        </div>
      </div>
    );
  }

  if (isError || !contactDetails) {
    return (
      <div className="contents">
        <div className="col-span-6 flex items-center justify-center py-4 text-red-500">
          Error loading contact details
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-grey-50 even:*:bg-grey-800 *:border-grey-600 contents text-sm *:flex *:h-full *:items-center *:border-t *:px-5 *:py-3'
      )}
    >
      <div className="truncate">
        {contactDetails.name ? contactDetails.name : '(No name)'}
      </div>
      <div className="truncate">
        <span className="truncate whitespace-nowrap">
          {contactDetails.address}
        </span>
      </div>
      <div className="truncate">
        <span className="truncate whitespace-nowrap">
          {contactDetails.owner === userAddress
            ? `(Mine) ${contactDetails.owner}`
            : contactDetails.owner}
        </span>
      </div>
      <div className="truncate">{contactDetails.volume}</div>
      <div className="text-primary truncate uppercase">
        {contactDetails.contactType}
      </div>
      <div className="justify-end">
        <Button asChild variant="discreet_outline">
          <Link to={`/contacts/${contactDetails.address}/send-message`}>
            Send
          </Link>
        </Button>
      </div>
    </div>
  );
}
