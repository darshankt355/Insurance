"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { FiShield, FiInfo, FiArrowRight, FiEdit, FiTrash2 } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
const InsuranceByCategory = () => {
    const router = useRouter();
    const { id } = useParams();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
        
        if (!role) {
            // Using a flag to prevent double toast
            if (!sessionStorage.getItem('isRedirecting')) {
                setLoading(false);
                setTimeout(() => {
                    toast.error('Please login first.');
                }, 1000);
                sessionStorage.setItem('isRedirecting', 'true');
                router.push('/login');
            }
        }
        // Cleanup the flag when the component unmounts
        return () => {
            sessionStorage.removeItem('isRedirecting');
        };
    }, [router]);

    const [plans, setPlans] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchPlans = async () => {
            if (!id) return;
            // Only fetch if the user is logged in
            if (!localStorage.getItem('role')) return;

            setLoading(true);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/insurance/category/${id}`
                );
                setPlans(res.data);
                if (res.data.length > 0) {
                    // Assuming the category name can be derived from the first plan
                    // Or you might need a separate API call to get category details
                    setCategoryName(res.data[0].category?.name || "Insurance Plans");
                }
            } catch (err) {
                console.error("Error fetching insurance plans:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, [id]);

    const handleEdit = (e, planId) => {
        e.stopPropagation();
        router.push(`/insurance/edit/${planId}/`);
    };

    const handleDelete = async (e, planId, planName) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the plan "${planName}"?`)) {
            try {
                const token = localStorage.getItem('token');
                console.log
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/insurance/delete/${planId}`, {
                    headers: { Auth: token },
                    withCredentials: true
                });
                toast.success(`Plan "${planName}" deleted successfully.`);
                setPlans(plans.filter(p => p._id !== planId));
            } catch (err) {
                console.error("Error deleting plan:", err);
                toast.error(err.response?.data?.message || 'Failed to delete plan.');
            }
        }
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

            <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
                <NavBar />
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <BackButton />
                    <header className="mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-800">{loading ? 'Loading...' : categoryName}</h1>
                        <p className="mt-2 text-lg text-gray-500">Explore the available plans below.</p>
                    </header>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : plans.length === 0 ? (
                        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                            <FiInfo className="mx-auto h-12 w-12 text-blue-500" />
                            <h2 className="mt-4 text-2xl font-bold text-gray-800">No Plans Available</h2>
                            <p className="mt-2 text-gray-600">There are currently no insurance plans available in this category. Please check back later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {plans.map((plan) => (
                                <div key={plan._id} className="relative bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group">
                                    {['admin', 'employee'].includes(userRole) && (
                                        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                            <button
                                                onClick={(e) => handleEdit(e, plan._id)}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                                                aria-label="Edit Plan"
                                            >
                                                <FiEdit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, plan._id, plan.planName)}
                                                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                                                aria-label="Delete Plan"
                                            >
                                                <FiTrash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                    <div className="p-6" onClick={() => router.push(`/insurance/plan/${plan._id}`)}>
                                        <div className="flex items-center mb-4">
                                            <div className="p-3 bg-blue-100 rounded-full mr-4">
                                                <FiShield className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-800 truncate">{plan.planName}</h2>
                                        </div>
                                        <p className="text-gray-600 mb-6 h-20 overflow-hidden">{plan.benefits.join(', ')}</p>

                                        <div className="flex items-center text-green-600 font-semibold mb-6">
                                            <span className="text-2xl mr-1">₹</span>
                                            <span className="text-2xl">{plan.basePremium}</span>
                                            <span className="text-gray-500 ml-2 text-sm">/ {plan.premiumType}</span>
                                        </div>

                                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center group-hover:bg-indigo-700">
                                            View Details
                                            <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
};

export default InsuranceByCategory;