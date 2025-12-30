// components/Navbar.tsx
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { type UserRole } from '../types';
import { Leaf, LogOut, UserCircle, Bell, LayoutGrid, FileText, TrendingUp, HelpCircle } from './icons';
import ThemeToggle from './ThemeToggle';

// Define nav items outside the component
const farmerNavItems = [
  { label: 'Dashboard', path: '/farmer/dashboard', icon: LayoutGrid },
  { label: 'Contracts', path: '/farmer/contracts', icon: FileText },
  { label: 'Price Prediction', path: '/farmer/price-prediction', icon: TrendingUp },
];

const buyerNavItems = [
  { label: 'Dashboard', path: '/buyer/dashboard', icon: LayoutGrid },
  { label: 'Contracts', path: '/buyer/contracts', icon: FileText },
];

const Navbar: React.FC = () => {
  const { userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const navItems = userRole === 'farmer' ? farmerNavItems : buyerNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClasses = "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200";
  const activeClasses = "bg-green-700 text-white";
  const inactiveClasses = "text-gray-300 hover:bg-green-600 hover:text-white";

  return (
    <div className="w-64 bg-green-800 dark:bg-gray-800 text-white flex flex-col h-screen p-4 shadow-2xl">
      <div className="flex items-center space-x-3 p-4 border-b border-green-700 dark:border-gray-700 mb-6">
        <Leaf className="w-10 h-10 text-golden-400" />
        <span className="text-xl font-bold">ACF System</span>
      </div>
      <nav className="flex-grow">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            <Icon className="w-6 h-6" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        {/* Dark Mode Toggle in Navbar */}
        <div className="flex justify-center mb-4">
          <ThemeToggle />
        </div>
        
        <a href="mailto:support@acfs.com" className={`${navLinkClasses} ${inactiveClasses}`}>
            <HelpCircle className="w-6 h-6" />
            <span>Contact Support</span>
        </a>
        <div className="border-t border-green-700 dark:border-gray-700 my-2"></div>
        <div className="flex items-center justify-between p-2">
            <button className="p-2 rounded-full hover:bg-green-700 relative">
                <Bell className="w-6 h-6"/>
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-green-800"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-green-700">
                <UserCircle className="w-6 h-6"/>
            </button>
            <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-500/80 transition-colors duration-200">
                <LogOut className="w-6 h-6" />
                <span className="font-semibold">Logout</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;



