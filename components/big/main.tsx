"use client";

import { useStyle } from '@/contexts/style-context';
import { StyleVariant } from '@/lib/style-flag';
import * as BackgroundHorizontal from '@/public/background-horizontal.png';
import * as BackgroundVertical from '@/public/background-vertical.png';
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
        <div className="min-h-screen flex flex-col justify-between min-w-0">
            {/* Sticky wrapper: fill uses position:absolute inline, so sticky must be on the parent */}
            <div className="sticky top-0 -z-10 w-full h-screen -mb-[100vh] pointer-events-none">
                <Image src={BackgroundVertical} alt="Background" fill className="object-cover dark:opacity-40 md:hidden" placeholder="blur" loading="lazy" />
                <Image src={BackgroundHorizontal} alt="Background" fill className="object-cover dark:opacity-40 hidden md:block" placeholder="blur" loading="lazy" />
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