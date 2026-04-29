import React, { useState } from 'react';
import { FiMail, FiUser, FiMessageSquare, FiSend, FiCheckCircle, FiMapPin, FiClock } from 'react-icons/fi';
import getBaseUrl from '../utils/baseURL';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await fetch(`${getBaseUrl()}/api/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.message || 'Something went wrong.');
                setStatus('error');
                return;
            }

            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setErrorMsg('Network error. Please check your connection.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white py-16 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-sky-400 font-bold text-sm uppercase tracking-widest">Get in Touch</span>
                    <h1 className="text-5xl sm:text-6xl font-extrabold mt-3 mb-4 leading-tight">
                        We'd love to <span className="text-sky-400">hear</span><br />from you.
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Whether it's a question, feedback, or a partnership inquiry — drop us a message and we'll get back to you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-10">

                    {/* Left Info Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                                <FiMail size={20} />
                            </div>
                            <h3 className="font-bold text-white mb-1">Email Us</h3>
                            <p className="text-gray-400 text-sm">litsense.team@gmail.com</p>
                            <p className="text-gray-400 text-sm">support@litsense.ai</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                                <FiMapPin size={20} />
                            </div>
                            <h3 className="font-bold text-white mb-1">Location</h3>
                            <p className="text-gray-400 text-sm">Pune, Maharashtra, India</p>
                            <p className="text-gray-400 text-sm">Building AI for readers worldwide</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-4">
                                <FiClock size={20} />
                            </div>
                            <h3 className="font-bold text-white mb-1">Response Time</h3>
                            <p className="text-gray-400 text-sm">Typically within 24 hours.</p>
                            <p className="text-gray-400 text-sm">Our AI assistant is available 24/7.</p>
                        </div>
                    </div>

                    {/* Right Form Panel */}
                    <div className="lg:col-span-3">
                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center h-full py-20 rounded-3xl bg-white/5 border border-white/10 text-center px-8">
                                <FiCheckCircle className="text-green-400 mb-4" size={56} />
                                <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                                <p className="text-gray-400">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 px-6 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-full text-sm transition-all"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-5">
                                <h2 className="text-xl font-bold text-white mb-2">Send a Message</h2>

                                {errorMsg && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {errorMsg}
                                    </div>
                                )}

                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="relative">
                                        <FiUser className="absolute left-3 top-3.5 text-gray-500" />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your Name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FiMail className="absolute left-3 top-3.5 text-gray-500" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Your Email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <FiMessageSquare className="absolute left-3 top-3.5 text-gray-500" />
                                    <input
                                        type="text"
                                        name="subject"
                                        placeholder="Subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                                    />
                                </div>

                                <textarea
                                    name="message"
                                    placeholder="Write your message here..."
                                    rows={6}
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all resize-none"
                                />

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FiSend />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
