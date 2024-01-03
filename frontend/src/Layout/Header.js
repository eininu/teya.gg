import { Fragment, useState } from "react";

// Headless UI, for more info and examples you can check out https://github.com/tailwindlabs/headlessui
import { Menu, Transition } from "@headlessui/react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Page Header */}
      <header
        id="page-header"
        className="z-1 flex flex-none items-center bg-white shadow-sm dark:bg-gray-800"
      >
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
          <div className="flex justify-between py-4">
            {/* Left Section */}
            <div className="flex items-center">
              {/* Logo */}
              <a
                href="#"
                className="group inline-flex items-center space-x-2 text-lg font-bold tracking-wide text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300"
              >
                <svg
                  className="hi-mini hi-cube-transparent inline-block size-5 text-blue-600 transition group-hover:scale-110 dark:text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.638 1.093a.75.75 0 01.724 0l2 1.104a.75.75 0 11-.724 1.313L10 2.607l-1.638.903a.75.75 0 11-.724-1.313l2-1.104zM5.403 4.287a.75.75 0 01-.295 1.019l-.805.444.805.444a.75.75 0 01-.724 1.314L3.5 7.02v.73a.75.75 0 01-1.5 0v-2a.75.75 0 01.388-.657l1.996-1.1a.75.75 0 011.019.294zm9.194 0a.75.75 0 011.02-.295l1.995 1.101A.75.75 0 0118 5.75v2a.75.75 0 01-1.5 0v-.73l-.884.488a.75.75 0 11-.724-1.314l.806-.444-.806-.444a.75.75 0 01-.295-1.02zM7.343 8.284a.75.75 0 011.02-.294L10 8.893l1.638-.903a.75.75 0 11.724 1.313l-1.612.89v1.557a.75.75 0 01-1.5 0v-1.557l-1.612-.89a.75.75 0 01-.295-1.019zM2.75 11.5a.75.75 0 01.75.75v1.557l1.608.887a.75.75 0 01-.724 1.314l-1.996-1.101A.75.75 0 012 14.25v-2a.75.75 0 01.75-.75zm14.5 0a.75.75 0 01.75.75v2a.75.75 0 01-.388.657l-1.996 1.1a.75.75 0 11-.724-1.313l1.608-.887V12.25a.75.75 0 01.75-.75zm-7.25 4a.75.75 0 01.75.75v.73l.888-.49a.75.75 0 01.724 1.313l-2 1.104a.75.75 0 01-.724 0l-2-1.104a.75.75 0 11.724-1.313l.888.49v-.73a.75.75 0 01.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Company</span>
              </a>
              {/* END Logo */}
            </div>
            {/* END Left Section */}

            {/* Right Section */}
            <div className="flex items-center space-x-2 lg:space-x-5">
              {/* Desktop Navigation */}
              <nav className="hidden items-center space-x-2 lg:flex">
                {/* Для Dashboard */}
                <a
                  href="/"
                  className={`group flex items-center space-x-2 rounded-lg border ${
                    isActive("/")
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : "bg-transparent text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                  } px-3 py-2 text-sm font-medium dark:border-transparent dark:bg-gray-700 dark:text-white`}
                >
                  {/* SVG Dashboard */}
                  <span>Dashboard</span>
                </a>
                {/* Для Customers */}
                <a
                  href="/websites"
                  className={`group flex items-center space-x-2 rounded-lg border ${
                    isActive("/websites")
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : "bg-transparent text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                  } px-3 py-2 text-sm font-medium dark:border-transparent dark:bg-gray-700 dark:text-white`}
                >
                  {/* SVG Websites */}
                  <span>Websites</span>
                </a>
              </nav>
              {/* END Desktop Navigation */}

              {/* Toggle Mobile Navigation */}
              <div className="lg:hidden">
                <button
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  type="button"
                  className="inline-flex items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hi-solid hi-menu inline-block size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {/* END Toggle Mobile Navigation */}
            </div>
            {/* END Right Section */}
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden ${mobileNavOpen ? "" : "hidden"}`}>
            <nav className="flex flex-col space-y-2 border-t py-4 dark:border-gray-700">
              {/* Для Dashboard */}
              <a
                href="/"
                className={`group flex items-center space-x-2 rounded-lg border ${
                  isActive("/")
                    ? "bg-blue-50 text-blue-600 border-blue-50"
                    : "border-transparent text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                } px-3 py-2 text-sm font-semibold dark:border-transparent dark:bg-gray-700/75 dark:text-white`}
              >
                {/* SVG Dashboard */}
                <span>Dashboard</span>
              </a>

              {/* Websites */}
              <a
                href="/websites"
                className={`group flex items-center space-x-2 rounded-lg border ${
                  isActive("/websites")
                    ? "bg-blue-50 text-blue-600 border-blue-50"
                    : "border-transparent text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                } px-3 py-2 text-sm font-medium dark:border-transparent dark:bg-gray-700 dark:text-white`}
              >
                {/* SVG Websites */}
                <span>Websites</span>
              </a>
            </nav>
          </div>
          {/* END Mobile Navigation */}
        </div>
      </header>
      {/* END Page Header */}
    </>
  );
}
