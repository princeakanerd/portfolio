export const person = {
  first: "Prince",
  last: "Gajnani",
  role: "Software Engineer",
  /* Keep the prose here describing how he works, never a named project —
     projects come and go from the index, this copy shouldn't move with them. */
  tagline: "I build systems that stay fast when they stop being small.",
  taglineSupport:
    "Backend services, real-time infrastructure, and the interfaces that sit on top of them.",
  location: "Gwalior, India",
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST · GMT+5:30",
  email: "princegajnani7@gmail.com",
  phone: "+91 94846 60222",
  /* Served straight from /public — no CDN, no expiring share link. */
  resume: "/Prince-Gajnani-Resume.pdf",
  links: {
    github: "https://github.com/princeakanerd",
    linkedin: "https://www.linkedin.com/in/prince-gajnani-145a40256/",
    leetcode: "https://leetcode.com/u/yaatri",
    codeforces: "https://codeforces.com/profile/princeakanerd",
    codechef: "https://www.codechef.com/users/princegajnani7",
  },
  /* *Starred* phrases are the ones the About section lights up in ember. */
  intro: [
    "Dual-degree B.Tech + M.Tech at IIIT Gwalior. I work in the layer where *correctness* meets *throughput*.",
    "Anything works at n = 10. I want to know what it *costs* — under concurrency, at the *p99*, when the traffic is real.",
    "Competitive programming taught me *the algorithms*. Production taught me *what they cost*.",
  ],
};

export const roleMarquee = [
  "Rust",
  "Distributed Systems",
  "Low-Latency Engineering",
  "React",
  "Node.js",
  "PostgreSQL",
  "Redis Streams",
  "Kubernetes",
  "Competitive Programming",
];

export type Project = {
  index: string;
  slug: string;
  title: string;
  year: string;
  kind: string;
  quote: string;
  summary: string;
  bullets: string[];
  stack: string[];
  href?: string;
  accentAngle: number;
};

export const projects: Project[] = [
  {
    index: "01",
    slug: "matching-engine-analyser",
    title: "Matching Engine Analyser",
    year: "2026",
    kind: "Systems · Rust",
    quote: "Latency is a distribution, not a number.",
    summary:
      "A concurrent trading-engine benchmarking platform that auto-builds submissions inside isolated Docker containers, stress-tests them over raw TCP, and grades what actually happens in the tail.",
    bullets: [
      "Built in Rust on Tokio and Actix-Web, grading submissions inside isolated Docker containers behind a semaphore-bounded job queue.",
      "Three-phase pipeline — correctness, sustained throughput, then burst — driving a 100K+ order async bot fleet over TCP.",
      "Scores p50/p90/p99 tail latency and throughput into a single composite, so a fast average can't hide a slow tail.",
      "Live leaderboard over Server-Sent Events with Redis persistence, shipped via Docker Compose and Kubernetes.",
    ],
    stack: ["Rust", "Tokio", "Actix-Web", "Docker", "Kubernetes", "Redis", "TCP"],
    href: "https://github.com/princeakanerd/Matching-Engine-Analyser",
    accentAngle: 34,
  },
  {
    index: "02",
    slug: "clubsphere",
    title: "ClubSphere",
    year: "2025",
    kind: "Full-stack · MERN",
    quote: "A campus runs on coordination, not on features.",
    summary:
      "A club management platform for an entire college — ten API modules, a real approval workflow, and an AI layer that answers the questions nobody wants to answer twice.",
    bullets: [
      "10+ RESTful modules covering clubs, events, posts, messaging and notifications, with a role-based join-request approval workflow.",
      "JWT auth, real-time Socket.io messaging and notifications, Cloudinary media uploads, and cron-driven event reminders.",
      "AWS Bedrock (Claude Haiku) powering chatbot support and personalised event recommendations.",
      "Backend tuned with Redis caching, database indexing, pagination and rate limiting to hold latency under load.",
    ],
    stack: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.io",
      "AWS Bedrock",
      "Redis",
      "Tailwind",
    ],
    href: "https://github.com/princeakanerd/club",
    accentAngle: 128,
  },
];

export const experience = [
  {
    period: "Apr 2026 — Jun 2026",
    role: "DSA Mentor",
    org: "AlgoZenith",
    place: "Remote",
    points: [
      "Mentored students in data structures and algorithms, guiding them through problem-solving approaches, complexity analysis and competitive programming practice.",
    ],
  },
  {
    period: "May 2025 — Jul 2025",
    role: "Software Engineer Intern",
    org: "B.P Technologies",
    place: "Remote",
    points: [
      "Engineered a distributed task scheduler in Node.js sustaining 5,000+ jobs per minute, using Redis Streams with consumer groups for fault-tolerant background processing.",
      "Restructured the transaction-logging PostgreSQL schema with covering and partial indexes plus CTEs, cutting query latency on historical retrieval.",
      "Built a React monitoring dashboard that renders 10,000+ live log entries without blocking the UI thread, via chunked streaming and DOM virtualization.",
    ],
  },
  {
    period: "2024 — 2025",
    role: "Vice Chairman, IEEE Students Branch",
    org: "IIITM Gwalior",
    place: "Gwalior, India",
    points: [
      "Led the IEEE Students Branch core team for a full year, planning and running technical workshops, coding events and community initiatives.",
    ],
  },
];

