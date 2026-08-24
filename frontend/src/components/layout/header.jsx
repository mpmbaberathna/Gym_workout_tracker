import { useState, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import Image from "@components/ui/image";
import { getRouteByName, getNavigationRoutes } from "@app/router";

/* main navigation header component provides responsive navigation with mobile menu support */
const Header = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // check if current route is active
  const isActiveRoute = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  const navigationItems = getNavigationRoutes();

  return (
    <header role="banner">
      <nav className="relative bg-brand-card" role="navigation" aria-label="Main navigation">
        <div className="container mx-auto px-4">
          <div className="relative flex h-24 items-center">
            {/* logo */}
            <Link className="inline-block" to={getRouteByName('home')} aria-label="Frequencii - Home">
              <img
                className="h-10"
                src="/images/brand.svg"
                alt="Frequencii logo"
              />
            </Link>

            {/* mobile menu button */}
            <button
              className="lg:hidden flex items-center justify-center h-10 w-10 ml-auto bg-gradient-to-b from-cyanGreen-800 to-cyan-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyanGreen-500 focus:ring-offset-2"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M3 5H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M3 12H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M3 19H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>

            {/* desktop navigation */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.to}
                  className={`inline-block hover:text-yellowGreen-700 ${index < navigationItems.length - 1 ? 'mr-10' : ''} font-medium transition duration-200 focus:outline-none focus:underline ${isActiveRoute(item.to) ? 'text-yellowGreen-700' : ''}`}
                  to={item.to}
                  aria-current={isActiveRoute(item.to) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* desktop auth buttons */}
            <div className="hidden lg:block ml-auto">
              <Link
                className="inline-flex items-center justify-center h-10 mr-4 px-4 text-center leading-loose text-sm text-gray-700 hover:text-yellowGreen-700 font-semibold transition duration-200 focus:outline-none focus:underline"
                to={getRouteByName('login')}
              >
                Login
              </Link>
              <Link
                className="inline-flex items-center justify-center h-10 px-4 text-center leading-loose text-sm text-gray-700 hover:text-yellowGreen-700 font-semibold border border-gray-200 hover:border-yellowGreen-600 shadow-sm hover:shadow-none rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellowGreen-500 focus:ring-offset-2"
                to={getRouteByName('register')}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* mobile menu */}
        <div
          id="mobile-menu"
          className={`${mobileMenuOpen ? 'block' : 'hidden'} fixed top-0 left-0 bottom-0 w-5/6 max-w-md z-50`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* backdrop */}
          <div
            className="fixed inset-0 bg-teal-800 opacity-70"
            onClick={closeMobileMenu}
            aria-hidden="true"
          ></div>

          {/* menu panel */}
          <nav className="relative flex flex-col py-6 px-10 w-full h-full bg-brand-card overflow-y-auto" role="navigation">
            {/* header */}
            <div className="flex mb-auto items-center">
              <Link
                className="inline-block mr-auto"
                to={getRouteByName('home')}
                onClick={closeMobileMenu}
                aria-label="Frequencii - Home"
              >
                <img
                  className="h-10"
                  src="/images/brand.svg"
                  alt="Frequencii logo"
                />
              </Link>
              <button
                className="p-2 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                onClick={closeMobileMenu}
                aria-label="Close mobile menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M6 18L18 6M6 6L18 18" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>

            {/* navigation links */}
            <div className="py-12 mb-auto">
              <ul className="flex-col space-y-6" role="list">
                {navigationItems.map((item) => (
                  <li key={item.to}>
                    <Link
                      className={`inline-block text-lg font-medium transition duration-200 focus:outline-none focus:underline ${isActiveRoute(item.to) ? 'text-yellowGreen-700' : 'text-black hover:text-yellowGreen-700'}`}
                      to={item.to}
                      onClick={closeMobileMenu}
                      aria-current={isActiveRoute(item.to) ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* auth buttons */}
            <div className="space-y-4">
              <Link
                className="flex items-center justify-center h-10 px-4 text-center text-sm text-gray-700 font-semibold border border-gray-200 hover:bg-gray-100 shadow-sm rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                to={getRouteByName('login')}
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                className="flex items-center justify-center h-10 px-4 text-center text-sm text-white font-semibold border border-yellowGreen-600 bg-yellowGreen-500 hover:bg-yellowGreen-600 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellowGreen-500 focus:ring-offset-2"
                to={getRouteByName('register')}
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </nav>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;