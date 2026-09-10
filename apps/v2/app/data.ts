export type Project = {
  id: string;
  title: string;
  year: string;
  kind: string;
  status: "shipping" | "paused" | "archived";
  blurb: string;
  body: string[];
  stack: string[];
  color: string;
  role?: string;
  links?: { label: string; href: string }[];
  published?: boolean;
  /** "main" for Main Projects, "side" for Side Quests. Defaults to "main". */
  category?: "main" | "side";
};

export type Post = {
  id: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  body: string[];
  published?: boolean;
};

export type Experience = {
  id: string;
  /** "YYYY-MM" */
  startDate: string;
  /** "YYYY-MM", or null if ongoing */
  endDate: string | null;
  role: string;
  where: string;
  kind: "self" | "role" | "edu";
  blurb: string;
  stack: string[];
  published?: boolean;
  /** id of another experience this one runs alongside (e.g. a work-study or
   *  internship happening during a longer degree) — renders nested under it. */
  parentId?: string;
};

export type Profile = {
  name: string;
  handle: string;
  tagline: string;
  location: string;
  github?: string;
  linkedin?: string;
};

export const PROFILE: Profile = {
  name: "Maxime Duhamel",
  handle: "@maxime",
  tagline: "Designer & builder. Lives in Saint-Brieuc, thinks in margins.",
  location: "Saint-Brieuc · 48.51, -2.77",
  github: "https://github.com/Phenixis/",
  linkedin: "https://www.linkedin.com/in/maxime-duhamel-b07a71251/",
};
