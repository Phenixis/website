import Link from "next/link"

export const colorVariants = {
    "blue": {
        "background": "bg-blue-300/10 dark:bg-blue-300/20",
        "image": "bg-blue-300/50",
        "border": "border border-blue-300/90 lg:border-blue-300/10 lg:dark:border-blue-300/20 lg:hover:border-blue-300/90"
    },
    "green": {
        "background": "bg-green-300/10 dark:bg-green-300/20",
        "image": "bg-green-300/50",
        "border": "border border-green-300/90 lg:border-green-300/10 lg:dark:border-green-300/20 lg:hover:border-green-300/90"
    },
    "red": {
        "background": "bg-red-300/10 dark:bg-red-300/20",
        "image": "bg-red-300/50",
        "border": "border border-red-300/90 lg:border-red-300/10 lg:dark:border-red-300/20 lg:hover:border-red-300/90"
    },
    "yellow": {
        "background": "bg-yellow-300/10 dark:bg-yellow-300/20",
        "image": "bg-yellow-300/50",
        "border": "border border-yellow-300/90 lg:border-yellow-300/10 lg:dark:border-yellow-300/20 lg:hover:border-yellow-300/90"
    },
    "purple": {
        "background": "bg-purple-300/10 dark:bg-purple-300/20",
        "image": "bg-purple-300/50",
        "border": "border border-purple-300/90 lg:border-purple-300/10 lg:dark:border-purple-300/20 lg:hover:border-purple-300/90"
    },
    "orange": {
        "background": "bg-orange-300/10 dark:bg-orange-300/20",
        "image": "bg-orange-300/50",
        "border": "border border-orange-300/90 lg:border-orange-300/10 lg:dark:border-orange-300/20 lg:hover:border-orange-300/90"
    }
}

export const states = ["Running", "Building", "Idea", "Built", "Sold", "Discontinued"]

export default function Project({
    name,
    description,
    color,
    state
}: {
    name: string,
    description: string,
    color: keyof typeof colorVariants,
    image?: string
    state: typeof states[number]
}) {
    return (
        <Link href={`/blog/${name.replace(/ /g, '_')}`}>
            <div className={`size-full p-4 rounded-md duration-1000 flex flex-col md:items-center md:flex-row space-x-0 md:space-x-2 selection:${colorVariants[color].image} ${colorVariants[color].background} ${colorVariants[color].border}`}>
                <div className="w-full md:w-[100px] tabular-nums shrink-0">
                    <div className={`text-xs p-1 rounded-md w-fit md:mx-auto ${colorVariants[color].image}`}>
                        {state}
                    </div>
                </div>
                <div>
                    <h3 className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                        {name}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 tracking-tight">
                        {description}
                    </p>
                </div>
            </div>
        </Link >
    )
}