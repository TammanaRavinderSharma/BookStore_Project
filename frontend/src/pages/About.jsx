import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiCpu, FiHeart, FiArrowRight } from 'react-icons/fi';

const milestones = [
    { year: '2024', event: 'Litsense was founded as a Final Year Project with 200 curated books.' },
    { year: 'Early 2025', event: 'Integrated Gemini AI for personalized recommendations and mood detection.' },
    { year: 'Mid 2025', event: 'Expanded to 100,000+ books with a global dataset and AI summarization.' },
    { year: 'Late 2025', event: 'Launched AI Chat Mode, Global Search, and Category Explorer.' },
    { year: '2026', event: 'Building Litsense Pro for institutions and expanding to mobile.' },
];

const values = [
    { icon: <FiBookOpen size={24} />, title: 'Literature First', desc: 'We believe every great book deserves to be discovered. Our platform is built to surface the right book for every reader.' },
    { icon: <FiCpu size={24} />, title: 'AI-Powered Clarity', desc: 'We use state-of-the-art AI to cut through the noise. No more spending hours searching — our system finds what you need.' },
    { icon: <FiHeart size={24} />, title: 'Reader-Centric', desc: 'Every feature we build starts with one question: does this make reading more joyful? If not, we go back to the drawing board.' },
];

const About = () => {
    return (
        <div className="min-h-screen bg-[#080808] text-white py-16 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Hero */}
                <div className="text-center mb-20">
                    <span className="text-sky-400 font-bold text-sm uppercase tracking-widest">Our Story</span>
                    <h1 className="text-5xl sm:text-6xl font-extrabold mt-3 mb-6 leading-tight">
                        We're building the future<br />
                        of <span className="text-sky-400">reading.</span>
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        Litsense started as a final-year project with a simple idea: what if finding your next book was as easy as describing how you feel?
                    </p>
                </div>

                {/* Mission */}
                <div className="grid md:grid-cols-2 gap-8 mb-20 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            We're on a mission to make 100,000+ books accessible to every reader on the planet. We believe that a great book can change a perspective, heal a wound, or ignite a passion — and we want to make finding that book effortless.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            By combining a massive, real-world book dataset with the power of Google's Gemini AI, we've built a platform that doesn't just list books — it understands them.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-black text-xl">100k</div>
                            <div>
                                <p className="font-bold text-white">Books in our catalog</p>
                                <p className="text-gray-500 text-sm">From Goodreads and global sources</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xl">AI</div>
                            <div>
                                <p className="font-bold text-white">Gemini AI Integration</p>
                                <p className="text-gray-500 text-sm">Summaries, chat, and mood detection</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-black text-xl">13+</div>
                            <div>
                                <p className="font-bold text-white">Curated Genre Categories</p>
                                <p className="text-gray-500 text-sm">Fiction, Fantasy, History, and more</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-10">What We Stand For</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {values.map((v, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                                    {v.icon}
                                </div>
                                <h3 className="font-bold text-white text-lg mb-2">{v.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-10">Our Journey</h2>
                    <div className="relative border-l border-white/10 pl-8 space-y-8">
                        {milestones.map((m, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[2.65rem] top-1 w-4 h-4 rounded-full bg-sky-400 border-4 border-[#080808]"></div>
                                <p className="text-sky-400 font-bold text-sm mb-1">{m.year}</p>
                                <p className="text-gray-300 leading-relaxed">{m.event}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center p-10 rounded-3xl bg-white/5 border border-white/10">
                    <h2 className="text-3xl font-bold mb-3">Join us on this journey</h2>
                    <p className="text-gray-400 mb-6">Have a question, suggestion, or want to collaborate? We'd love to hear from you.</p>
                    <Link to="/contact"
                        className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-3 rounded-full transition-all active:scale-95 shadow-lg shadow-sky-500/20">
                        Contact Us <FiArrowRight />
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default About;
