"use client";
import axios from 'axios';
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate an API call
        try{
            const response=await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contact/contactMessage`,{
                Name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,

            });
            if(response.status===201){
                toast.success('Thank you for your message! We will get back to you soon.');
                setFormData({ name: '', email: '', subject: '', message: '' });
                setIsSubmitting(false);
            } else{
                throw new Error('Failed to submit message');
            }
        }
        catch(error){
            toast.error('Error submitting message. Please try again.');
            setIsSubmitting(false);
        }
        
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <NavBar />
            <ToastContainer position="top-right" autoClose={5000} theme="dark" />

            <main className="flex-grow py-16">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Get in Touch</h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            We're here to help. Whether you have a question about our products, need assistance with a claim, or just want to say hello, we'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-lg">
                        {/* Contact Form */}
                        <div className="order-2 lg:order-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3" />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="5" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"></textarea>
                                </div>
                                <div>
                                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400">
                                        {isSubmitting ? 'Submitting...' : 'Submit Message'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div className="order-1 lg:order-2 space-y-10 ">
                             <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                            <div className="flex items-start">
                                <FiMail className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                                    <p className="text-gray-600">annmafintechservices@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <FiPhone className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                                    <p className="text-gray-600">+91 9071388339, +91 8884471001  </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <FiMapPin className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Office Address</h3>
                                    <p className="text-gray-600"> No. 34, 11th A cross, S P Extension, Malleshwaram, Bengaluru 560003 </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <FiMapPin className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Registered Address</h3>
                                    <p className="text-gray-600">  No. 8, Balaji layout, Kariobanahalli, Thigalarapalya, Bengaluru 560058.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;