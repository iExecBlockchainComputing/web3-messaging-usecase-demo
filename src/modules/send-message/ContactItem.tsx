import { Contact as Web3mailContact } from '@iexec/web3mail';
import { Contact as Web3telegramContact } from '@iexec/web3telegram';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/useUser.store';
import { cn } from '@/utils/style.utils';

interface ContactItemProps {
  contact: (Web3telegramContact | Web3mailContact) & {
    contactType: 'mail' | 'telegram';
  };
}

export default function ContactItem({ contact }: ContactItemProps) {
  const { address: userAddress } = useUserStore();

  return (
    <div
      className={cn(
        'bg-grey-50 even:*:bg-grey-800 *:border-grey-600 contents text-sm *:flex *:h-full *:items-center *:border-t *:px-5 *:py-3'
      )}
    >
      <div className="truncate">{contact.name || '(No name)'}</div>
      <div className="truncate">
        <span className="truncate whitespace-nowrap">{contact.address}</span>
      </div>
      <div className="truncate">
        <span className="truncate whitespace-nowrap">
          {contact.owner === userAddress
            ? `(Mine) ${contact.owner}`
            : contact.owner}
        </span>
      </div>
      <div className="truncate">
        {contact.remainingAccess !== undefined
          ? contact.remainingAccess
          : 'N/A'}
      </div>
      <div className="text-primary truncate uppercase">
        {contact.contactType}
      </div>
      <div className="justify-end">
        <Button asChild variant="discreet_outline">
          <Link to={`/contacts/${contact.address}/send-message`}>Send</Link>
        </Button>
      </div>
    </div>
  );
}
