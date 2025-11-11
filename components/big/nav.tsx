import { Link } from './link'
import DarkModeToggleFrontOffice from './darkMode/dark-mode-toggle-front-office'
import Logo from './logo'

const navItems = {
	'/': {
		name: 'Home',
	},
	'/blog': {
		name: 'Blog',
	},
	'/projects': {
		name: 'Projects',
	},
}

export default function Navbar({ actualPath }: { actualPath: string }) {
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
									className={`group/nav flex items-center lg:hover:text-neutral-800 dark:lg:hover:text-neutral-200 align-middle relative py-1 px-2 m-1 ${actualPath === path ? 'decoration-2' : 'text-neutral-500 dark:text-neutral-400'}`}
									underlined={actualPath === path}
								>
									{name}
								</Link>
							)
						})}
					</div>
					<DarkModeToggleFrontOffice />
				</nav>
			</div>
		</aside>
	)
}
