"use client";
import React, { useState, useEffect } from "react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import BackButton from "../../../components/BackButton";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Signup = () => {
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    // If the user role is not 'admin', redirect to the homepage.
    if (userRole !== 'admin') {
      router.push('/');
    }
  }, [router]);
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{9,16}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneNumberRegex = /^[6-9][0-9]{9}$/;
  const [otp, setotp] = useState(false)
  const [verifyOtp, setVerifyOtp] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    role: "",
    password: "",
    confirmPassword: ""
  });
  const [userInformation, setUserInformation] = useState({})
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    phone: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "email") {
      if (value !== "" && !emailPattern.test(value)) {
        setErrors(prev => ({ ...prev, email: "Invalid email" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
      setotp(false)
    }

    if (name === "password") {
      if (value !== "" && !passwordRegex.test(value)) {
        setErrors(prev => ({ ...prev, password: "Weak password" }));
      } else {
        setErrors(prev => ({ ...prev, password: "" }));
      }
    }
    if (name === "phone") {
      if (value !== "" && !phoneNumberRegex.test(value)) {
        setErrors(prev => ({ ...prev, phone: "Invalid phone number" }));
      } else {
        setErrors(prev => ({ ...prev, phone: "" }));
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/otp/send_otp`,
        {
          email: formData.email,
          otpType: "signup"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      if ( passwordRegex.test(formData.password)) {
        if (formData.phone && !phoneNumberRegex.test(formData.phone)) {
          toast.error("Invalid phone number format.", {
            position: "top-right",
            autoClose: 5000,
            theme: "dark"
          });
          return;
        }
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
            {
              firstName: formData.firstName,
              lastName: formData.lastName,
              gender: formData.gender,
              username: formData.username,
              email: formData.email,
              phone: formData.phone,
              dateOfBirth: formData.dateOfBirth,
              role: formData.role,
              password: formData.password
            },
            { withCredentials: true }
          );

          console.log(response.data);

          setUserInformation(response.data);

          toast.success("Register successful!", {
            position: "top-right",
            autoClose: 5000,
            theme: "dark"
          });
          router.push("/admin");
          setFormData({
            firstName: "",
            lastName: "",
            gender: "",
            username: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            role: "",
            password: "",
            confirmPassword: ""
          });


        } catch (error) {

          if (error.response) {
            toast.error(error.response.data.message, {
              position: "top-right",
              autoClose: 5000,
              theme: "dark"
            });
          } else {
            toast.error("Server error", {
              position: "top-right",
              autoClose: 5000,
              theme: "dark"
            });
          }
        }
      }
      else {
        toast.error("Invalid password format", {
          position: "top-right",
          autoClose: 5000,
          theme: "dark"
        });
        return;
      }
    } else {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark"
      })
    }



    console.log("Form Data:", formData);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      <NavBar />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <BackButton />
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-8">
              <img src="/logo.jpeg" alt="Logo" className="h-12 w-12 mr-4" />
              <span className="text-3xl font-bold text-blue-700" style={{ fontFamily: 'var(--font-geist-sans)' }}>InsuranceApp</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Create a New User Account</h2>
            <p className="text-center text-gray-500 mb-8">Fill in the details below to add a new user.</p>

            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg text-gray-900 placeholder-gray-400 transition"
                    placeholder="e.g., Darshan"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg text-gray-900 placeholder-gray-400 transition"
                    placeholder="e.g., Gowda"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg text-gray-900 placeholder-gray-400 transition"
                  placeholder="e.g., darshan1"
                  required
                />
              </div>
              {!verifyOtp &&
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 text-base sm:text-lg text-gray-900 placeholder-gray-400 transition ${errors.email ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                  placeholder="e.g., example@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              }

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 text-base sm:text-lg text-gray-900 placeholder-gray-400 transition ${errors.phone ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                  placeholder="e.g., 9876543210"
                  required
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg text-gray-900 placeholder-gray-400 transition"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="consumer">Consumer</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>
              </div>

              <fieldset className="mb-4">
                <legend className="block text-sm font-medium text-gray-700 mb-2">Gender</legend>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      id="male"
                      onChange={handleChange}
                      required
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="male" className="text-sm text-gray-700">Male</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      id="female"
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="female" className="text-sm text-gray-700">Female</label>
                  </div>
                </div>
              </fieldset>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 text-base sm:text-lg text-gray-900 placeholder-gray-400 transition ${errors.password ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                    placeholder="Create a password"
                    required
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 text-base sm:text-lg text-gray-900 placeholder-gray-400 transition ${errors.confirmPassword ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                    placeholder="Confirm your password"
                    required
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {!otp && (
                <button onClick={handleSendOtp} className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-transform transform hover:scale-105"
                >Send OTP</button>
              )}
              {otp && !verifyOtp && (
                <>
                  <div className="mt-4 flex justify-between gap-4">
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
                  </div>
                </>
              )}
              {verifyOtp && <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-transform transform hover:scale-105 mt-3"

              >
                submit
              </button>}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;