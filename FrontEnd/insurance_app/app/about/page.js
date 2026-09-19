"use client";
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { FiBriefcase, FiTrendingUp, FiShield, FiCheckCircle, FiBarChart2, FiUsers } from 'react-icons/fi';

const AboutPage = () => {

    const services = [
        { name: "Financial in-depth evaluation and consultation", icon: <FiBarChart2 className="h-8 w-8 text-blue-500" /> },
        { name: "Customized portfolio management services", icon: <FiBriefcase className="h-8 w-8 text-green-500" /> },
        { name: "Credit risk management", icon: <FiShield className="h-8 w-8 text-red-500" /> },
        { name: "Tax and audit consultation", icon: <FiTrendingUp className="h-8 w-8 text-purple-500" /> },
        { name: "End to end supporting from planning till monitoring", icon: <FiCheckCircle className="h-8 w-8 text-yellow-500" /> }
    ];

    const partners = [
        "Bank Of India", "Union Bank", "DCB Bank", "ICICI Bank", "Even health",
        "Manipal Cigna", "Harsha and Associates ( CA Firm)", "SUD Life insurance", "HDFC Life insurance"
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <NavBar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <BackButton />
                
                {/* Header Section */}
                <header className="text-center mb-20 py-4">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-red-700 tracking-tight">ANNMA Fintech Services</h1>
                    <p className="mt-4 max-w-4xl mx-auto text-lg text-gray-600">
                        A boutique wealth management and financial consulting firm offering 360° financial analysis, strategic planning, and bespoke advisory solutions.
                    </p>
                </header>

                {/* Main Content Section */}
                <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg mb-20">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center"><FiUsers className="mr-3 text-blue-500"/>Who We Are</h2>
                    <div className="text-gray-700 space-y-4 text-justify">
                        <p>
                            Our practice is anchored in professional integrity, supported by SEBI-certified and IRDA-certified financial expertise. We begin with an in-depth evaluation of financial structures, objectives, and risk profiles, followed by the design of customized investment strategies, risk-managed solutions, and capital growth frameworks aligned with long-term wealth creation and preservation.
                        </p>
                        <p>
                            In addition, we assist clients with structured loan solutions, ensuring optimal access to credit aligned with their financial plans. With expert consultation and end-to-end process support, we partner with our clients across execution, monitoring, and periodic review—enabling informed decisions, financial clarity, and sustained prosperity.
                        </p>
                    </div>
                </div>

                {/* Services Section */}
                <div className="mb-20 py-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start space-x-4">
                                <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full">
                                    {service.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tie-ups Section */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Tie Ups with Companies and Banks</h2>
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 text-center">
                            {partners.map((partner, index) => (
                                <div key={index} className="flex justify-center items-center">
                                    <p className="text-md font-medium text-gray-700">{partner}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;