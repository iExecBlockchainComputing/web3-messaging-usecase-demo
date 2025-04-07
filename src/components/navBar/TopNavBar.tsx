import { LogOut } from 'react-feather';
import { Link } from 'react-router-dom';
import { useLoginLogout } from '@/hooks/useLoginLogout';
import useUserStore from '@/stores/useUser.store';
import iExecLogo from '../../assets/iexec-logo.svg';
import { AddressChip } from './AddressChip';

export function TopNavBar() {
  const { isConnected, address } = useUserStore();
  const { logout } = useLoginLogout();

  return (
    <div className="flex items-center justify-between pt-5 lg:pt-10">
      <Link to="/my-data" className="-m-2 flex items-center p-2 lg:invisible">
        <img src={iExecLogo} width="25" height="25" alt="iExec logo" />
      </Link>
      {isConnected && (
        <div className="flex max-w-[1260px] items-center pr-10 lg:pr-0">
          <AddressChip address={address!} className="ml-6" />
          <button
            type="button"
            className="hover:drop-shadow-link-hover -mr-1 ml-2 p-1"
            onClick={() => logout()}
          >
            <LogOut size="20" />
          </button>
        </div>
      )}
    </div>
  );
}
