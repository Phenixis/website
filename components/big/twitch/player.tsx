"use client"

import { useEffect, useState } from 'react';

const TwitchPlayer = () => {
    const [host, setHost] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHost(window.location.hostname);
        }
    }, []);

    const handleClose = () => {
        setIsAnimating(true);
        // Wait for animation to complete before hiding
        setTimeout(() => {
            setIsVisible(false);
        }, 1000);
    };

    if (!host || !isVisible) return null;

    return (
        <div className={`
            fixed bottom-4 left-4 right-4 md:right-4 md:left-auto z-50
            md:w-96
            transition-transform duration-1000 ease-in-out
            ${isAnimating 
                ? 'transform translate-x-[105%]' 
                : 'transform translate-x-0 animate-slide-in-right'
            }
        `}>
            <div className="relative bg-black rounded-lg shadow-lg overflow-hidden">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="flex absolute top-2 right-2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full w-8 h-8 items-center justify-center text-lg font-bold transition-colors duration-200 backdrop-blur-sm"
                    aria-label="Close Twitch player"
                >
                    ×
                </button>
                
                <iframe
                    src={`https://player.twitch.tv/?channel=maximeduhamel&parent=${host}`}
                    height="216"
                    width="100%"
                    allowFullScreen
                    className='rounded-lg w-full'
                    frameBorder="0"
                />
            </div>
        </div>
    );
};

export default TwitchPlayer;
