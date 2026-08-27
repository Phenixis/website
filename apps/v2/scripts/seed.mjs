// Run: node --env-file=.env.local scripts/seed.mjs
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await db.batch([
  `CREATE TABLE IF NOT EXISTS projects (
    id         TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    year       TEXT NOT NULL,
    kind       TEXT NOT NULL,
    status     TEXT NOT NULL,
    blurb      TEXT NOT NULL,
    body       TEXT NOT NULL,
    stack      TEXT NOT NULL,
    color      TEXT NOT NULL,
    role       TEXT,
    links      TEXT,
    sort_order INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS posts (
    id         TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    date       TEXT NOT NULL,
    read_time  TEXT NOT NULL,
    tags       TEXT NOT NULL,
    excerpt    TEXT NOT NULL,
    body       TEXT NOT NULL,
    published  INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS experiences (
    id         TEXT PRIMARY KEY,
    "when"     TEXT NOT NULL,
    role       TEXT NOT NULL,
    "where"    TEXT NOT NULL,
    kind       TEXT NOT NULL,
    blurb      TEXT NOT NULL,
    stack      TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS profile (
    id       INTEGER PRIMARY KEY DEFAULT 1,
    name     TEXT NOT NULL,
    handle   TEXT NOT NULL,
    tagline  TEXT NOT NULL,
    location TEXT NOT NULL
  )`,
], "write");

// Add published column to posts if it doesn't exist (for existing DBs)
try {
  await db.execute("ALTER TABLE posts ADD COLUMN published INTEGER DEFAULT 1");
} catch {
  // column already exists
}

console.log("✓ Schema created");

const PROJECTS = [
  { id: "life-os", title: "Life OS", year: "2025 →", kind: "App", status: "shipping", blurb: "A personal productivity system built around an Eisenhower-matrix task manager that re-scores urgency every day.", stack: ["Next.js", "Stripe"], color: "#a78bfa", role: "Solo · Design + Engineering", body: ["I'd been juggling Notion, then Obsidian, to manage tasks, projects, notes, calendars, movies to watch, books to read, habits and expenses. Notion felt slow and limiting; Obsidian was fast and plugin-powered but kept everything local, with no real way to centralize data across notes. What I actually wanted was one place for every running project and task, so I decided to build it myself.", "The first version was a hidden page in this portfolio: a task manager based on the Eisenhower Matrix. Each task gets a due date, importance and estimated duration, and a formula recomputes urgency every day so the list is always sorted by what matters most right now — tasks due within three days turn orange.", "I loved building it enough to keep going: a note manager, a movie and series tracker, a configurable AI chat to help with work, and more. As I talked about it with friends and family, I realized the system could be useful to others too, so I turned it into a product for people who want one centralized system instead of thirty-six different apps — Life OS, for 'Life Operating System.'", "The first public version launched on October 25th, 2025, on Product Hunt — 7 upvotes, rank 59 for the day, and a slow trickle of real signups since."], links: [{ label: "life-os.xyz", href: "https://life-os.xyz/" }] },
  { id: "metro-railway-emulator", title: "Metro Railway Emulator", year: "2025", kind: "Tool", status: "archived", blurb: "A simulation of multiple trains running on separate tracks with their own control signals, built for cyber-attack training.", stack: ["OT Security"], color: "#fcd34d", role: "Intern · Cyber Innovation Hub", body: ["Built during my internship at the Cyber Innovation Hub in Cardiff (April–June 2025), this project emulates a metro railway network — multiple trains running on separate tracks with their own control signals — so trainees can practice attacking and defending an operational-technology system without touching a real one.", "It's in a similar spirit to the GRFICS work I did earlier that internship: simulate a realistic industrial system with real vulnerabilities, let a trainee play attacker, and use what breaks to teach them how to spot and close the same gaps in a real network."], links: [] },
  { id: "multi-vlc", title: "Multi-vlc", year: "2025", kind: "Tool", status: "archived", blurb: "A small web app to pause, play, mute and control multiple VLC instances at once, built for the CIH's 8-screen presentation wall.", stack: ["VLC RC", "JavaScript"], color: "#86efac", role: "Intern · Cyber Innovation Hub", body: ["The Cyber Innovation Hub's presentation room has 8 interconnected screens that can show up to 8 different projects at once. During pitches, my supervisor had to wait for each looping video to reset before presenting the next project — there was no way to pause, start or mute them from one place.", "Each screen runs on its own Arduino driving a VLC instance on a repeating playlist. VLC has a 'Remote Control' (RC) interface built for exactly this, so instead of building something from scratch, I forked an existing proof-of-concept — a simple web app that talked to VLC over its HTTP interface — and rebuilt it properly.", "I switched it to the more reliable RC interface, made the web UI more responsive with playback-speed controls, added the ability to control several instances at once instead of one by one, and added a priority queue so simultaneous commands run in the right order.", "The whole thing took about two days. It's still open source and in use whenever the team pitches to visitors."], links: [{ label: "GitHub (fork)", href: "https://github.com/Phenixis/multi-vlc" }] },
  { id: "boilerplate.md", title: "Boilerplate.md", year: "2024 →", kind: "Library", status: "shipping", blurb: "My personal Next.js SaaS boilerplate — auth, dashboard, billing and settings solved once so I stop rebuilding them for every new project.", stack: ["Next.js", "Tailwind CSS", "Stripe"], color: "#60a5fa", role: "Solo", body: ["I discovered indie hacking in summer 2024 through Marc Louvion's YouTube channel and loved the idea of building and shipping products solo, without funding. His biggest success, Shipfast, is a Next.js/Tailwind SaaS boilerplate with thousands of customers — I didn't fully get why it worked at first, but the idea stuck.", "A few weeks later I built my first app, Wisecart, and quickly noticed I was rebuilding the same features — auth, dashboard, settings, billing — for every new project. That's when the value of a boilerplate clicked.", "I forked Vercel's 'SaaS Starter' template and turned it into my own boilerplate: a solid base with the essentials already wired up, so I can focus on the feature that's actually new. I named it 'Boilerplate.md' after my initials.", "It isn't a standalone product I actively market — it grows as a byproduct of my other projects. Building Wisecart added role and permission management; building Life OS improved dark mode and Stripe subscription handling. Both fed back into the boilerplate. It's one of the bonuses included with my courses, which is the only way I distribute it."], links: [{ label: "boilerplate.maximeduhamel.com", href: "https://boilerplate.maximeduhamel.com/" }] },
  { id: "wisecart", title: "Wisecart", year: "2024", kind: "App", status: "archived", blurb: "A shopping-list app: pick the meals you'll cook this week and it builds the list for you. My first shipped app.", stack: ["Next.js", "Tailwind CSS", "React"], color: "#34d399", role: "Solo", body: ["I worked on Wisecart between September and December 2024, right after discovering indie hacking. I had no idea what to build, so I looked at my own problem: I kept forgetting items at the shop and never knew what to cook for dinner.", "I learned Next.js, Tailwind CSS and React to build it, working on it every day before and after class. In mid-October I found Vercel's 'SaaS Starter' boilerplate, forked it, rebuilt the app on top of it, and shipped a working version at wisecart.app in early December.", "Looking back, the app itself is rough — too wide, a loading flash before the landing page, a flat design. But it solved my actual problem and it was my first real shipped product, which mattered more than the polish.", "Wisecart is discontinued: I'm folding a better version of it into Life OS instead of maintaining it separately."], links: [{ label: "wisecart.app", href: "https://wisecart.app" }] },
];

