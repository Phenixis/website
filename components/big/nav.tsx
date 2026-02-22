'use client';

import { navItems } from '@/lib/nav-items';
import { usePathname } from 'next/navigation';
import DarkModeToggle from './dark-mode-toggle';
import { Link } from './link';
import Logo from './logo';
import StyleSelect from './style-select';
import { useStyle } from '@/contexts/style-context';
import type { StyleVariant } from '@/lib/style-flag';
import { HoverExpandPill } from '@/components/ui/hover-expand-pill';

const record: Record<StyleVariant, React.ComponentType> = {
    classical: NavbarClassical,
    modern: NavbarModern,
}

export default function Navbar() {
    const { currentStyle } = useStyle();

    const Component = record[currentStyle] || NavbarClassical;

    return <Component />;
}

function NavbarModern() {
    const pathname = usePathname();

    const entries = Object.entries(navItems);
    // Determine the index of the active page so items before it go left,
    // items after it go right — keeping the active pill in the centre.
    const currentIndex = entries.findIndex(([path]) => path === pathname);

    const navOptions = entries.map(([path, { name }], index) => {
        const side: 'left' | 'right' = index < currentIndex ? 'left' : 'right';
        return { value: path, label: name, href: path, side };
    });

    return (
        <aside className="tracking-tight sticky top-0 py-2 bg-background/80 dark:bg-black/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
            <nav className="flex items-center justify-between gap-4">
                <Logo className="shrink-0" size={28} />

                <HoverExpandPill
                    options={navOptions}
                    currentValue={pathname}
                />

                <div className="flex items-center gap-2 shrink-0">
                    <StyleSelect />
                    <DarkModeToggle />
                </div>
            </nav>
        </aside>
    )
}

function NavbarClassical() {
    const pathname = usePathname();

    return (
        <aside className="tracking-tight sticky top-0 py-1 bg-background dark:bg-black">
            <div className="flex justify-between">
                <nav
                    className="w-full flex flex-row items-center justify-between relative px-0 pb-0 fade scroll-pr-6 md:relative"
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
