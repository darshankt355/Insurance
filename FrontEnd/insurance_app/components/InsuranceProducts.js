"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const InsuranceProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // This code runs only on the client, where localStorage is available.
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/getCategories`);
        // Assuming the API returns an array of categories with 'title' and 'icon' fields
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching insurance categories:", err);
        setError('Failed to load insurance categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


const handleEdit = (e, productId) => {
    e.stopPropagation();

    console.log("Editing ID:", productId);
    console.log("User Role:", userRole);

    // 🔥 Safety check
    if (!productId) {
      console.error("❌ productId missing");
      return;
    }

    if (!userRole) {
      console.error("❌ userRole not loaded yet");
      return;
    }

    // ✅ Routing based on role
    if (userRole === "admin"|| userRole === "employee") {
      router.push(`/admin/manage_plans/edit/${productId}`);
    
    } else {
      // 🔥 fallback (optional)
      console.warn("⚠️ Unknown role, redirecting to home");
      router.push("/");
    }
  };
  const handleDelete = async (e, productId, productName) => {
    e.stopPropagation(); 
    console.log(productId);
    // Prevent the card's onClick from firing
    if (window.confirm(`Are you sure you want to delete the category "${productName}"?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/delete/${productId}`, {
          
          headers: { Auth: token },withCredentials: true
        });
        console.log(productId);
        toast.success(`Category "${productName}" deleted successfully.`);
        // Refresh the product list by filtering out the deleted item
        setProducts(products.filter(p => p._id !== productId));
      } catch (err) {
        console.error("Error deleting category:", err);
        toast.error(err.response?.data?.message || 'Failed to delete category.');
      }
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-white font-sans px-4 sm:px-6 md:px-8 text-center">
        <p className="text-lg text-gray-600">Loading Insurance Products...</p>
        {/* Optional: Add a spinner or skeleton loader here */}
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white font-sans px-4 sm:px-6 md:px-8 text-center">
        <p className="text-lg text-red-600">{error}</p>
      </section>
    );
  }

  // If there are no products after loading, show a message.
  if (products.length === 0) {
    return (
      <section className="py-12 bg-white font-sans px-4 sm:px-6 md:px-8 text-center">
        <p className="text-lg text-gray-600">We will update soon.</p>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white font-sans px-4 sm:px-6 md:px-8">
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            Our Company Products
          </span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          Find the perfect coverage from our wide range of categories.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => router.push(`/insurance/${product._id}`)}
            className="relative group cursor-pointer flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out"
          >
            {['admin', 'employee'].includes(userRole) && (
              <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => handleEdit(e, product._id)}
                  className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                  aria-label="Edit Category"
                >
                  <FiEdit className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(e, product._id, product.name)}
                  className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                  aria-label="Delete Category"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            )}
            <img
              
  src={`http://localhost:8282/${product.icon.replace(/\\/g, "/")}`}
  alt={product.name}
              className="w-16 h-16 object-contain mb-4 transition-transform duration-300 group-hover:scale-110"
            />
            <h3 className="text-md font-semibold text-gray-800 mb-1">{product.name}</h3>
            <p className="text-xs text-gray-500 h-8 overflow-hidden">{product.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InsuranceProducts;