"use client";
import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiTrash2, FiInbox, FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';

const ContactMessagesPage = () => {
    const router = useRouter();
     useEffect(() => {
        const userRole = localStorage.getItem('role');
        // If the user role is not 'admin', redirect to the homepage.
        if (userRole !== 'admin' && userRole !== 'employee') {
          router.push('/');
        }
      }, [router]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contact/getContact`);
            if (response.data && Array.isArray(response.data.contact)) {
                setMessages(response.data.contact.reverse()); // Show newest first
            } else {
                setMessages([]);
            }
            setError(null);
        } catch (err) {
            setError('Failed to fetch messages. Please try again later.');
            toast.error('Failed to fetch messages.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/contact/deleteContact/${id}`);
                setMessages(messages.filter(msg => msg._id !== id));
                toast.success('Message deleted successfully!');
            } catch (err) {
                toast.error('Failed to delete message.');
                console.error(err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <NavBar />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <BackButton />
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-800">Contact Form Submissions</h1>
                    <p className="mt-2 text-lg text-gray-500">Review and manage messages from users.</p>
                </header>

                {loading && <p className="text-center text-gray-600">Loading messages...</p>}
                {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>}

                {!loading && !error && (
                    messages.length > 0 ? (
                        <div className="space-y-6">
                            {messages.map((msg) => (
                                <div key={msg._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow">
                                            <h2 className="text-xl font-bold text-gray-800 mb-2">{msg.subject}</h2>
                                            <div className="text-sm text-gray-500 space-y-2 mb-4">
                                                <p className="flex items-center"><FiUser className="mr-2" /><strong>From:</strong> {msg.Name}</p>
                                                <p className="flex items-center"><FiMail className="mr-2" /><strong>Email:</strong> <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">{msg.email}</a></p>
                                            </div>
                                            <p className="text-gray-700 bg-gray-50 p-4 rounded-md"><FiMessageSquare className="inline mr-2 mb-1" />{msg.message}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(msg._id)}
                                            className="ml-4 p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                                            aria-label="Delete message"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-4 text-right">
                                        Received on: {new Date(msg.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <FiInbox className="mx-auto h-16 w-16 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-800">No Messages</h3>
                            <p className="mt-1 text-sm text-gray-500">There are currently no messages to display.</p>
                        </div>
                    )
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ContactMessagesPage;