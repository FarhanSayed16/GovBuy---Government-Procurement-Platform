// src/components/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from './LogoutButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Determine which links to show based on role & auth
  const navItems = [
    { name: 'Home',           to: '/',                   auth: 'both' },
    { name: 'Browse Tenders', to: '/tenders',            auth: 'both' },
    { name: 'My Bids',        to: '/bids/my',            auth: 'auth', roles: ['supplier'] },
    { name: 'My Tenders',     to: '/tenders/mine',        auth: 'auth', roles: ['procurement_officer','department_head'] },
    { name: 'Post Tender',    to: '/tenders/create',      auth: 'auth', roles: ['procurement_officer','department_head'] },
    { name: 'Dashboard',      to: '/dashboard',           auth: 'auth', roles: ['admin','supplier'] },
    { name: 'Manage Users',   to: '/admin/users',         auth: 'auth', roles: ['admin'] }, // <-- new
    { name: 'Notifications',  to: '/notifications',       auth: 'auth' },
    { name: 'Login',          to: '/login',               auth: 'unauth' },
    { name: 'Sign Up',        to: '/signup',              auth: 'unauth' },
  ];

  const visibleItems = navItems.filter(item => {
    if (item.auth === 'both') return true;
    if (item.auth === 'auth' && isAuthenticated) {
      return !item.roles || item.roles.includes(user.role);
    }
    if (item.auth === 'unauth' && !isAuthenticated) return true;
    return false;
  });

  return (
    <header className="bg-primary-dark text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">GovBuy</Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {visibleItems.map(item => (
            <Link key={item.name} to={item.to} className="hover:underline">
              {item.name}
            </Link>
          ))}
          {isAuthenticated && <LogoutButton />}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setMobileOpen(open => !open)}
        >
          <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} size="lg" />
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-blue-800">
          <ul className="flex flex-col space-y-2 px-4 pb-4">
            {visibleItems.map(item => (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className="block py-2 hover:underline"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <LogoutButton />
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;