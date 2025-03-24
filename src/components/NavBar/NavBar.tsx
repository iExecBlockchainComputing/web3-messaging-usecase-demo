import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import iExecLogo from '../../assets/iexec-logo.svg';
import { cn } from '../../utils/style.utils.ts';
import { Button } from '../ui/button.tsx';
import { navigationItems } from './navigationItems';

export function NavBar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => {
    setMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="group relative z-30 h-full flex-none lg:w-[255px]">
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
      <div className="border-grey-600 bg-grey-900 fixed flex h-dvh w-full -translate-x-full flex-col overflow-auto rounded-r-3xl border-r px-5 pt-10 duration-300 group-has-[:checked]:translate-x-0 lg:w-[255px] lg:translate-x-0">
        <Link to="/" className="-mx-2 flex items-center p-2">
          <img src={iExecLogo} width="25" height="30" alt="iExec logo" />
          <div className="ml-3 font-mono leading-5 font-bold">iExec</div>
        </Link>

        <div className="left-navbar text-grey-400 mt-10 flex grow flex-col">
          <div className="mt-0.5 grow">
            {navigationItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-x-3 px-2 py-2 duration-200 hover:text-white md:py-3',
                    isActive
                      ? 'text-yellow-500 underline underline-offset-4'
                      : ''
                  )
                }
                onClick={handleMenuToggle}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <hr className="border-grey-700 mt-6 border-t" />

          <div className="mt-10 mb-16">
            <Button
              asChild
              size="lg"
              variant="discreet_outline"
              className="w-full"
            >
              <a
                href="https://iexecproject.atlassian.net/servicedesk/customer/portal/4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Support
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="discreet_outline"
              className="mt-4 w-full"
            >
              <a
                href="https://iexecproject.atlassian.net/servicedesk/customer/portal/4/group/9/create/71"
                target="_blank"
                rel="noopener noreferrer"
              >
                Feedback
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
