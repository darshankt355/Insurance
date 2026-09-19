"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiShield, FiBriefcase, FiHeart, FiCalendar, FiUsers, FiPhone } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
    const router = useRouter();
    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (userRole !== 'admin' && userRole !== 'employee' && userRole !== 'consumer') {
          router.push('/');
        }
      }, [router]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to get role-specific icon and title
  const getRoleDetails = (role) => {
      switch (role) {
          case 'admin':
              return { icon: <FiShield className="text-white text-5xl" />, title: 'Administrator' };
          case 'employee':
              return { icon: <FiBriefcase className="text-white text-5xl" />, title: 'Employee' };
          default:
              return { icon: <FiHeart className="text-white text-5xl" />, title: 'Consumer' };
      }
  };

  // Function to format date string
  const formatDate = (dateString) => {
      if (!dateString) return 'Not specified';
      try {
          return new Date(dateString).toISOString().split('T')[0];
      } catch (error) {
          return 'Invalid Date';
      }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

        if (!token) {
          toast.error("Please login first");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
          {
            headers: {
              Auth: token, // ✅ matches your backend
            },
            withCredentials: true,
          }
        );

        console.log("USER PROFILE:", response.data);

        // ✅ No role restriction
        setUserData(response.data);

      } catch (error) {
        console.error("ERROR:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const roleDetails = userData ? getRoleDetails(userData.role) : getRoleDetails('');

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
        <NavBar />
        <ToastContainer position="top-right" autoClose={5000} theme="dark" />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-lg mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-800">My Profile</h1>
                    <p className="mt-2 text-gray-500">Your personal information and account details.</p>
                </header>

                {userData ? (
                    <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
                        <div className="flex flex-col items-center">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
                                {roleDetails.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{userData.firstName} {userData.lastName}</h2>
                            <p className="text-gray-500 mt-1">{roleDetails.title}</p>
                        </div>

                        <div className="mt-8 space-y-4 text-left">
                            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                                <FiUser className="h-5 w-5 text-gray-400 mr-4" />
                                <span className="text-gray-700">{userData.username}</span>
                            </div>
                            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                                <FiMail className="h-5 w-5 text-gray-400 mr-4" />
                                <span className="text-gray-700">{userData.email}</span>
                            </div>
                            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                                <FiPhone className="h-5 w-5 text-gray-400 mr-4" />
                                <span className="text-gray-700">{userData.phone || 'Not specified'}</span>
                            </div>
                            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                                <FiShield className="h-5 w-5 text-gray-400 mr-4" />
                                <span className="text-gray-700 capitalize">{userData.role}</span>
                            </div>
                            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                                <FiCalendar className="h-5 w-5 text-gray-400 mr-4" />
                                <span className="text-gray-700">{formatDate(userData.dateOfBirth)}</span>
                            </div>
                            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                                <FiUsers className="h-5 w-5 text-gray-400 mr-4" />
                                <span className="text-gray-700 capitalize">{userData.gender || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-xl font-semibold text-red-600">Could not load your profile.</h2>
                        <p className="text-gray-500 mt-2">Please ensure you are logged in correctly.</p>
                    </div>
                )}
            </div>
        </main>
        <Footer />
    </div>
  );
};

export default ProfilePage;