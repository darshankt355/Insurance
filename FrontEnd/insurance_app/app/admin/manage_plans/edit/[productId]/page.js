"use client";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { use, useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCategory = () => {
  
  const { productId } = useParams();
  const router = useRouter();
    useEffect(() => {
        const userRole = localStorage.getItem('role');
        // If the user role is not 'admin', redirect to the homepage.
        if (userRole !== 'admin' && userRole !== 'employee') {
          router.push('/');
        }
      }, [router]);


  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
  });

  // ✅ FETCH CATEGORY DATA
  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        console.log("PARAM:", productId);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/getCategory/${productId}`
        );

        console.log("DATA:", res.data);

        setFormData({
          name: "",
          title:  "",
        });
      } catch (err) {
        console.error("ERROR:", err);
        toast.error("Failed to load category");
      } finally {
        setLoading(false); // 🔥 ALWAYS STOP LOADING
      }
    };

    fetchData();
  }, [productId]);

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ UPDATE CATEGORY
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/update/${productId}`,
        {
          name: formData.name,
          title: formData.title,
        }
      );

      toast.success("Category updated successfully ✅");

      setTimeout(() => {
        router.push("/"); // change if needed
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
      setIsSaving(false);
    }
  };

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavBar />
      <ToastContainer />

      <main className="flex-grow container mx-auto px-4 py-10">
        <BackButton />

        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Edit Category</h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            {/* NAME */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Category Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2  text-base sm:text-lg text-gray-900 placeholder-gray-500 transition"
              required
            />

            {/* TITLE */}
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Category Title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2  text-base sm:text-lg text-gray-900 placeholder-gray-500 transition"
              required
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold"
            >
              {isSaving ? "Updating..." : "Update Category"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditCategory;