import React, { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className={`
                fixed bottom-8 right-6 z-50
                w-11 h-11 rounded-full
                bg-sky-500 hover:bg-sky-400
                text-white shadow-lg shadow-sky-500/30
                flex items-center justify-center
                transition-all duration-300 ease-out
                hover:scale-110 hover:shadow-sky-500/50 hover:shadow-xl
                ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}
        >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-sky-400 animate-ping opacity-20" />
            <FiArrowUp size={18} className="relative z-10" />
        </button>
    );
};

export default BackToTop;
