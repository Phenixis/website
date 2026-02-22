'use client';

import LifeElapsed from '@/components/big/life-elapsed'
import { footerLinks } from '@/lib/footer-links';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { StyleVariant } from '@/lib/style-flag';
import { useStyle } from '@/contexts/style-context';
import { cn } from '@/lib/utils';

function ArrowIcon() {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
                fill="currentColor"
            />
        </svg>
    )
}

const record: Record<StyleVariant, React.ComponentType> = {
    classical: FooterClassical,
    modern: FooterModern,
}

export default function Footer() {
    const { currentStyle } = useStyle();

    const Component = record[currentStyle] || FooterClassical;

    return <Component />;
}

export function FooterClassical() {
    const pathname = usePathname();

    const visibleLinks = useMemo(() =>
        footerLinks.filter((link) =>
            link.visibleOn.some((path) => pathname.includes(path))
        ), [pathname]
    );

    return (
        <footer className="flex justify-between items-end mt-2 mb-4">
            <ul className="grid gap-2 grid-cols-2 lg:grid-cols-4 font-sm text-neutral-500 md:gap-4 list-none">
                {
                    visibleLinks.map((link) => {
                        return (
                            <li
                                key={link.name}
                                className="animate-in fade-in duration-300"
                            >
                                <a
                                    className="flex duration-1000 items-center transition-all lg:hover:text-neutral-900 dark:lg:hover:text-neutral-100"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href={link.ref}
                                >
                                    <ArrowIcon />
                                    <p className="ml-2 h-7">{link.name}</p>
                                </a>
                            </li>
                        );
                    })
                }
            </ul>

            <LifeElapsed />
        </footer>
    )
}

export function FooterModern() {
    const pathname = usePathname();

    const visibleLinks = useMemo(() =>
        footerLinks.filter((link) =>
            link.visibleOn.some((path) => pathname.includes(path))
        ), [pathname]
    );

    return (
        <footer className="flex justify-between items-center px-2 lg:px-12 py-2">
            <ul className="grid gap-2 grid-cols-2 lg:grid-cols-4 font-sm md:gap-4 list-none">
                {
                    visibleLinks.map((link) => {
                        return (
                            <li
                                key={link.name}
                                className="group/link cursor-pointer"
                            >
                                <a
                                    className={cn("flex items-center justify-center glass p-2!", "before:absolute before:left-0 before:bottom-2 before:h-0.5 before:w-full before:rounded-full before:bg-black dark:before:bg-white before:transition-transform before:duration-1000 before:scale-x-0 group-hover/link:before:scale-x-80 before:origin-center")}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href={link.ref}
                                >
                                    <ArrowIcon />
                                    <p className={cn("ml-2 h-6")}>{link.name}</p>
                                </a>
                            </li>
                        );
                    })
                }
            </ul>

            <LifeElapsed className='glass px-2! py-3!' />
        </footer>
    )
}
