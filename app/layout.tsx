import './globals.css'
import type { Metadata } from 'next'
import { baseUrl } from './sitemap'
import { Domine, Geist_Mono, Ubuntu_Sans_Mono } from 'next/font/google';
import {
    TooltipProvider
} from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

const domine = Domine({
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    subsets: ['latin'],
})

const ubuntuSansMono = Ubuntu_Sans_Mono({
    subsets: ['latin'],
})

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'Maxime Duhamel',
        template: '%s | Maxime Duhamel',
    },
    description: 'This is my portfolio.',
    openGraph: {
        title: "Maxime Duhamel's Portfolio",
        description: "Welcome to my portfolio.",
        url: baseUrl,
        siteName: "Maxime Duhamel's Portfolio",
        locale: 'en_US',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

const cx = (...classes: string[]) => classes.filter(Boolean).join(' ')

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="en"
            className={"overflow-x-hidden"}
        >
            <head>
                <link rel="icon" href="/favicon.png" sizes='any' />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/favicon.png" />
            </head>
            <body className={cx(
                'antialiased text-black bg-white dark:text-white dark:bg-black h-full min-h-screen w-full min-w-screen max-w-screen',
                domine.className,
                geistMono.className,
                ubuntuSansMono.className,
            )}>
                <TooltipProvider>
                    {children}
                </TooltipProvider>
                <Toaster />
            </body>
        </html>
    )
}
