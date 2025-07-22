import OnboardingPopup from '@/layouts/OnboardingPopup.tsx';
import { Outlet } from 'react-router-dom';
import { NavBar } from '@/components/navBar/NavBar.tsx';
import { TopNavBar } from '@/components/navBar/TopNavBar.tsx';
import { useWatchAccount } from '@/hooks/useWatchAccount.ts';
import useUserStore from '@/stores/useUser.store.ts';
import { Toaster } from '../components/ui/toaster.tsx';
import ConnectWallet from './ConnectWallet.tsx';
import { DebugRouter } from '@/components/DebugRouter.tsx';

export default function MainLayout() {
  useWatchAccount();
  const { isConnected } = useUserStore();

  return (
    <div className="flex">
      <DebugRouter />
      <NavBar />
      <div className="mx-auto w-full max-w-[1260px] px-6 md:px-10">
        <TopNavBar />
        <div className="mt-10 mb-24 max-w-[1260px]">
          {!isConnected ? <ConnectWallet /> : <Outlet />}
        </div>
      </div>
      {isConnected && <OnboardingPopup />}
      <Toaster />
    </div>
  );
}