export const skillGroups = [
  {
    title: "Languages",
    items: ["C++", "Rust", "JavaScript", "TypeScript", "C", "SQL", "Python"],
  },
  {
    title: "Frameworks",
    items: [
      "React.js",
      "Node.js",
      "Express.js",
      "Actix-Web",
      "Tokio",
      "Tailwind CSS",
      "REST APIs",
      "WebSockets",
    ],
  },
  {
    title: "Data",
    items: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Mongoose"],
  },
  {
    title: "Infra",
    items: ["Docker", "Kubernetes", "AWS S3", "AWS Bedrock", "Git", "Postman"],
  },
  {
    title: "Core CS",
    /* Rendered as the emphasised row in Path & toolkit. */
    highlight: true,
    items: [
      "Data Structures & Algorithms",
      "Operating Systems",
      "Computer Networks",
      "DBMS",
      "System Design",
      "Distributed Systems",
      "Graph Theory",
      "Compiler Design",
      "Computer Organisation & Architecture",
    ],
  },
];

export const stats = [
  { value: 1900, suffix: "+", label: "DSA & CP problems solved" },
  { value: 2000, suffix: "+", label: "LeetCode rating · Knight" },
  { value: 398, prefix: "#", label: "ICPC 2025 preliminary rank" },
  { value: 50, prefix: "Top ", label: "of 400,000 · Google Big Code" },
];

export const achievements = [
  {
    tag: "Hackathon",
    title: "Google Big Code 2026",
    detail: "Selected as a finalist out of 400,000 participants.",
    weight: "lg" as const,
    figure: "Top 50",
    figureLabel: "out of 400,000",
  },
  {
    tag: "ICPC",
    title: "ICPC 2025",
    detail: "Preliminary rounds.",
    weight: "sm" as const,
    figure: "#398",
  },
  {
    tag: "LeetCode",
    title: "Knight badge",
    detail: "Top 2.53% globally.",
    weight: "sm" as const,
    figure: "2000+",
    href: person.links.leetcode,
  },
  {
    tag: "GATE CSE",
    title: "Qualified twice",
    detail: "AIR 2472 in 2026 · AIR 6858 in 2025.",
    weight: "md" as const,
    figure: "AIR 2472",
  },
  {
    tag: "Codeforces",
    title: "Specialist",
    detail: "Peak rating 1500+.",
    weight: "third" as const,
    figure: "1500+",
    href: person.links.codeforces,
  },
  {
    tag: "CodeChef",
    title: "Four-star coder",
    detail: "Competitive rating.",
    weight: "third" as const,
    figure: "4★",
    href: person.links.codechef,
  },
  {
    tag: "IICPC Codefest 2026",
    title: "Preliminary round",
    detail: "Among top intercollegiate participants.",
    weight: "third" as const,
    figure: "#870",
  },
];

/* Each entry is a ball in the Sports arena; `result` is printed on it. */
export const sports = [
  {
    event: "Squash",
    /* Printed on the ball itself: headline + one context line. */
    ball: { head: "4× Gold", sub: "Inter-IIIT · 22–26" },
    meet: "Inter-IIIT Sports Meet",
    result: "4×",
    note: "Gold · 2022 — 2026",
    story: "Gold at the Inter-IIIT Sports Meet four seasons running, from 2022 through 2026.",
    medal: "gold" as const,
    streak: 4,
  },
  {
    event: "Table Tennis",
    /* Printed on the ball itself: headline + one context line. */
    ball: { head: "Silver", sub: "Inter-IIIT · 2025" },
    meet: "Inter-IIIT Sports Meet",
    result: "2nd",
    note: "Silver · 2025",
    story: "Silver medal at the Inter-IIIT Sports Meet in 2025.",
    medal: "silver" as const,
  },
  {
    event: "Badminton",
    /* Printed on the ball itself: headline + one context line. */
    ball: { head: "U13", sub: "Gujarat · State" },
    meet: "Gujarat · State level",
    result: "U13",
    note: "State player",
    story: "Played state-level badminton for Gujarat in the under-13 category.",
  },
  {
    event: "Trekking",
    /* Printed on the ball itself: headline + one context line. */
    ball: { head: "17,000 ft", sub: "Summited ×2" },
    meet: "High altitude · Twice",
    result: "17,000 ft",
    note: "Above 17,000 ft ×2",
    story: "Two high-altitude treks that topped out above 17,000 feet.",
  },
  {
    event: "Marathon",
    /* Printed on the ball itself: headline + one context line. */
    ball: { head: "42.2 km", sub: "Full distance" },
    meet: "Full distance",
    result: "42.2 km",
    note: "Finished",
    story: "Ran a full marathon — every one of the 42.195 km.",
  },
];
