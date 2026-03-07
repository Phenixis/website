import Main from '@/components/big/main';
import { Toaster } from "@/components/ui/sonner";
import {
    TooltipProvider
} from "@/components/ui/tooltip";
import { StyleProvider } from '@/contexts/style-context';
import { styleFlag } from '@/lib/flags';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Faculty_Glyphic, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { baseUrl } from './sitemap';

const geistMono = Geist_Mono({
    subsets: ['latin'],
})

const facultyGlyphic = Faculty_Glyphic({
    subsets: ['latin'],
    weight: '400'
})

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'Maxime Duhamel',
        template: '%s | Maxime Duhamel',
    },
    description: 'This is my portfolio.',
    alternates: {
        canonical: baseUrl,
    },
    openGraph: {
        title: "Maxime Duhamel's Portfolio",
        description: "Welcome to my portfolio.",
        url: baseUrl,
        siteName: "Maxime Duhamel's Portfolio",
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: `${baseUrl}/og?title=${encodeURIComponent("Maxime Duhamel")}`,
                width: 1200,
                height: 630,
                alt: "Maxime Duhamel's Portfolio",
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Maxime Duhamel's Portfolio",
        description: "Welcome to my portfolio.",
        images: [`${baseUrl}/og?title=${encodeURIComponent("Maxime Duhamel")}`],
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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const cookieStore = await cookies();
    const theme = cookieStore.get('theme')?.value;
    const initialStyle = await styleFlag();

    return (
        <html
            lang="en"
            className={cn("overflow-x-hidden", theme, initialStyle)}
        >
            <head>
                <link rel="icon" href="/favicon.png" sizes='any' />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/favicon.png" />
            </head>
            <body className={cn(
                'antialiased text-black bg-white dark:text-white dark:bg-black h-full min-h-screen w-full min-w-screen max-w-screen',
                initialStyle === 'classical' ? geistMono.className : facultyGlyphic.className
            )}>
                <StyleProvider initialStyle={initialStyle}>
                    <TooltipProvider>
                        <Main>
                            {children}
                        </Main>
                    </TooltipProvider>
                </StyleProvider>
                <Analytics />
                <Toaster />
            </body>
        </html>
    )
}
