import { CONTACT_URL } from '@/config/config.ts';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDevModeStore } from '@/stores/useDevMode.store.ts';
import { cn } from '@/utils/style.utils.ts';
import iExecLogo from '../../assets/iexec-logo.svg';
import { Button } from '../ui/button.tsx';
import { Label } from '../ui/label.tsx';
import { Switch } from '../ui/switch.tsx';
import { navigationItems } from './navigationItems.tsx';

export function NavBar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { isDevMode, setDevMode } = useDevModeStore();
  const handleMenuToggle = () => {
    setMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="group relative z-30 h-full flex-none lg:w-[280px]">
      <label
        className="group/checkbox fixed top-7 right-7 z-30 flex size-5 w-[26px] origin-center transform flex-col justify-between lg:hidden"
        htmlFor="menu"
        onClick={handleMenuToggle}
      >
        <input
          type="checkbox"
          className="absolute -inset-4 size-14 cursor-pointer appearance-none bg-transparent"
          name="menu"
          id="menu"
          checked={isMenuOpen}
          readOnly
        />
        <span className="pointer-events-none block h-0.5 w-[26px] origin-right transform rounded-full bg-white duration-200 group-has-[:checked]/checkbox:-rotate-45"></span>
        <span className="pointer-events-none block h-0.5 w-[26px] origin-top-right transform rounded-full bg-white duration-200 group-has-[:checked]/checkbox:scale-x-0"></span>
        <span className="pointer-events-none block h-0.5 w-[26px] origin-right transform rounded-full bg-white duration-200 group-has-[:checked]/checkbox:rotate-45"></span>
      </label>
      <div className="border-grey-600 bg-grey-900 fixed flex h-dvh w-full -translate-x-full flex-col overflow-auto rounded-r-3xl border-r px-5 pt-10 pb-5 duration-300 group-has-[:checked]:translate-x-0 lg:w-[280px] lg:translate-x-0">
        <Link
          to="/my-data"
          className="-mx-2 flex items-center p-2"
          onClick={handleMenuToggle}
        >
          <img src={iExecLogo} width="25" height="30" alt="iExec logo" />
          <div className="ml-3 font-mono leading-5 font-bold">
            WEB3 Messaging
          </div>
        </Link>

        <div className="left-navbar text-grey-400 mt-10 flex grow flex-col gap-10">
          <div className="mt-0.5 grow">
            {navigationItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className="aria-current:text-primary aria-current:bg-grey-800 flex items-center gap-x-3 rounded-lg py-3 pr-2 pl-6 duration-200 hover:text-white aria-current:hover:text-white md:py-3"
                onClick={handleMenuToggle}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <Label
            htmlFor="dev-mode"
            className="flex items-center space-x-2 py-1 text-white"
          >
            <Switch
              id="dev-mode"
              checked={isDevMode}
              onCheckedChange={setDevMode}
            />
            <span>Dev Mode</span>
          </Label>

          <div
            className={cn(
              'radial-bg rounded-20 relative z-0 flex flex-col items-center gap-6 overflow-hidden p-6 text-white',
              'before:absolute before:inset-px before:-z-10 before:rounded-[calc(20px-1px)] before:bg-[#161a2a]',
              'after:from-grey-800 after:absolute after:inset-px after:-z-10 after:rounded-[calc(20px-1px)] after:bg-gradient-to-br after:from-50% after:to-[#00115C]'
            )}
          >
            <p className="text-center font-bold md:text-left">
              Interested by Confidential Messaging?
            </p>
            <Button variant="outline" asChild className="w-full max-w-44">
              <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
                Connect with us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
