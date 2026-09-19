"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { useRouter } from "next/navigation";

const AddInsurance = () => {
  const router = useRouter();
  useEffect(() => {
        const userRole = localStorage.getItem('role');
        // If the user role is not 'admin', redirect to the homepage.
        if (userRole !== 'admin' && userRole !== 'employee') {
      router.push('/');
    }
      }, [router]);
  const [formData, setFormData] = useState({
    companyName: "",
    planName: "",
    category: "",
    basePremium: "",
    premiumType: "yearly",
    coverageAmount: "",
    benefits: "",
    exclusions: "",
    redirectLink: ""
  });

  const [categories, setCategories] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [title,setTitle]=useState("")
  // 🔄 Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8282/categories/getCategories");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 🧠 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔽 Handle category select
  const handleCategoryChange = (e) => {
    const value = e.target.value;

    if (value === "new") {
      setShowInput(true);
    } else {
      // Hide the new category input when selecting an existing category
      setShowInput(false);
      setFormData((prev) => ({
        ...prev,
        category: value
      }));
    }
  };


  const handleAddCategory = async () => {
    if (!newCategory || !iconFile || !title) {
      toast.error("New category name, icon, and title are required");
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get token here, only on the client
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("name", newCategory);
      formData.append("icon", iconFile);
      formData.append("title", title);

      const res = await axios.post(
        "http://localhost:8282/categories/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Auth: token,
          },
          withCredentials: true,
        }
      );

    console.log(res.data);
    toast.success("Category added!");

  } catch (error) {
    toast.error(error.response?.data?.message || "Error");
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/insurance/addInsurance`, {
        ...formData,
        benefits: formData.benefits
          ? formData.benefits.split(",").map((b) => b.trim())
          : [],
        exclusions: formData.exclusions
          ? formData.exclusions.split(",").map((e) => e.trim())
          : []
      });

      toast.success("Insurance added successfully!");

      // Reset form
      setFormData({
        companyName: "",
        planName: "",
        category: "",
        basePremium: "",
        premiumType: "yearly",
        coverageAmount: "",
        benefits: "",
        exclusions: "",
        redirectLink: ""
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    
    <div className="min-h-screen bg-slate-100 font-sans">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <NavBar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <BackButton />
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Add New Insurance Policy</h2>
            <p className="text-center text-gray-500 mb-8">Fill in the details below to add a new insurance plan.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="e.g., LifeGuard Inc."
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 text-gray-900 placeholder-gray-400 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                    required
                  />
                </div>

                {/* Plan Name */}
                <div>
                  <label htmlFor="planName" className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    id="planName"
                    name="planName"
                    placeholder="e.g., Comprehensive Health Shield"
                    value={formData.planName}
                    onChange={handleChange}
                    className="w-full border text-gray-900 placeholder-gray-400 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full border text-gray-900 placeholder-gray-400 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                    required
                  >
                    <option value="">Select a Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                    <option value="new">+ Add New Category</option>
                  </select>
                </div>

                {/* Add category input */}
                {showInput && (
                  <div className="md:col-span-2">
                    <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 mb-1">New Category Name</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        id="newCategory"
                        placeholder="e.g., Travel Insurance"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="border text-gray-900 placeholder-gray-400 border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIconFile(e.target.files[0])}
                        className="border text-gray-900 placeholder-gray-400 border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                      />
                       <input
                        type="text"
                        id="title"
                        placeholder="e.g., Travel Insurance"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border text-gray-900 placeholder-gray-400 border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Base Premium */}
                <div>
                  <label htmlFor="basePremium" className="block text-sm font-medium text-gray-700 mb-1">Base Premium ($)</label>
                  <input
                    type="number"
                    id="basePremium"
                    name="basePremium"
                    placeholder="e.g., 500"
                    value={formData.basePremium}
                    onChange={handleChange}
                    className="w-full border text-gray-900 placeholder-gray-400 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                    required
                  />
                </div>

                {/* Premium Type */}
                <div>
                  <label htmlFor="premiumType" className="block text-sm font-medium text-gray-700 mb-1">Premium Type</label>
                  <select
                    id="premiumType"
                    name="premiumType"
                    value={formData.premiumType}
                    onChange={handleChange}
                    className="w-full border text-gray-900 placeholder-gray-400 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                  >
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* Coverage Amount */}
                <div className="md:col-span-2">
                  <label htmlFor="coverageAmount" className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount ($)</label>
                  <input
                    type="number"
                    id="coverageAmount"
                    name="coverageAmount"
                    placeholder="e.g., 100000"
                    value={formData.coverageAmount}
                    onChange={handleChange}
                    className="w-full border text-gray-900 placeholder-gray-400 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                  />
                </div>

                {/* Benefits */}
                <div className="md:col-span-2">
                  <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                  <input
                    type="text"
                    id="benefits"
                    name="benefits"
                    placeholder="e.g., Hospitalization, Annual Check-ups, Dental"
                    value={formData.benefits}
                    onChange={handleChange}
                    className="w-full border text-gray-900 placeholder-gray-400 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter benefits separated by a comma.</p>
                </div>

                {/* Exclusions */}
                <div className="md:col-span-2">
                  <label htmlFor="exclusions" className="block text-sm font-medium text-gray-700 mb-1">Exclusions</label>
                  <input
                    type="text"
                    id="exclusions"
                    name="exclusions"
                    placeholder="e.g., Pre-existing conditions, Cosmetic surgery"
                    value={formData.exclusions}
                    onChange={handleChange}
                    className="w-full border text-gray-900 placeholder-gray-400 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter exclusions separated by a comma.</p>
                </div>

                {/* Redirect Link */}
                <div className="md:col-span-2">
                  <label htmlFor="redirectLink" className="block text-sm font-medium text-gray-700 mb-1">Redirect Link</label>
                  <input
                    type="text"
                    id="redirectLink"
                    name="redirectLink"
                    placeholder="e.g., https://company.com/policy-details"
                    value={formData.redirectLink}
                    onChange={handleChange}
                    className="w-full border text-gray-900 placeholder-gray-400 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Add Insurance
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AddInsurance;