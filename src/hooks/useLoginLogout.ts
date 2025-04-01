import { useAppKit } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import { useDisconnect } from 'wagmi';

export function useLoginLogout() {
  const { open } = useAppKit();
  const { disconnectAsync } = useDisconnect();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await disconnectAsync();
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  const login = () => {
    open({ view: 'Connect' });
    navigate('/my-data');
  };

  return {
    login,
    logout,
  };
}
