"use client";

import { useStyle } from '@/contexts/style-context';
import { StyleVariant } from '@/lib/style-flag';
import * as Background from '@/public/background.png';
import Image from 'next/image';
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

    return <Component>{children}</Component>;
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
        <div className="min-h-screen flex flex-col justify-between min-w-0 px-2 md:px-0 md:mx-auto">
            {/* Sticky wrapper: fill uses position:absolute inline, so sticky must be on the parent */}
            <div className="sticky top-0 -z-10 w-full h-screen -mb-[100vh] pointer-events-none">
                <Image src={Background} alt="Background" fill className="object-cover dark:opacity-20" />
            </div>
            <div className="space-y-2 grow flex flex-col">
                <Header />
                <div className='my-10 mx-20 p-4 glass rounded-lg'>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}