'use client';

import Navbar from './nav'
import Footer from './footer'
import { usePathname } from 'next/navigation';
import TwitchPlayer from './twitch/player';

export default function Main({
    children,
}: {
    children: React.ReactNode
}) {
	const actualPath = usePathname().split('/').slice(0, 2).join('/');

    return (
        <div className="min-h-screen flex flex-col justify-between min-w-0 px-2 md:px-0 max-w-7xl md:mx-auto">
            <div className="space-y-2 grow flex flex-col">
                <Navbar actualPath={actualPath} />
                {children}
            </div>
            {/* <TwitchPlayer /> */}
            <Footer actualPath={actualPath} />
        </div>
    )
}