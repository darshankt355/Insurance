"use client";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditInsurancePlanPage = () => {
  const { planId } = useParams();
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
    companyName: "",
    planName: "",
    category: "",
    basePremium: "",
    premiumType: "yearly",
    coverageAmount: "",
    benefits: "",
    exclusions: "",
    redirectLink: "",
  });

  // Fetch existing plan data
  useEffect(() => {
    if (!planId) return;

    const fetchPlanData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to edit a plan.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/insurance/getInsurance/${planId}`,
          {
            headers: { Auth: token },
            withCredentials: true,
          }
        );

        const plan = res.data;
        setFormData({
          companyName: plan.companyName || "",
          planName: plan.planName || "",
          category: plan.category?._id || "", // Assuming category is an object with _id
          basePremium: plan.basePremium || "",
          premiumType: plan.premiumType || "yearly",
          coverageAmount: plan.coverageAmount || "",
          benefits: Array.isArray(plan.benefits) ? plan.benefits.join(", ") : "",
          exclusions: Array.isArray(plan.exclusions) ? plan.exclusions.join(", ") : "",
          redirectLink: plan.redirectLink || "",
        });
      } catch (err) {
        console.error("Error fetching plan data:", err);
        toast.error("Failed to load insurance plan data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [planId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update the plan
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        setIsSaving(false);
        return;
      }

      // Prepare payload, converting comma-separated strings to arrays
      const updatePayload = {
        ...formData,
        benefits: formData.benefits.split(",").map(item => item.trim()).filter(Boolean),
        exclusions: formData.exclusions.split(",").map(item => item.trim()).filter(Boolean),
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/insurance/update/${planId}`,
        updatePayload,
        {
          headers: { Auth: token },
          withCredentials: true,
        }
      );

      toast.success("Insurance plan updated successfully!");

      setTimeout(() => {
        router.back(); // Go back to the previous page
      }, 1500);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Update failed. Please try again.");
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <NavBar />
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />

      <main className="flex-grow container mx-auto px-4 py-10">
        <BackButton />

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Edit Insurance Plan</h2>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input id="companyName" type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>

              {/* Plan Name */}
              <div>
                <label htmlFor="planName" className="block text-sm font-medium text-gray-700">Plan Name</label>
                <input id="planName" type="text" name="planName" value={formData.planName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>

              {/* Base Premium */}
              <div>
                <label htmlFor="basePremium" className="block text-sm font-medium text-gray-700">Base Premium</label>
                <input id="basePremium" type="number" name="basePremium" value={formData.basePremium} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>

              {/* Premium Type */}
              <div>
                <label htmlFor="premiumType" className="block text-sm font-medium text-gray-700">Premium Type</label>
                <select id="premiumType" name="premiumType" value={formData.premiumType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Coverage Amount */}
              <div className="md:col-span-2">
                <label htmlFor="coverageAmount" className="block text-sm font-medium text-gray-700">Coverage Amount</label>
                <input id="coverageAmount" type="number" name="coverageAmount" value={formData.coverageAmount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>

              {/* Benefits */}
              <div className="md:col-span-2">
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">Benefits (comma-separated)</label>
                <textarea id="benefits" name="benefits" value={formData.benefits} onChange={handleChange} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
              </div>

              {/* Exclusions */}
              <div className="md:col-span-2">
                <label htmlFor="exclusions" className="block text-sm font-medium text-gray-700">Exclusions (comma-separated)</label>
                <textarea id="exclusions" name="exclusions" value={formData.exclusions} onChange={handleChange} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
              </div>

              {/* Redirect Link */}
              <div className="md:col-span-2">
                <label htmlFor="redirectLink" className="block text-sm font-medium text-gray-700">Redirect Link</label>
                <input id="redirectLink" type="text" name="redirectLink" value={formData.redirectLink} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button type="submit" disabled={isSaving} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400">
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditInsurancePlanPage;