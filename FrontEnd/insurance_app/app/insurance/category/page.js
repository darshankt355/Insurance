"use client";
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import BackButton from '@/components/BackButton';
import 'react-toastify/dist/ReactToastify.css';

const AddCategoryPage = () => {

  const router = useRouter();
  
    useEffect(() => {
      const userRole = localStorage.getItem('role');
      // If the user role is not 'admin', redirect to the homepage.
      if (userRole !== 'admin' && userRole !== 'employee') {
    router.push('/');
  }
     
    }, [router]);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    title: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim() || !formData.title.trim()) {
    toast.error('Category name and title cannot be empty.');
    return;
  }

  setLoading(true);

  try {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("title", formData.title);
    data.append("icon", formData.icon); // 👈 FILE
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/add`,
      
      data,
      
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Auth: token
        },
        withCredentials: true
        
      }
    );

    if (response.status === 201) {
      toast.success('Category added successfully!');
      setFormData({ name: '', title: '', icon: '' });
    }

  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to add category.');
    console.error('Error adding category:', error);
  }

  setLoading(false);
};
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      <NavBar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BackButton />
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Insurance Category</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-gray-900 placeholder-gray-400 transition"
                placeholder="e.g., Health Insurance"
                required
              />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-gray-900 placeholder-gray-400 transition"
                placeholder="e.g., Comprehensive Health Plans"
                required
              />
            </div>
            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                Icon (URL or Font Awesome Class)
              </label>
              <input
                type="file"
                name="icon"
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    icon: e.target.files[0]   // 👈 FILE object
                  }))
                }
                
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-gray-900 placeholder-gray-400 transition"
                placeholder="e.g., /icons/health.svg or fas fa-heartbeat"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400"
            >
              {loading ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddCategoryPage;