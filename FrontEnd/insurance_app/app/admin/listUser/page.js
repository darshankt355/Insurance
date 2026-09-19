"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import axios from 'axios';
import BackButton from '@/components/BackButton';

const Page = () => {
  const [selectedRole, setSelectedRole] = useState("All");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize router
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    // If the user role is not 'admin', redirect to the homepage.
    if (userRole !== 'admin') {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/usersList`, { role: selectedRole });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [selectedRole]);
  
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Function to handle row click
  const handleUserClick = (userId) => {
    router.push(`/admin/listUser/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavBar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
          
          <div className="mb-6">
            <fieldset className="flex flex-wrap items-center gap-4 sm:gap-6">
              <legend className="text-lg font-medium text-gray-700 mr-4">Filter by Role:</legend>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all"
                  name="role"
                  value="All"
                  checked={selectedRole === "All"}
                  onChange={handleRoleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="all" className="ml-2 block text-sm font-medium text-gray-700">All</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="consumer"
                  name="role"
                  value="consumer"
                  checked={selectedRole === "consumer"}
                  onChange={handleRoleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="consumer" className="ml-2 block text-sm font-medium text-gray-700">Consumer</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="employee"
                  name="role"
                  value="employee"
                  checked={selectedRole === "employee"}
                  onChange={handleRoleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="employee" className="ml-2 block text-sm font-medium text-gray-700">Employee</label>
              </div>
            </fieldset>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} onClick={() => handleUserClick(user._id)} className="hover:bg-gray-100 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'employee' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Page;