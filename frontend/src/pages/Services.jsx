import React from 'react';
import { Link } from 'react-router-dom';
import { FiCpu, FiSearch, FiHeart, FiZap, FiBookOpen, FiUsers, FiArrowRight } from 'react-icons/fi';

const services = [
    {
        icon: <FiCpu size={28} />,
        color: 'sky',
        title: 'Litsense Insight',
        subtitle: 'AI Summarization',
        description: 'Get instant, intelligent summaries of any book in our 100,000+ library. Powered by Gemini AI, our system delivers 3 key takeaways in seconds so you can make smarter reading decisions.',
        cta: 'Try Now',
        link: '/categories/Fiction',
    },
    {
        icon: <FiHeart size={28} />,
        color: 'pink',
        title: 'Litsense Mood',
        subtitle: 'Emotion-Based Discovery',
        description: 'Not sure what to read? Tell us how you want to feel. Our AI maps your mood to the perfect genre and curates a reading list tailored to your emotional state at that moment.',
        cta: 'Explore Moods',
        link: '/ai',
    },
    {
        icon: <FiSearch size={28} />,
        color: 'purple',
        title: 'Litsense Search',
        subtitle: 'Semantic Global Search',
        description: 'Search across 100,000 books by title, author, or even by a feeling or theme. Our global search powers through our entire dataset with blazing speed.',
        cta: 'Start Searching',
        link: '/search',
    },
    {
        icon: <FiZap size={28} />,
        color: 'yellow',
        title: 'Litsense AI Chat',
        subtitle: '24/7 AI Reading Assistant',
        description: 'Ask our AI anything about books — recommendations, summaries, comparisons, or what to read next. It remembers context and speaks your language.',
        cta: 'Chat with AI',
        link: '/ai',
    },
    {
        icon: <FiBookOpen size={28} />,
        color: 'green',
        title: 'Category Explorer',
        subtitle: 'Browse 13+ Genres',
        description: 'Dive deep into curated genre pages spanning Fiction, Mystery, Fantasy, History, and more. Each page is powered by a live connection to our 100k dataset.',
        cta: 'Browse Genres',
        link: '/categories/Fiction',
    },
    {
        icon: <FiUsers size={28} />,
        color: 'orange',
        title: 'Litsense Pro',
        subtitle: 'Institutional Access',
        description: 'Empower schools, colleges, and libraries with AI-managed digital shelves. Bulk access to our entire catalog with a dedicated admin portal.',
        cta: 'Contact Us',
        link: '/contact',
    },
];

const colorMap = {
    sky: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
    pink: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
};

const Services = () => {
    return (
        <div className="min-h-screen bg-[#080808] py-16 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-sky-400 font-bold text-sm uppercase tracking-widest">What We Offer</span>
                    <h1 className="text-5xl sm:text-6xl font-extrabold text-white mt-3 mb-4 leading-tight">
                        AI-Powered Reading,<br />
                        <span className="text-sky-400">Reimagined.</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Litsense is more than a bookstore. It's an intelligent literary companion that connects you to the right book at the right moment.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((s, i) => (
                        <div key={i} className={`p-6 rounded-2xl border bg-white/5 border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 flex flex-col`}>
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 border ${colorMap[s.color]}`}>
                                {s.icon}
                            </div>
                            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">{s.subtitle}</span>
                            <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-5">{s.description}</p>
                            <Link to={s.link} className="flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors group">
                                {s.cta}
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 text-center p-10 rounded-3xl bg-white/5 border border-white/10">
                    <h2 className="text-3xl font-bold text-white mb-3">Want a custom solution?</h2>
                    <p className="text-gray-400 mb-6">Reach out and our team will design an AI-powered reading experience for your organization.</p>
                    <Link to="/contact"
                        className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-3 rounded-full transition-all active:scale-95 shadow-lg shadow-sky-500/20">
                        Get in Touch <FiArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Services;