await db.execute("DELETE FROM projects");

for (let i = 0; i < PROJECTS.length; i++) {
  const p = PROJECTS[i];
  await db.execute({
    sql: `INSERT OR REPLACE INTO projects (id, title, year, kind, status, blurb, body, stack, color, role, links, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [p.id, p.title, p.year, p.kind, p.status, p.blurb, JSON.stringify(p.body), JSON.stringify(p.stack), p.color, p.role ?? null, p.links?.length ? JSON.stringify(p.links) : null, i],
  });
}
console.log(`✓ Seeded ${PROJECTS.length} projects`);

const POSTS = [
  { id: "the-launch-of-life-os", title: "The launch of Life OS.", date: "Nov 12, 2025", readTime: "6 min", tags: ["life-os", "launch"], excerpt: "A summary of the launch of Life OS, my personal productivity system, with the numbers, what I learned and how I feel about it.", body: ["October 25th, 2025: it's Saturday, I wake up with one idea in mind — it's time to launch Life OS. I'd started building it for myself in early 2025 because I couldn't find a productivity system that worked for me, then kept building for almost a year without making it public.", "That Saturday I fixed as many bugs as I could, wrote my Product Hunt description, and shipped. It felt like the first time the project had felt ready — proud even before the first user subscribed.", "The launch didn't explode: 7 upvotes and rank 59 on Product Hunt's daily leaderboard, and only 11 visitors from Vercel analytics came directly from that click. The tagline — 'Your AI-powered operating system for a cluttered life' — probably worked against it: it implies leaving your OS, sounds like every other 'AI-powered' product, and asks people to first admit their life is cluttered before they'll even look.", "The real traction came from Reddit. I posted on r/roastmystartup and it picked up nearly 3,800 views and a handful of comments, including one detailed, blunt review: broken demo video, confusing signup flow, an unconvincing free plan, and note-taking that needed real work.", "That review stung but was fair — I'd put more effort into the paid plan than the free one, which is backwards. It also pointed at something invisible I was proud of: optimistic UI updates, where the app reacts instantly to an action (create, edit, delete a task) before the server confirms it, then rolls back if the server says no — like celebrating a goal before the referee confirms it. Nobody notices it when it works, which is exactly the point."] },
  { id: "what-should-i-focus-on-when-making-software", title: "What Subject Should I Focus On When Making Software?", date: "Mar 09, 2025", readTime: "2 min", tags: ["indie hacking", "essay"], excerpt: "I'm a software developer, I build software around my interests. I'm not the most skilled software developer, so if I'm building an application for developers, it might not be as polished as what others are creating. So, what subject should I focus on when making software?", body: ["I'm a software developer who builds around my own interests: Wisecart came from a shopping-list problem, my boilerplate from rebuilding the same app foundations, and since early 2025 I've been posting on YouTube, which pushed me toward a new project focused on improving scripts. The problem is I'm not the most skilled developer, so a polished, competitive app isn't really my lane — so what should I actually focus on?", "This is a common problem. Builders like Marc Louvion ship developer tools — Datafast, Shipfast — and do well, but a lot of that success comes from personal brand and community as much as the product itself, and those tools compete in crowded fields against the likes of Plausible or Google Analytics.", "The way out is areas like finance, sports or productivity, where any competent developer can build something genuinely useful for a general audience instead of fighting for a sliver of a competitive niche. Finary is the example that stuck with me — a finance app I'd actually subscribe to, mostly because of how well its personal branding on YouTube built trust.", "So my plan now is to bring my skills to low-competition areas — dressing, nutrition, productivity, motivation, personal management — not to avoid competition for its own sake, but to be early enough somewhere to actually make a difference. The bar stays the same either way: build something useful enough that I'd use it myself."] },
  { id: "why-im-doing-this", title: "Why I Started Indie Hacking", date: "Feb 12, 2025", readTime: "4 min", tags: ["indie hacking", "essay"], excerpt: "Why do we see goals of making money everywhere in the Indie Hacking space, what is the problem with these goals and what are my goals.", body: ["Since discovering indie hacking in September 2024, I've followed a lot of creators, and they share one obvious motivation: money. $10k MRR, a $500k salary, a 7-figure valuation — these numbers are everywhere, partly because they're an easy way for an audience to follow your journey and root for you.", "But chasing those numbers for validation creates a vicious circle: hit 1k MRR, feel validated, need 2k MRR to feel it again. And most people sharing these goals talk about what the money buys — cars, a bigger house — which is exciting but isn't actually what motivates me.", "What actually gets me up in the morning is more internal: helping my parents. I grew up in a poor-to-middle-class family, and even with a happy childhood, I feel it's my responsibility to make their lives easier. That kind of motivation holds up on the bad days in a way that external goals don't — you can give up a lot of things, but not that.", "This is why I build startups, write here, and make videos: not to hit a number, but because of what backs it. External motivations still matter — you need to want the car, the house, the lifestyle to find the extra effort — but they can't be the whole engine. Find what's underneath them, and you'll have something to pull from when the external reasons stop being enough."] },
];

await db.execute("DELETE FROM posts");

for (let i = 0; i < POSTS.length; i++) {
  const p = POSTS[i];
  await db.execute({
    sql: `INSERT OR REPLACE INTO posts (id, title, date, read_time, tags, excerpt, body, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [p.id, p.title, p.date, p.readTime, JSON.stringify(p.tags), p.excerpt, JSON.stringify(p.body), i],
  });
}
console.log(`✓ Seeded ${POSTS.length} posts`);

const EXPERIENCES = [
  { id: "iut-lannion", startDate: "2023-09", endDate: "2026-08", role: "BUT Informatique", where: "IUT de Lannion", kind: "edu", blurb: "Computer science degree, run alongside the work-study contract and internship below.", stack: [] },
  { id: "work-study", startDate: "2025-09", endDate: null, role: "Junior Developer (Work-Study)", where: "Nutraveris", kind: "role", blurb: "Building automated E2E test suites and a reusable form-testing architecture for Nutraveris's web applications, alternating between university and on-site work.", stack: ["Playwright", "TypeScript"], parentId: "iut-lannion" },
  { id: "cyber-innovation-hub", startDate: "2025-04", endDate: "2025-06", role: "Cybersecurity Intern", where: "Cyber Innovation Hub, Cardiff", kind: "role", blurb: "A 10-week internship on cybersecurity in Operational Technology — industrial-control simulations, PLCs, Modbus and Wireshark — including the GRFICS and Cardiff Metro Railway Emulator training environments.", stack: ["OT Security", "ProxMox"], parentId: "iut-lannion" },
];

await db.execute("DELETE FROM experiences");

for (let i = 0; i < EXPERIENCES.length; i++) {
  const e = EXPERIENCES[i];
  await db.execute({
    sql: `INSERT OR REPLACE INTO experiences (id, start_date, end_date, role, "where", kind, blurb, stack, sort_order, parent_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [e.id, e.startDate, e.endDate, e.role, e.where, e.kind, e.blurb, JSON.stringify(e.stack), i, e.parentId ?? null],
  });
}
console.log(`✓ Seeded ${EXPERIENCES.length} experiences`);

await db.execute({
  sql: `INSERT OR REPLACE INTO profile (id, name, handle, tagline, location)
        VALUES (1, ?, ?, ?, ?)`,
  args: ["Maxime Duhamel", "@maxime", "Designer & builder. Lives in Saint-Brieuc, thinks in margins.", "Saint-Brieuc · 48.51, -2.77"],
});
console.log("✓ Seeded profile");

db.close();
console.log("Done.");
