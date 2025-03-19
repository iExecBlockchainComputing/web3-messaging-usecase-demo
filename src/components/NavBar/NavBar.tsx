import '@fontsource/space-mono/700.css';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import iExecLogo from '../../assets/iexec-logo.svg';
import { cn } from '../../utils/style.utils.ts';
import { Button } from '../ui/button.tsx';

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
            <NavLink
              to={'/my-data'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-x-3 px-2 py-2 duration-200 hover:text-white md:py-3',
                  isActive ? 'text-yellow-500 underline underline-offset-4' : ''
                )
              }
              onClick={() => {
                handleMenuToggle();
              }}
            >
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.1599 1.88916H3.0399C2.68644 1.88916 2.3999 2.6055 2.3999 3.48916V6.68916C2.3999 7.57281 2.68644 8.28916 3.0399 8.28916H8.1599C8.51336 8.28916 8.7999 7.57281 8.7999 6.68916V3.48916C8.7999 2.6055 8.51336 1.88916 8.1599 1.88916Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.76 1.88916H12.64C12.2865 1.88916 12 2.6055 12 3.48916V6.68916C12 7.57281 12.2865 8.28916 12.64 8.28916H17.76C18.1135 8.28916 18.4 7.57281 18.4 6.68916V3.48916C18.4 2.6055 18.1135 1.88916 17.76 1.88916Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.1599 11.4893H3.0399C2.68644 11.4893 2.3999 12.2056 2.3999 13.0893V16.2893C2.3999 17.1729 2.68644 17.8893 3.0399 17.8893H8.1599C8.51336 17.8893 8.7999 17.1729 8.7999 16.2893V13.0893C8.7999 12.2056 8.51336 11.4893 8.1599 11.4893Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.76 11.4893H12.64C12.2865 11.4893 12 12.2056 12 13.0893V16.2893C12 17.1729 12.2865 17.8893 12.64 17.8893H17.76C18.1135 17.8893 18.4 17.1729 18.4 16.2893V13.0893C18.4 12.2056 18.1135 11.4893 17.76 11.4893Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>My data</span>
            </NavLink>
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
