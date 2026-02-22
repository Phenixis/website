'use client';

import { HoverExpandPill } from '@/components/ui/hover-expand-pill';
import { useStyle } from '@/contexts/style-context';
import { navItems } from '@/lib/nav-items';
import type { StyleVariant } from '@/lib/style-flag';
import { usePathname } from 'next/navigation';
import DarkModeToggle from './dark-mode-toggle';
import { Link } from './link';
import Logo from './logo';
import StyleSelect from './style-select';
import { useIsMobile } from '@/hooks/use-mobile';

const record: Record<StyleVariant, React.ComponentType> = {
    classical: HeaderClassical,
    modern: HeaderModern,
}

export default function Header() {
    const { currentStyle } = useStyle();

    const Component = record[currentStyle] || HeaderClassical;

    return <Component />;
}

export function HeaderModern() {
    const isMobile = useIsMobile();
    const pathname = usePathname();

    const currentValue = pathname.includes('/blog') ? '/blog' : pathname;

    const entries = Object.entries(navItems);
    // Determine the index of the active page so items before it go left,
    // items after it go right — keeping the active pill in the centre.
    const currentIndex = entries.findIndex(([path]) => path === currentValue);

    const navOptions = entries.map(([path, { name }], index) => {
        const side: 'left' | 'right' = index < currentIndex ? 'left' : 'right';
        return { value: path, label: name, href: path, side };
    });

    return (
        <aside className="tracking-tight px-2 lg:px-12 py-2">
            <nav className="flex items-start justify-between gap-4">
                <div className="group/Logo glass shrink-0">
                    <Logo className="mr-2 py-1 px-2 m-1 align-middle hidden md:block" size={32} />
                    <Logo className="mr-2 py-1 px-2 m-1 align-middle md:hidden" size={20} />
                </div>

                <HoverExpandPill
                    options={navOptions}
                    currentValue={currentValue}
                />

                <div className="flex items-start gap-2 shrink-0">
                    <StyleSelect />
                    <DarkModeToggle />
                </div>
            </nav>
        </aside>
    )
}

export function HeaderClassical() {
    const pathname = usePathname();

    return (
        <aside className="tracking-tight sticky top-0 py-1 bg-background dark:bg-black">
            <div className="flex justify-between">
                <nav
                    className="w-full flex flex-row items-center justify-between relative px-0 pb-0 scroll-pr-6 md:relative"
                    id="nav"
                >
                    <div className="min-[1600px]:absolute min-[1600px]:-translate-x-[125%] shrink-0 group/Logo">
                        <Logo className="mr-2 py-1 px-2 m-1 align-middle" size={32} />
                    </div>
                    <div className="flex flex-row w-full justify-center md:justify-start">
                        {Object.entries(navItems).map(([path, { name }]) => {
                            return (
                                <Link
                                    key={path}
                                    href={path}
                                    prefetch={true}
                                    className={`group/nav flex items-center lg:hover:text-neutral-800 dark:lg:hover:text-neutral-200 align-middle relative py-1 px-2 m-1 ${pathname === path ? 'decoration-2' : 'text-neutral-500 dark:text-neutral-400'}`}
                                    underlined={pathname === path}
                                >
                                    {name}
                                </Link>
                            )
                        })}
                    </div>
                    <StyleSelect />
                    <DarkModeToggle />
                </nav>
            </div>
        </aside>
    )
}
