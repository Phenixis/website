import Image from 'next/image'
import ListIconLight from 'public/list-icon-light.png';
import ListIconDark from 'public/list-icon-dark.png';
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Logo({ className, size=16 } : { className?: string, size?: number }) {
    return (
        <Link href="/" className={cn('inline-block duration-1000 lg:group-hover/Logo:rotate-45 shrink-0', className)}>
            <Image src={ListIconLight} width={size} height={size} alt="list-style" className="dark:hidden" priority />
            <Image src={ListIconDark} width={size} height={size} alt="list-style" className="hidden dark:block" priority />
        </Link>
    )
}