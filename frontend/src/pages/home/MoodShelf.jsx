import React from 'react';
import MoodSection from './MoodSection';
import { FiHeart } from 'react-icons/fi';

const moodConfig = [
    { moodType: 'happy',     label: 'Happy',     emoji: '😄', accentColor: 'text-yellow-400' },
    { moodType: 'motivated', label: 'Motivated', emoji: '🔥', accentColor: 'text-red-400'    },
    { moodType: 'relaxed',   label: 'Relaxed',   emoji: '🌿', accentColor: 'text-emerald-400' },
];

const MoodShelf = () => {
    return (
        <section className="py-12 px-4 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-screen-2xl mx-auto relative z-10">
                {/* Section header */}
                <div className="flex items-center gap-2 text-fuchsia-400 text-sm font-bold uppercase tracking-widest mb-2">
                    <FiHeart />
                    <span>Mood-Based Shelves</span>
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-1">Books for Every Feeling</h2>
                <p className="text-gray-500 text-sm mb-8">
                    Curated from 100,000+ books — matched to how you feel right now.
                </p>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                {/* One row per mood */}
                {moodConfig.map((mood, idx) => (
                    <React.Fragment key={mood.moodType}>
                        <MoodSection
                            moodType={mood.moodType}
                            label={mood.label}
                            emoji={mood.emoji}
                            accentColor={mood.accentColor}
                        />
                        {idx < moodConfig.length - 1 && (
                            <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};

export default MoodShelf;
