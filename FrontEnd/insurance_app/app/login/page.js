"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';


const Login = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [userInformation, setUserInformation] = useState({})

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
      {
        identifier: userName,
        password: password
      },
      { withCredentials: true }
    );

    console.log(response.data);


    localStorage.setItem("token", response.data.freshToken);


    const userRole = response.data.role || (response.data.user && response.data.user.role);
    if (userRole) {
      localStorage.setItem("role", userRole);
    }

    setUserInformation(response.data);

    toast.success("Login successful!", {
      position: "top-right",
      autoClose: 2000,
      theme: "dark"
    });

    // Redirect based on role
    setTimeout(() => {
      if (userRole === 'admin') {
        router.push('/admin');
      } else if (userRole === 'employee') {
        router.push('/employee');
      } else {
        router.push('/'); 
      }
    }, 1000);

  } catch (error) {

    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Server error");
    }

  }
};
  console.log(userInformation)

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
       
      />
      <NavBar />
      <div className="min-h-screen flex items-center justify-center bg-blue-50 font-sans p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">
          {/* Left side: Login form */}
          <div className="w-full md:w-1/2 bg-white p-8 sm:p-12 flex flex-col justify-center">
            <div className="flex items-center mb-6">
              <img src="/logo.jpeg" alt="Logo" className="h-10 w-10 mr-3" />
              <span className="text-2xl font-bold text-blue-700" style={{ fontFamily: 'var(--font-geist-sans)' }}>InsuranceApp</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-gray-900">Login to Your Account</h2>
            <form className="mt-6" method='POST' onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="text"
                  id="user"
                  name="user"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg text-gray-900 placeholder-gray-500 transition"
                  placeholder="Username / Email / Phone"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg text-gray-900 placeholder-gray-500 transition"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-transform transform hover:scale-105" >Sign In</button>
              <div className="text-center mt-4">
                <a href="/forgetPassword" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
              </div>
            </form>
          </div>
          {/* Right side: Sign up CTA */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 flex-col items-center justify-center p-12 relative">
            <h2 className="text-3xl font-extrabold text-white mb-4">New Here?</h2>
            <p className="text-white text-lg mb-8 text-center font-medium">Sign up and discover a great amount of new opportunities!</p>
            <a href="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105">Sign Up</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;