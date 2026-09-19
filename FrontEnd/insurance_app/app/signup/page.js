"use client";
import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
const Signup = () => {
  const router = useRouter();
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,16}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneNumberRegex = /^[6-9][0-9]{9}$/;
  const [otp, setotp] = useState(false)
  const [verifyOtp, setVerifyOtp] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
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
      if (formData.password.length > 8 && passwordRegex.test(formData.password)) {
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
          setFormData({
            firstName: "",
            lastName: "",
            gender: "",
            username: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            password: "",
            confirmPassword: ""
          });
          setTimeout(() => {
            router.push("/login");
          }, 2000);

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
      <BackButton />
      <div className="min-h-screen flex items-center justify-center bg-blue-50 font-sans p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">
          {/* Left side: Signup form */}
          <div className="w-full md:w-1/2 bg-white p-8 sm:p-12 flex flex-col justify-center">
            <div className="flex items-center mb-6">
              <img src="/logo.jpeg" alt="Logo" className="h-10 w-10 mr-3" />
              <span className="text-2xl font-bold text-blue-700" style={{ fontFamily: 'var(--font-geist-sans)' }}>InsuranceApp</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-gray-900">Create Your Account</h2>
            <form className="mt-6" onSubmit={handleSubmit}>
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

              {verifyOtp &&
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2  text-base sm:text-lg text-gray-900 placeholder-gray-500 transition"
                      placeholder="First Name"

                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2  text-base sm:text-lg text-gray-900 placeholder-gray-500 transition"
                      placeholder="Last Name"

                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        id="male"
                        onChange={handleChange}

                      />
                      <label htmlFor="male" className="text-sm text-black">Male</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        id="female"
                        onChange={handleChange}
                      />
                      <label htmlFor="female" className="text-sm text-black">Female</label>
                    </div>

                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2  text-base sm:text-lg text-gray-900 placeholder-gray-500 transition"
                      placeholder="Username"

                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 text-base sm:text-lg text-gray-900 placeholder-gray-500 transition 
                ${formData.phone === "" || errors.phone
                          ? "focus:border-red-500 focus:ring-red-500"
                          : "focus:border-green-500 focus:ring-green-500"
                        }`}
                      placeholder="Phone"

                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <label htmlFor="dateInput" className="text-sm text-black ">Date of Birth:

                      <input type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 text-base sm:text-lg text-gray-900 placeholder-gray-500 transition `} />
                    </label>
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 text-base sm:text-lg text-gray-900 placeholder-gray-500 transition 
                ${formData.password === "" || errors.password
                          ? "focus:border-red-500 focus:ring-red-500"
                          : "focus:border-green-500 focus:ring-green-500"
                        }`}
                      placeholder="Password "

                    />
                    <p className="text-sm text-red-500 mt-1">Password must contain at least one digit, one special character, and be at least 8 characters long.</p>
                  </div>
                  <div className="mb-6">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 text-base sm:text-lg text-gray-900 placeholder-gray-500 transition 
                  ${formData.confirmPassword === "" || errors.confirmPassword
                          ? "focus:border-red-500 focus:ring-red-500"
                          : "focus:border-green-500 focus:ring-green-500"
                        }`}
                      placeholder="Confirm Password"

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
            <h2 className="text-3xl font-extrabold text-white mb-4">Already have an account?</h2>
            <p className="text-white text-lg mb-8 text-center font-medium">Login to access your insurance dashboard and manage your policies!</p>
            <a href="/login" className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105">Login</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;