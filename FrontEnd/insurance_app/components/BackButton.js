"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Safely access localStorage only on the client side
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role');
      setUserRole(role);
    }
  }, []);

  const handleBackClick = () => {
    if (pathname.startsWith('/admin/') && pathname !== '/admin') {
      router.push('/admin');
    } else if (pathname.startsWith('/employee/') && pathname !== '/employee') {
      router.push('/employee');
    } else if (userRole === 'admin') {
      router.push('/admin');
    } else if (userRole === 'employee') {
      router.push('/employee');
    } else {
      router.back();
    }
  };

  // Do not render the back button on the main dashboard pages
  if (pathname === '/admin' || pathname === '/employee') {
    return null;
  }

  return (
    <button
      onClick={handleBackClick}
      className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    >
      <FiArrowLeft className="-ml-1 mr-2 h-5 w-5" />
      Back
    </button>
  );
};

export default BackButton;