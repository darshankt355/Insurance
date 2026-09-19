"use client"

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiLogOut, FiSettings } from 'react-icons/fi';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
    setDropdownOpen(false);
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md font-sans">
      <div className="flex items-center">
        <img src="/logo.jpeg" alt="Logo" className="h-10 w-10 mr-3" />
        <span className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'var(--font-geist-sans)' }}>InsuranceApp</span>
      </div>
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/" className="text-gray-600 hover:text-blue-600 transition">Home</Link>
        <Link href="/about" className="text-gray-600 hover:text-blue-600 transition">About</Link>
        <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition">Contact Us</Link>
      </div>
      <div className="hidden md:flex items-center space-x-4 relative">
        {!isLoggedIn ? (
          <>
            <Link href="/login" className="text-gray-600 hover:text-blue-600 transition">Login</Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Signup</Link>
          </>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none transition"
            >
              <FiUser className="h-6 w-6" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                {userRole === 'admin' && (
                  <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <FiSettings className="mr-2" /> Admin Dashboard
                  </Link>
                )}
                {userRole === 'employee' && (
                  <Link href="/employee" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <FiSettings className="mr-2" /> Employee Dashboard
                  </Link>
                )}
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <FiUser className="mr-2" /> Account Settings
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-blue-600 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md p-4 z-10">
          <ul className="flex flex-col space-y-4">
            <li><Link href="/" className="text-gray-600 hover:text-blue-600 transition">Home</Link></li>
            <li><Link href="/about" className="text-gray-600 hover:text-blue-600 transition">About</Link></li>
            <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 transition">Contact Us</Link></li>
            {!isLoggedIn ? (
              <>
                <li><Link href="/login" className="text-gray-600 hover:text-blue-600 transition">Login</Link></li>
                <li><Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-block">Signup</Link></li>
              </>
            ) : (
              <>
                {userRole === 'admin' && (
                  <li><Link href="/admin" className="text-gray-600 hover:text-blue-600 transition flex items-center"><FiSettings className="mr-2" /> Admin Dashboard</Link></li>
                )}
                {userRole === 'employee' && (
                  <li><Link href="/employee" className="text-gray-600 hover:text-blue-600 transition flex items-center"><FiSettings className="mr-2" /> Employee Dashboard</Link></li>
                )}
                <li><Link href="/profile" className="text-gray-600 hover:text-blue-600 transition flex items-center"><FiUser className="mr-2" /> Account Settings</Link></li>
                <li>
                  <button onClick={handleLogout} className="text-red-600 hover:text-red-800 transition flex items-center w-full text-left">
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;