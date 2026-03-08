"use client";

import { useStyle } from '@/contexts/style-context';
import { StyleVariant } from '@/lib/style-flag';

import Footer from './footer';
import Header from './header';

const record: Record<StyleVariant, React.ComponentType<{ children: React.ReactNode }>> = {
    classical: MainClassical,
    modern: MainModern,
}

export default function Main({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { currentStyle } = useStyle();

    const Component = record[currentStyle] || MainClassical;

    return <Component key={currentStyle}>{children}</Component>;
}


export function MainClassical({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen flex flex-col justify-between min-w-0 px-2 md:px-0 max-w-7xl md:mx-auto">
            <div className="space-y-2 grow flex flex-col">
                <Header />
                {children}
            </div>
            <Footer />
        </div>
    )
}

export function MainModern({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen flex flex-col justify-between min-w-0">
            {/* Sticky wrapper: fill uses position:absolute inline, so sticky must be on the parent */}
            <div className="sticky top-0 -z-10 w-full h-screen -mb-[100vh] pointer-events-none overflow-hidden">
                <div className="absolute md:inset-0 max-md:top-1/2 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:w-[100vh] max-md:h-[100vw] max-md:-rotate-90">
                    <BackgroundSVG />
                </div>
            </div>
            <div className="space-y-2 grow flex flex-col">
                <Header />
                <div className='m-2 lg:mx-12 p-2! glass rounded-lg'>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

/**
 * Inline SVG background with per-layer staggered entrance animations.
 * Uses CSS animations with animation-fill-mode: backwards (via "both") so the
 * `from` keyframe is applied during the delay — elements are guaranteed to be
 * off-screen before their animation begins.
 *
 * Stagger rule: each next layer begins when the previous one is halfway through.
 *   smallest: delay=0s   → arrives at 0.5s
 *   medium:   delay=0.25s → halfway at 0.5s, arrives at 0.75s
 *   largest:  delay=0.5s  → halfway at 0.75s, arrives at 1s
 */
function BackgroundSVG() {
    return (
        <svg
            viewBox="0 0 960 540"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full dark:opacity-60 duration-200"
            aria-hidden="true"
        >
            <style>{`
                @keyframes slide-br-sm { from { transform: translate(90px,  50px);  } to { transform: translate(0,0); } }
                @keyframes slide-br-md { from { transform: translate(180px, 100px); } to { transform: translate(0,0); } }
                @keyframes slide-br-lg { from { transform: translate(270px, 150px); } to { transform: translate(0,0); } }
                @keyframes slide-tl-sm { from { transform: translate(-200px, -150px); } to { transform: translate(0,0); } }
                @keyframes slide-tl-md { from { transform: translate(-300px, -250px); } to { transform: translate(0,0); } }
                @keyframes slide-tl-lg { from { transform: translate(-400px, -350px); } to { transform: translate(0,0); } }
                .ease-out-expo { animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); animation-duration: 0.5s; animation-fill-mode: both; }
                .br-sm { animation-name: slide-br-sm; animation-delay: 0s;    }
                .br-md { animation-name: slide-br-md; animation-delay: 0.25s; }
                .br-lg { animation-name: slide-br-lg; animation-delay: 0.5s;  }
                .tl-sm { animation-name: slide-tl-sm; animation-delay: 0s;    }
                .tl-md { animation-name: slide-tl-md; animation-delay: 0.25s; }
                .tl-lg { animation-name: slide-tl-lg; animation-delay: 0.5s;  }
                @media (prefers-reduced-motion: reduce) { .ease-out-expo { animation-duration: 0.001s; animation-delay: 0s !important; } }
            `}</style>

            <rect x="0" y="0" width="960" height="540" fill="#73528c" />
            <defs>
                <linearGradient id="grad1_0" x1="43.8%" y1="100%" x2="100%" y2="0%">
                    <stop offset="14.444444444444446%" stopColor="#001122" stopOpacity="1" />
                    <stop offset="85.55555555555554%" stopColor="#001122" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="grad1_1" x1="43.8%" y1="100%" x2="100%" y2="0%">
                    <stop offset="14.444444444444446%" stopColor="#001122" stopOpacity="1" />
                    <stop offset="85.55555555555554%" stopColor="#2e3359" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="grad1_2" x1="43.8%" y1="100%" x2="100%" y2="0%">
                    <stop offset="14.444444444444446%" stopColor="#73528c" stopOpacity="1" />
                    <stop offset="85.55555555555554%" stopColor="#2e3359" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="grad2_0" x1="0%" y1="100%" x2="56.3%" y2="0%">
                    <stop offset="14.444444444444446%" stopColor="#001122" stopOpacity="1" />
                    <stop offset="85.55555555555554%" stopColor="#001122" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="grad2_1" x1="0%" y1="100%" x2="56.3%" y2="0%">
                    <stop offset="14.444444444444446%" stopColor="#2e3359" stopOpacity="1" />
                    <stop offset="85.55555555555554%" stopColor="#001122" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="grad2_2" x1="0%" y1="100%" x2="56.3%" y2="0%">
                    <stop offset="14.444444444444446%" stopColor="#2e3359" stopOpacity="1" />
                    <stop offset="85.55555555555554%" stopColor="#73528c" stopOpacity="1" />
                </linearGradient>
            </defs>

            {/* Bottom-right corner: anchor at (960,540), each layer slides in from bottom-right */}
            <g transform="translate(960, 540)">
                <g className="ease-out-expo br-lg">
                    <path d="M-270 0C-255.7 -24.3 -241.3 -48.7 -233 -75.7C-224.7 -102.7 -222.5 -132.5 -206.3 -149.9C-190.1 -167.3 -160 -172.4 -138.7 -190.9C-117.5 -209.4 -105.1 -241.4 -83.4 -256.8C-61.8 -272.2 -30.9 -271.1 0 -270L0 0Z" fill="#4e4374" />
                </g>
                <g className="ease-out-expo br-md">
                    <path d="M-180 0C-170.4 -16.2 -160.9 -32.5 -155.3 -50.5C-149.8 -68.5 -148.3 -88.3 -137.5 -99.9C-126.7 -111.5 -106.7 -114.9 -92.5 -127.3C-78.3 -139.6 -70 -160.9 -55.6 -171.2C-41.2 -181.5 -20.6 -180.7 0 -180L0 0Z" fill="#14233d" />
                </g>
                <g className="ease-out-expo br-sm">
                    <path d="M-90 0C-85.2 -8.1 -80.4 -16.2 -77.7 -25.2C-74.9 -34.2 -74.2 -44.2 -68.8 -50C-63.4 -55.8 -53.3 -57.5 -46.2 -63.6C-39.2 -69.8 -35 -80.5 -27.8 -85.6C-20.6 -90.7 -10.3 -90.4 0 -90L0 0Z" fill="#001122" />
                </g>
            </g>

            {/* Top-left corner: each layer slides in from top-left */}
            <g>
                <g className="ease-out-expo tl-lg">
                    <path d="M270 0C250.8 22.7 231.7 45.5 226.4 73.5C221 101.6 229.6 135 218.4 158.7C207.3 182.4 176.5 196.5 149.3 205.5C122.1 214.5 98.5 218.4 74.2 228.3C49.9 238.2 24.9 254.1 0 270L0 0Z" fill="#4e4374" />
                </g>
                <g className="ease-out-expo tl-md">
                    <path d="M180 0C167.2 15.2 154.4 30.3 150.9 49C147.4 67.7 153 90 145.6 105.8C138.2 121.6 117.7 131 99.5 137C81.4 143 65.6 145.6 49.4 152.2C33.3 158.8 16.6 169.4 0 180L0 0Z" fill="#14233d" />
                </g>
                <g className="ease-out-expo tl-sm">
                    <path d="M90 0C83.6 7.6 77.2 15.2 75.5 24.5C73.7 33.9 76.5 45 72.8 52.9C69.1 60.8 58.8 65.5 49.8 68.5C40.7 71.5 32.8 72.8 24.7 76.1C16.6 79.4 8.3 84.7 0 90L0 0Z" fill="#001122" />
                </g>
            </g>
        </svg>
    );
}