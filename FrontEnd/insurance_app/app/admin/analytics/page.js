"use client";
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import axios from 'axios';
import { FiUsers, FiShield, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import BackButton from '@/components/BackButton';
import { useRouter } from 'next/navigation';

// A single stat card component for reusability
const StatCard = ({ title, value, change, icon, color, loading }) => (
  
  <div className={`bg-white rounded-xl shadow-lg p-6 border-t-4 border-${color}-500`}>
    {loading ? (
      <div className="h-full flex items-center justify-center">Loading...</div>
    ) : (
      <>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
          </div>
          <div className={`p-3 bg-${color}-100 rounded-full`}>{icon}</div>
        </div>
        {change && (
          <p className="text-sm text-gray-500 mt-4">
            <span className="text-green-600 font-semibold">{change}</span> vs. last month
          </p>
        )}
      </>
    )}
  </div>
);

const AnalyticsPage = () => {
  const router = useRouter();
    
      useEffect(() => {
        const userRole = localStorage.getItem('role');
        // If the user role is not 'admin', redirect to the homepage.
        if (userRole !== 'admin') {
      router.push('/');
    }
       
      }, [router]);
  const [stats, setStats] = useState({
    totalConsumers: { value: 0, loading: true },
    totalEmployees: { value: 0, loading: true },
    activePolicies: { value: 0, loading: true },
  });

  useEffect(() => {
    const fetchData = async (url, key) => {
      try {
        const response = await axios.get(url);
        setStats(prev => ({ ...prev, [key]: { value: response.data.value, loading: false } }));
      } catch (error) {
        console.error(`Failed to fetch ${key}:`, error);
        setStats(prev => ({ ...prev, [key]: { ...prev[key], loading: false } }));
      }
    };

    // Fetching stat data
    fetchData(`${process.env.NEXT_PUBLIC_API_URL}/analytics/total_consumers`, 'totalConsumers',);
    fetchData(`${process.env.NEXT_PUBLIC_API_URL}/analytics/total_employees`, 'totalEmployees');
    fetchData(`${process.env.NEXT_PUBLIC_API_URL}/analytics/total_insurances`, 'activePolicies');
  }, []);

  const statCards = [
    {
      title: 'Total Consumers',
      key: 'totalConsumers',
      icon: <FiUsers className="h-8 w-8 text-blue-500" />,
      color: 'blue'
    },
    {
      title: 'Total Employees',
      key: 'totalEmployees',
      icon: <FiUsers className="h-8 w-8 text-teal-500" />,
      color: 'teal'
    },
    {
      title: 'Active Policies',
      key: 'activePolicies',
      icon: <FiShield className="h-8 w-8 text-green-500" />,
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <NavBar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BackButton />
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">Platform Analytics</h1>
          <p className="mt-2 text-lg text-gray-500">A real-time overview of key metrics and performance indicators.</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {statCards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={stats[card.key].value}
              loading={stats[card.key].loading}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnalyticsPage;