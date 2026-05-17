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
  { id: "cartograph", title: "Cartograph", year: "2025 →", kind: "App", status: "shipping", blurb: "A note-taking app that grows like a city. Districts, streets, alleys — every note has a place.", stack: ["SwiftUI", "Rust", "CRDT"], color: "#a78bfa", role: "Solo · Design + Engineering", body: ["Cartograph started as a sketch on a napkin in 2022. I wanted a note-taking app that felt less like a database and more like a city — a place I could walk through, where the notes I revisited often were on main streets and the ones I forgot drifted to back alleys.", "The hard problem was making this metaphor functional, not just decorative. Notes had to have a stable position you could come back to, but the position had to evolve as your interests shifted. I ended up with a CRDT-backed graph where edge weights decay over time unless reinforced, and the layout is recomputed nightly. The map you wake up to is yesterday's map, slowly aging.", "I rewrote the rendering engine three times before I was happy with how it felt to pan. The current version is a hand-written Rust crate that does view-frustum culling on the graph and streams tiles to SwiftUI as you move. At one million notes the framerate doesn't budge.", "The app is in private beta. Public launch is targeted for late 2026."], links: [{ label: "cartograph.app", href: "#" }, { label: "Devlog", href: "#" }] },
  { id: "tideline", title: "Tideline", year: "2024", kind: "Tool", status: "shipping", blurb: "A whiteboard that breathes. Realtime collab where the canvas grows and recedes with attention.", stack: ["Canvas", "WebRTC", "Yjs"], color: "#7dd3fc", role: "Tech lead · Team of 3", body: ["Tideline was built during a three-month sabbatical with two friends. We wanted to know what a whiteboard would feel like if the canvas itself were responsive to where people were looking.", "The technical core is straightforward: Yjs for conflict-free shared state, WebRTC for low-latency cursor sync, a fixed-resolution canvas backed by a quadtree for hit-testing. The interesting work was in the interaction layer. Regions of the canvas no one has touched in a while fade and collapse; regions under active edit expand and become more legible. The canvas has a sense of where the room's attention is.", "Shipped to a few thousand teams. Maintained as open source since 2025."], links: [{ label: "tideline.app", href: "#" }, { label: "GitHub", href: "#" }] },
  { id: "inkwell", title: "Inkwell", year: "2024", kind: "Writing", status: "shipping", blurb: "Markdown-first publishing for people who hate publishing software.", stack: ["Astro", "Pandoc"], color: "#fcd34d", role: "Solo", body: ["Inkwell is the static-site generator I built for my own blog after deleting four previous attempts. The rule was: no CMS, no JavaScript on the reader's side, no dependencies older than two years.", "Every post is a markdown file with optional frontmatter. Pandoc handles the rendering; Astro handles the site shell. The build is 200 lines of TypeScript and runs in under a second.", "I open-sourced it after a year of personal use. It powers a small but growing number of writer-blogs."], links: [{ label: "GitHub", href: "#" }] },
  { id: "refrain", title: "Refrain", year: "2023", kind: "Music", status: "paused", blurb: "Sample-based instrument. Records a fragment of the room, loops it, lets you play it back as a chord.", stack: ["WebAudio", "WASM"], color: "#f472b6", role: "Solo · Audio + UI", body: ["Refrain came out of a question: what if the easiest way to make music were not with notes but with the ambient sound of the room you were in?", "You tap to record a one-second fragment — a kettle, a chair scraping, a friend's laugh — and Refrain pitch-shifts that sample across the chromatic scale. A C-major chord becomes the sound of your kitchen at three different pitches at once.", "The audio engine is WASM, the UI is plain HTML and a canvas keyboard. It works on any phone with a microphone.", "Paused while Cartograph takes priority. I'll come back to this."], links: [] },
  { id: "atlas", title: "Atlas", year: "2023", kind: "App", status: "archived", blurb: "Geo-tagged photo journal. Years of travel collapse into a single zoomable map.", stack: ["SwiftUI", "MapKit"], color: "#86efac", role: "Solo", body: ["Atlas was a weekend project that turned into a year. I had ten years of vacation photos on iCloud and no way to see them as a whole. Atlas pulled the GPS coords from the EXIF data and let you zoom from a world view all the way down to a single street corner.", "Built in SwiftUI, used MapKit for the basemap, and a custom clustering layer because the built-in one chokes past a few thousand pins.", "Shelved because Apple's own Photos app shipped a near-identical feature six months after I started. I learned a lot. I don't regret building it."], links: [] },
  { id: "glyph", title: "Glyph", year: "2022", kind: "Library", status: "shipping", blurb: "212 monoline icons for indie devs. Drawn at one weight, scaled by eye.", stack: ["Figma", "SVG"], color: "#fb923c", role: "Solo", body: ["Glyph is an icon set I drew over six months of evenings. The rule was strict: every icon is a single 1.5px line on a 24px grid, no fills, no rounded line caps, no compromises.", "I drew them by eye rather than from a template. You can tell. Each icon has the small inconsistencies of a thing made by a person, which is the point.", "Free under MIT. About four thousand projects use it now, mostly indie tools and personal sites."], links: [{ label: "glyph.icons", href: "#" }, { label: "GitHub", href: "#" }] },
  { id: "tempo", title: "Tempo", year: "2022", kind: "App", status: "shipping", blurb: "Pomodoro with a soft edge. Six ambient rooms, a single button, no streaks.", stack: ["SwiftUI"], color: "#c4b5fd", role: "Solo", body: ["Tempo is a pomodoro timer with one button and no gamification. No streaks, no daily quotas, no nag notifications, no green grid filling up over time.", "Six ambient soundscapes recorded by friends: a Parisian café, a hotel lobby in Tokyo, a library in Edinburgh, a hardware store in Brittany, and two others. Pick one, start, work.", "Quietly profitable. The kind of indie app that pays for itself but doesn't change my life. I love it for that."], links: [{ label: "App Store", href: "#" }] },
  { id: "compass", title: "Compass", year: "2021", kind: "App", status: "archived", blurb: "Yearly goals broken into weekly check-ins. Gentle, not gamified.", stack: ["React Native"], color: "#fda4af", role: "Solo", body: ["Compass was my attempt at a yearly-goals app that wasn't built around streaks or guilt. You set up to five aims for the year, broke each into rough quarterly milestones, and the app asked you one question on Sunday evenings: how did this week go?", "It worked well for me, less well for others. The product was too soft for the market — people who buy goal-setting apps generally want them to be harder, not gentler.", "Archived in 2023. The lessons informed Tempo."], links: [] },
];

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
  { id: "slow-building", title: "On building slowly", date: "Apr 02, 2026", readTime: "8 min", tags: ["craft", "essay"], excerpt: "Three years into Cartograph, I've stopped measuring the project in commits and started measuring it in walks. Here's what changed when I gave up on velocity.", body: ["I used to track my work the way I tracked my running: distance, pace, splits. A commit log was a kind of strava. If I shipped on Monday I felt accomplished by Tuesday; if I didn't I felt restless by Wednesday. Three years into the same project, that arithmetic stopped working.", "The shift started accidentally. I broke my wrist in February and couldn't type for six weeks. What I could do was walk. So I walked, twice a day, and thought about what I was building. By the time my hand healed I had thrown out four months of plans and the project was, somehow, further along than before.", "I now keep two metrics: hours walked thinking about Cartograph, and decisions made. The second is usually zero on any given day. That's the point — most days the right answer is to keep walking. The decisions that survive a fortnight of walking are the ones worth typing.", "I am not making the case that everyone should ship slowly. I am making the case that for some kinds of work — the kind where the medium is a thirty-year project — velocity is a poor proxy for progress, and that the way out is to find the metric that actually correlates with the thing you care about. Mine is steps."] },
  { id: "kyoto-noren", title: "Notes on Kyoto's noren", date: "Mar 15, 2026", readTime: "5 min", tags: ["travel", "design"], excerpt: "The cloth curtains hanging in doorways across Kyoto are an entire language of welcome. I spent a week reading them.", body: ["A noren is a split cloth panel hung in the doorway of a Japanese shop. It signals that the place is open; pulled inside, it signals closed. That's the functional description. The actual function is much stranger.", "I spent a week in Kyoto in November, mostly walking the Nishijin district, mostly photographing noren. Two-panel, three-panel, five-panel. Indigo, persimmon, the unnameable browns. Family crests, dropped strokes of calligraphy, abstract bands of color that mean nothing to a foreigner and everything to a regular.", "The semantics emerged slowly. A long noren reaching almost to the floor: don't come in unless you know what you're doing. A short half-noren: anyone welcome, including the tourist who can't speak. A noren so faded the family crest has dissolved into ghost: we've been here longer than you can imagine, and we don't need to advertise it.", "I came back wanting to design more software like noren. Not a homepage that screams; a cloth panel that whispers, and trusts you to decide whether to push past it."] },
  { id: "left-notion", title: "Why I left Notion", date: "Feb 28, 2026", readTime: "11 min", tags: ["tools", "essay"], excerpt: "Not because of the AI features. Because of what the AI features made obvious about the seven years before them.", body: ["I had used Notion for seven years. Personal notes, company wiki, project tracker, occasional database. I left in January, not because the new AI features broke anything, but because they revealed something that had been true the whole time.", "The AI features assume your notes are documents to be summarized. Mine never were. My notes were a place I went to think, and the thinking happened in the act of typing. A summary of a thinking-process is, by definition, not the thinking; it's the residue of it.", "Once I noticed this, I noticed all the other places where Notion treats notes as artifacts to be managed rather than spaces to be inhabited. The hierarchy of pages. The properties on databases. The richness of formatting. All of it optimized for retrieval, none of it for the act of writing.", "I moved to plain markdown files in a folder. The folder is synced. There is no inbox. There is no template. There is no AI offering to clean up my thoughts. The result, six weeks in, is that I think more clearly. I don't know if this generalizes. I know it generalizes for me."] },
  { id: "hand-rolled-css", title: "The case for hand-rolled CSS", date: "Jan 22, 2026", readTime: "6 min", tags: ["code", "craft"], excerpt: "I removed Tailwind from a project last month and the surprise wasn't how much faster it loaded — it was how much I'd stopped seeing my own designs.", body: ["I'd been using utility-first CSS for four years. Faster to write, harder to break, easier to onboard. All true. What I didn't notice was that I'd stopped reading my own markup.", "When every div carries fifteen class names, the markup reads like a paragraph of license plates. You scan past it. You stop noticing the shape of the document. Which is a problem, because the shape of the document is the design.", "I rewrote a small site in plain CSS — one stylesheet, named selectors, BEM-ish discipline — and the experience was uncanny. I could see my design again. I could read the markup top to bottom and understand the page. Edits became precise instead of probabilistic.", "I am not making a moral argument. Use whatever ships. I am noting that there's a cost to abstraction, and the cost is not measured in bundle size; it's measured in how much you can still see the thing you made."] },
  { id: "reading-cafes", title: "Reading in cafés", date: "Dec 11, 2025", readTime: "4 min", tags: ["personal"], excerpt: "An incomplete map of the eleven cafés in the 11th where I've finished a book.", body: ["Some books need a quiet room. Most don't. Most books are best read in a café you know well enough that you can find the bathroom without looking up, with enough background hum that your brain stops trying to listen and starts working.", "Here is the incomplete list. Le Progrès, where I finished Stoner. Café Mericourt, where I finished Open City. Boot, where I finished four Le Carrés in a row over a wet October. La Fée Verte, where I tried twice to finish Anna Karenina and failed both times.", "I have a theory that there's a single optimal table per café and you only know it after the fourth visit. Mine is always near a window, never against a wall, and always within reach of the espresso machine, because the sound is part of the experience.", "If you visit Paris and want a reading café, I will tell you. If you visit and want to write, I will tell you a different list. They overlap by only one."] },
  { id: "constraints", title: "Designing with constraints", date: "Nov 04, 2025", readTime: "9 min", tags: ["design", "essay"], excerpt: "A six-week project where I gave myself one font, two colors, and no JavaScript. What survived.", body: ["Last fall I gave myself an exercise: design a brochure-style site under three constraints. One typeface only. Two colors only, including the background. No JavaScript on the page.", "The first week was miserable. Every instinct said reach for a second font, sprinkle accents, animate the headline on scroll. I had to keep reminding myself that the constraints weren't the obstacle — the constraints were the project.", "By week three the constraints started doing the work. With one font, hierarchy had to come from size and weight alone, which meant every element had to earn its position. With two colors, contrast became precious. With no JS, every interaction had to come from the structure of the document, which forced me to design the structure first.", "The site is still up. It loads in 80ms. I look at it more than I look at most of my work. The lesson is the one everyone repeats but few actually live with: constraints don't reduce the design space, they reveal it. The thing you cared about was always in there. The constraints just clear away enough noise for you to see it."] },
  { id: "shipping-nothing", title: "What I learned shipping nothing", date: "Sep 18, 2025", readTime: "7 min", tags: ["essay"], excerpt: "I spent the summer of 2025 writing code I deleted on Friday. A report on the most productive months of my year.", body: ["Between June and August I shipped nothing. No releases, no posts, no client work. I wrote code five days a week and on Friday I git-reset-ed the week. By design.", "I was trying to figure out what Cartograph wanted to be. The only way I knew how to think about that was to build small versions of it and watch myself use them. Most of them were wrong. The right ones I rebuilt the following week, with more care, and discarded again on Friday.", "The trick was that nothing was ever production. There was no rollout. There were no users besides me. The fear of being wrong vanished, and with it vanished most of the anxiety that had been clouding the design.", "By September I had three sketches I trusted. I rebuilt one of them slowly through the fall and it's now the shape of Cartograph's main view. The other two are still on disk. I'll get to them. I am, for the first time in years, not in a hurry."] },
  { id: "journaling", title: "Three years of journaling", date: "Aug 02, 2025", readTime: "10 min", tags: ["personal", "craft"], excerpt: "Every morning, 600 words, no exceptions. The patterns that emerged from 657 days of doing the same small thing.", body: ["I started journaling in late 2022. Six hundred words, every morning, before email, before phone. Three years and six hundred and fifty-seven entries later, here is what I notice.", "The first thing is that I lie less to myself. The second thing is that the lying I do is more specific and easier to catch. The third thing — and this surprised me — is that I have stopped expecting the journal to produce insights. It produces a record. The insights are downstream, and they show up weeks later, in conversations or in the shower, never on the page.", "The mechanical details matter. I write longhand on the worst paper I can find. I never re-read. I number every page in the corner. When I finish a notebook I put it on a shelf I rarely open. The objects are an archive, not a library.", "If you are considering doing this, the advice that worked for me is: do it badly, for long enough that doing it becomes invisible. The day you forget you're journaling is the day journaling starts to work."] },
];

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
  { id: "indep-26", when: "2026 →", role: "Independent", where: "Saint-Brieuc", kind: "self", blurb: "Building Cartograph full-time. Taking on one design consult per quarter.", stack: ["SwiftUI", "Rust"] },
  { id: "linear", when: "2024 — 2025", role: "Design Lead", where: "Linear", kind: "role", blurb: "Led the redesign of the issue model and shipped the keyboard-first command surface. Hired four designers.", stack: ["Product", "Systems"] },
  { id: "shopify", when: "2022 — 2024", role: "Senior Product Designer", where: "Shopify", kind: "role", blurb: "Checkout team. Rewrote the address form used by 4M+ buyers/week. Shipped the first dark mode.", stack: ["Polaris", "A/B"] },
  { id: "cartograph-v1", when: "2020 — 2022", role: "Founder", where: "Cartograph (v1)", kind: "self", blurb: "Solo-founded the first version. 12k users, no investment, eventually shelved to start over.", stack: ["Electron"] },
  { id: "apple", when: "2018 — 2020", role: "Designer", where: "Apple", kind: "role", blurb: "Human Interface team. Worked on Notes and Reminders. Filed two patents I cannot describe.", stack: ["HI"] },
  { id: "school", when: "2014 — 2018", role: "B.A. Design", where: "ENSCI — Les Ateliers, Paris", kind: "edu", blurb: "Studied industrial design. Wrote my thesis on the typography of train tickets.", stack: [] },
];

for (let i = 0; i < EXPERIENCES.length; i++) {
  const e = EXPERIENCES[i];
  await db.execute({
    sql: `INSERT OR REPLACE INTO experiences (id, "when", role, "where", kind, blurb, stack, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [e.id, e.when, e.role, e.where, e.kind, e.blurb, JSON.stringify(e.stack), i],
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
