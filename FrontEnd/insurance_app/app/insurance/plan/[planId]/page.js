"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { FiCheckCircle, FiXCircle, FiExternalLink, FiShield, FiTag } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';

const PlanDetailsPage = () => {
  const router = useRouter();
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (!userRole) {
      toast.error('Please login to view plan details.');
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (!planId) return;
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/insurance/getInsurance/${planId}`);
        setPlan(res.data);
      } catch (err) {
        console.error("Error fetching plan details:", err);
        toast.error("Failed to load plan details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [planId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <main className="container mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600">Plan not found.</h2>
          <p className="text-gray-600">The requested insurance plan could not be loaded.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="min-h-screen bg-slate-100 font-sans">
        <NavBar />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <BackButton />
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10">
            {/* Header Section */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{plan.planName}</h1>
              <p className="mt-2 text-lg text-gray-500">from <span className="font-semibold text-gray-700">{plan.companyName}</span></p>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <FiShield className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-500">Coverage Amount</p>
                <p className="text-2xl font-bold text-gray-800">₹{plan.coverageAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Premium</p>
                <p className="text-2xl font-bold text-green-700">
                  ₹{plan.basePremium.toLocaleString('en-IN')}
                  <span className="text-base font-medium text-gray-500"> / {plan.premiumType}</span>
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <FiTag className="mx-auto h-8 w-8 text-indigo-600 mb-2" />
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-xl font-semibold text-gray-800">{plan.category?.name || 'General'}</p>
              </div>
            </div>

            {/* Benefits and Exclusions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What's Covered</h2>
                <ul className="space-y-3">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What's Not Covered</h2>
                <ul className="space-y-3">
                  {plan.exclusions.map((exclusion, index) => (
                    <li key={index} className="flex items-start">
                      <FiXCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{exclusion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Button */}
            
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PlanDetailsPage;