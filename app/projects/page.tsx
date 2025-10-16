import {Tooltip, TooltipContent, TooltipTrigger,} from "@/components/ui/tooltip"
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible"
import {ChevronDown} from "lucide-react"
import Project, {states} from "@/components/big/project"
import {getProjects} from "@/app/blog/utils"


export default async function Page() {
    const projectsList = await getProjects()

    return (
        <section className="page space-y-4">
            <h1 className="page-title">
                My Projects
            </h1>
            <Collapsible
                className="group/collapsible duration-1000 border-2 border-transparent data-[state=open]:border-gray-200 data-[state=open]:dark:border-gray-100/25 data-[state=closed]:dark:lg:hover:bg-slate-100/25 data-[state=closed]:lg:hover:bg-gray-200 rounded-md p-2">
                <CollapsibleTrigger className="flex justify-between items-center gap-4 w-full cursor-pointer">
                    <p className="text-left">
                        I build web applications since Septembre 2024, but my journey started a long time ago...
                    </p>
                    <ChevronDown
                        className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"/>
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col space-y-4">
                    <p className="mt-4">
                        My first ever &quot;technological invention&quot; was born in 2021. I was using the Google Drive
                        application to synchronize a large number of files (1000~2000) between my computer and my phone.
                    </p>
                    <p>
                        With such number of files, errors happenned often and Google Drive displayed them one by one for
                        each file. There was no option for ignoring every errors, so I had to delete them one. by. one.
                    </p>
                    <p>
                        As I was learning how to code in Python, I decided that I would build a small program that would
                        do it for me. There was no API so I used the graphical interface. I searched for a library to
                        move the mouse to click on the 3 dots button, click on &quot;Delete&quot; and start again for
                        the next error.
                    </p>
                    <Tooltip>
                        <p>
                            It took me probably a full afternoon to build the program from A to Z, but I had a problem,
                            and I built something to solve it. Since then, the{' '}
                            <TooltipTrigger className=" inline-block underline cursor-default">
                                producer mindset
                            </TooltipTrigger>
                            <TooltipContent>
                                In opposition with the &quot;consumer&quot; mindset, producters build the solution to
                                their problems instead of buying them.
                            </TooltipContent>
                            {' '}has a little place in a corner of my mind.
                        </p>
                    </Tooltip>
                    <p>
                        That&apos;s why to this day, I build my own solutions to my problems, and here are the solutions
                        I built.
                    </p>
                </CollapsibleContent>
            </Collapsible>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {projectsList.sort(
                    (a, b) => {
                        const stateA = states.indexOf(a.metadata.state as typeof states[number])
                        const stateB = states.indexOf(b.metadata.state as typeof states[number])
                        return stateA - stateB
                    }
                ).map((project) => {
                    return (
                        <Project key={project.metadata.title} project={project}/>
                    )
                })}
            </div>
        </section>
    )
}