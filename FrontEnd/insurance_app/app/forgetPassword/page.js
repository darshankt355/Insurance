"use client";
import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const ForgetPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({

    email: "",
    password: "",
    confirmPassword: ""
  });
  const [otp, setotp] = useState(false)
  const [verifyOtp, setVerifyOtp] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: ""
  });
  const [userInformation, setUserInformation] = useState({})
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,26}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "password") {
      if (value !== "" && !passwordRegex.test(value)) {
        setErrors(prev => ({ ...prev, password: "Weak password" }));
      } else {
        setErrors(prev => ({ ...prev, password: "" }));
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: "Password is not matching" }));
      }
      else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
    if (name === "email") {
      if (value !== "" && !emailPattern.test(value)) {
        setErrors(prev => ({ ...prev, email: "Invalid email" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
      setotp(false)
    }

  }

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      toast.error("password is weak.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/forgetPassword`,
        {
          email: formData.email,
          password: formData.password
        },
        { withCredentials: true }
      );
      setUserInformation(response.data);
    
      toast.success("Password updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark"
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server error");
      }

    }
  };
  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    if (otpCode === "") {
      toast.error("please enter the OTP.", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark"
      })
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/otp/verify_otp`, {
        email: formData.email,
        otp: otpCode
      },
        { withCredentials: true }
      );
      console.log(response.data);
      toast.success("OTP verified successfully!", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark"
      });
      setVerifyOtp(true)
      setOtpCode("")

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark"
      });
    }


  }

  const handleSendOtp = async () => {

    if (formData.email === "") {

      toast.error("Please enter your email.", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark"
      });
      return;
    }
    else {
      setotp(true)
    }

    try {
      console.log(formData.email)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/otp/send_otp`,
        {
          email: formData.email,
          otpType: "forget"
        },
        { withCredentials: true }
      );
      console.log(response.data);
      toast.success("OTP sent to your email.", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark"
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark"
      });
      setotp(false)
    }
  }
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
          {/* Left side: Forgot Password form */}
          <div className="w-full md:w-1/2 bg-white p-8 sm:p-12 flex flex-col justify-center">
            <div className="flex items-center mb-6">
              <img src="/logo.jpeg" alt="Logo" className="h-10 w-10 mr-3" />
              <span className="text-2xl font-bold text-blue-700" style={{ fontFamily: 'var(--font-geist-sans)' }}>InsuranceApp</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-gray-900">Forgot Your Password?</h2>
            <p className="text-gray-600 mb-6">Enter your email address or username then you can update your password.</p>
            <form className="mt-6" method='POST' onSubmit={handleForgotPassword}>
              <div className="mb-4">

                {!verifyOtp &&

                  <div className="mb-4">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 text-base sm:text-lg text-gray-900 placeholder-gray-500 transition 
                ${formData.email === "" || errors.email
                          ? "focus:border-red-500 focus:ring-red-500"
                          : "focus:border-green-500 focus:ring-green-500"
                        }`}
                      placeholder="Email"
                    />
                  </div>
                }
              </div>
              {verifyOtp &&
                  
                <>

              <div className="mb-4">
                <input
                  type="password"
                  id="newPassword"
                  name="password"
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 text-base sm:text-lg text-gray-900 placeholder-gray-500 transition 
                  ${formData.password === "" || errors.password
                      ? "focus:border-red-500 focus:ring-red-500"
                      : "focus:border-green-500 focus:ring-green-500"
                    }`}
                  placeholder="Enter your new password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 text-base sm:text-lg text-gray-900 placeholder-gray-500 transition 
                 ${formData.confirmPassword === "" || errors.confirmPassword
                      ? "focus:border-red-500 focus:ring-red-500"
                      : "focus:border-green-500 focus:ring-green-500"
                    }`}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Confirm your new password"
                />
              </div>
                </>
              }
              <div className="flex justify-between items-center gap-4">
                {!otp && (
                  <button onClick={handleSendOtp} className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-transform transform hover:scale-105"
                  >Send OTP</button>
                )}
                {otp && !verifyOtp && (
                  <>

                    <input
                      type="text"
                      name="otp"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 text-base sm:text-lg text-gray-900 placeholder-gray-500 transition"
                      placeholder="Enter OTP"

                    />

                    <button
                      type="button"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-transform transform hover:scale-105 mt-3"
                      onClick={handleSubmitOtp}
                    >
                      Verify OTP
                    </button>
                    <button
                      type="button"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-transform transform hover:scale-105 mt-3"
                      onClick={handleSendOtp}
                    >
                      resend OTP
                    </button>
                  </>
                )}
                {verifyOtp && <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-transform transform hover:scale-105 mt-3"

                >
                  submit
                </button>}
              </div>
            </form>
          </div>
          {/* Right side: Login CTA */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 flex-col items-center justify-center p-12 relative">
            <h2 className="text-3xl font-extrabold text-white mb-4">Remembered your password?</h2>
            <p className="text-white text-lg mb-8 text-center font-medium">Login to access your account and manage your policies.</p>
            <a href="/login" className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105">Login</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};


export default ForgetPassword;