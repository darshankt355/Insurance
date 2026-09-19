"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { FiUserPlus, FiUsers, FiShield, FiGrid, FiBarChart2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    // If the user role is not 'admin', redirect to the homepage.
    if (userRole !== 'admin') {
      router.push('/');
    }
  }, [router]);
  const features = [
    {
      title: 'Add New User',
      description: 'Create accounts for new consumers or employees.',
      link: '/admin/addUsers',
      icon: <FiUserPlus className="h-8 w-8 text-blue-500" />,
      color: 'blue'
    },
    {
      title: 'List All Users',
      description: 'View and manage all user accounts in the system.',
      link: '/admin/listUser',
      icon: <FiUsers className="h-8 w-8 text-green-500" />,
      color: 'green'
    },
    {
      title: 'Add Insurance Policy',
      description: 'Add new insurance policies to the catalog.',
      link: '/insurance',
      icon: <FiShield className="h-8 w-8 text-red-500" />,
      color: 'red'
    },
    {
      title: 'Add Insurance Category',
      description: 'Create new categories for organizing insurance policies.',
      link: '/insurance/category',
      icon: <FiGrid className="h-8 w-8 text-purple-500" />,
      color: 'purple'
    },
    {
      title: 'View Analytics',
      description: 'Access reports and analytics on user and policy data.',
      link: '/admin/analytics',
      icon: <FiBarChart2 className="h-8 w-8 text-yellow-500" />,
      color: 'yellow'
    },
    {
      title: 'Manage Products',
      description: 'Edit and delete product categories directly on the main products page.',
      link: '/', // Links to the homepage where InsuranceProducts is shown
      icon: <FiGrid className="h-8 w-8 text-teal-500" />,
      color: 'teal'
    },
    {
      title: 'contact Message',
      description: 'View and manage all contact messages received from users.',
      link: '/contact/contactMessage', // Links to the homepage where InsuranceProducts is shown
      icon: <FiGrid className="h-8 w-8 text-teal-500" />,
      color: 'teal'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <NavBar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-500">Your central hub for managing the InsuranceApp platform.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link href={feature.link} key={feature.title}>
              <div className={`group bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start h-full transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl border-l-4 border-${feature.color}-500`}>
                <div className="mb-4 p-3 bg-gray-100 rounded-full">
                  {feature.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h2>
                <p className="text-gray-600 flex-grow">{feature.description}</p>
                <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
                  Go to feature &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;