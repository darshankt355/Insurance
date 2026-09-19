"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import axios from 'axios';
import BackButton from '@/components/BackButton';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
    useEffect(() => {
        const userRole = localStorage.getItem('role');
        // If the user role is not 'admin', redirect to the homepage.
        if (userRole !== 'admin') {
          router.push('/');
        }
      }, [router]);

  
  useEffect(() => {
    if (userId) {
      const fetchUserDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`);
          setUser(response.data);
        } catch (err) {
          setError('Failed to fetch user details. Please try again later.');
          console.error(err);
        }
        setLoading(false);
      };

      fetchUserDetails();
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavBar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">User Details</h1>
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading user details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-gray-700">Name</h2>
                <p className="text-gray-900">{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Email</h2>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Phone</h2>
                <p className="text-gray-900">{user.phone}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Role</h2>
                <p className="text-gray-900">{user.role}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Gender</h2>
                <p className="text-gray-900">{user.gender}</p>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700">Date of Birth</h2>
                <p className="text-gray-900">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No user details found.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDetailsPage;