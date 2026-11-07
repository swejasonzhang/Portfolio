/**
 * Every word of career content on the site. Facts match the résumé
 * (resume-src/content.js) and were checked against the repositories on
 * 2026-10-12. Metrics rewritten 2026-11-06: results, not commit, pull
 * request or test counts. Change them together.
 */

export type Link = { label: string; href: string };

export const inkmity = {
  name: "Inkmity",
  meta: "Founder · 2025 – now",
  badge: "Live",
  line: "A booking app for independent New York tattoo artists: one link in an Instagram bio takes the booking, signed waiver and card deposit.",
  part: "Built the first version myself, including a Stripe deposit that counts as paid only when Stripe's signed webhook confirms it; since June 2026 I direct Claude Code and hand-test every release.",
  tags: ["React", "TypeScript", "Node.js", "MongoDB", "Stripe"],
  image: { src: "/assets/Inkmity.webp", alt: "Inkmity's live landing page: the headline, a new booking request, a held deposit and a signed waiver" },
  links: [{ label: "inkmity.com", href: "https://inkmity.com/" }] as Link[],
  note: "Source private",
  built: [
    "Built the first version myself (Aug 2025 – Jan 2026) so clients could find an artist, chat and book: Clerk sign-in, client and artist dashboards, real-time Socket.IO chat, a booking calendar, per-artist deposit policies and Cloudinary uploads.",
    "Made a deposit count as paid only when Stripe confirms it, not when the browser says so: wrote an Express route that creates a Stripe Checkout session and a webhook that verifies Stripe's signature before updating MongoDB.",
    "Since June 2026, direct Claude Code, an AI coding agent, on each feature and fix; caught sign-in routing, onboarding and translation bugs by hand-testing every change in the live app before approving the release.",
    "Run it in production on Vercel and Render: environment variables, the Stripe webhook, database scripts and server logs.",
    "Refocused the product from a marketplace to a booking tool artists link from Instagram; interviewed a New York tattoo studio and pitched 10+ shops in person.",
    "Set the pricing: artists pay nothing, clients pay a flat $10 per booking with the first one free, and tips go 100% to the artist.",
  ],
  moneyPath: [
    { title: "Book", text: "From the artist's link, or a one-off client link with agreed terms." },
    { title: "Waiver and intake", text: "Signed before a session, enforced on the client and the server." },
    { title: "Deposit", text: "Collected at booking through Stripe Checkout." },
  ],
  architecture: [
    { tier: "Browser", host: "Vercel", text: "React 19, Vite, TypeScript, Tailwind" },
    { tier: "API", host: "Render", text: "Node.js, Express 5 and Socket.IO in one long-running process" },
    { tier: "Data", host: "MongoDB Atlas", text: "Mongoose, 38 models, same region as the API" },
  ],
  services: "Clerk for sign-in and roles · Stripe Checkout and webhooks · Cloudinary for images · Gemini for moderation and matching · Resend for email · Sentry for errors",
  problems: [
    {
      problem: "Real-time chat and a raw-body Stripe webhook both break on serverless functions.",
      approach: "Run Express and Socket.IO as one long-running process on Render, in the same region as the database.",
    },
    {
      problem: "A replayed webhook could apply the same payment twice.",
      approach: "Verify Stripe's signature on the raw body and record every event, so a replay is ignored.",
    },
  ],
};

export const arc = {
  name: "Arc",
  meta: "Hackknight 2026 · 48 hours",
  line: "A webcam range-of-motion coach: tracks your body in the browser and counts only the reps done with good form.",
  part: "Owned the web app and API on a team of three, built with Claude Code; removed the install step by moving pose tracking into the browser on day two.",
  tags: ["React", "TypeScript", "MediaPipe", "Express", "MongoDB"],
  image: { src: "/assets/Arc.webp", alt: "Arc's landing page: a 3D body curling a dumbbell toward a 140° goal, the live angle reading 135°" },
  links: [
    { label: "getarc.health", href: "https://getarc.health/" },
    { label: "Source", href: "https://github.com/swejasonzhang/Hackknight2026" },
  ] as Link[],
  built: [
    "Owned the web app and API: in-browser pose tracking with MediaPipe, the rep and form engine for 15 movements, the 3D body, the data model, CI and deployment.",
    "Specified each feature for Claude Code, tested it by hand and merged every pull request on green CI.",
    "Removed the install step for users by deciding on day two to move pose tracking from a Python app into the browser.",
  ],
  credit: "Kelvin built the Python camera app; Jerome built the Gemini and ElevenLabs voice coach.",
  problems: [
    {
      problem: "The demo depended on a Python camera app and one laptop's setup.",
      approach: "On day two, move pose tracking into the browser too. Nothing to install, and the video never leaves the device.",
    },
    {
      problem: "The API went down overnight when a temporary database IP rule expired.",
      approach: "Let the API start without its database, report the connection on its health check, and reconnect by itself.",
    },
    {
      problem: "The 3D body froze for 117 to 250 ms whenever the exercise changed.",
      approach: "Profile on the real GPU: it was being rebuilt each time. Mounting it once with shared materials removed the freezes.",
    },
  ],
};

export type Project = {
  name: string;
  kind: string;
  year: string;
  summary: string;
  part: string;
  challenge: string;
  stack: string[];
  image: { src: string; alt: string };
  links: Link[];
};

export const projects: Project[] = [
  {
    name: "Amazeon",
    kind: "Solo capstone, App Academy",
    year: "2023 – 24",
    summary: "An online store with a product catalog, search, reviews, a cart and a checkout that reduces stock on purchase.",
    part: "Built it alone. In July 2026 I rebuilt the front end in TypeScript with an AI coding agent.",
    challenge: "Keeping stock honest: the checkout reduces each product's stock as part of the purchase.",
    stack: ["Ruby on Rails", "PostgreSQL", "React", "Redux"],
    image: { src: "/assets/Amazeon.webp", alt: "Amazeon's storefront" },
    links: [{ label: "Source", href: "https://github.com/swejasonzhang/FullStack" }],
  },
  {
    name: "Bonjour World",
    kind: "Team of four, App Academy",
    year: "2023",
    summary: "A platform for hosting and finding language exchange events.",
    part: "My part: Google Places address autocomplete, event search, profile image upload and the attendee list.",
    challenge: "Turning free-typed addresses into real places with the Google Places API, inside a shared four-person codebase. Teammates wrote the translation and sign-in code.",
    stack: ["MongoDB", "Express", "React", "Node.js"],
    image: { src: "/assets/BonjourWorld.webp", alt: "Bonjour World's event listing" },
    links: [
      { label: "Live", href: "https://bonjourworld.onrender.com/" },
      { label: "Source", href: "https://github.com/yuris1234/Bonjour-World" },
    ],
  },
  {
    name: "Second Brain",
    kind: "Notes app",
    year: "2026",
    summary: "Semantic search and chat over your own notes.",
    part: "Built in one evening with an AI coding agent, as an exercise in directing the agent.",
    challenge: "Searching by meaning rather than keywords, with embeddings stored in Postgres through pgvector.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "pgvector"],
    image: { src: "/assets/SecondBrain.webp", alt: "Second Brain's notes view" },
    links: [
      { label: "Live", href: "https://second-brain-ai-knowledge-base.vercel.app" },
      { label: "Source", href: "https://github.com/swejasonzhang/SecondBrain" },
    ],
  },
  {
    name: "Calmify",
    kind: "Team project, Headstarter",
    year: "2024",
    summary: "Emotional support through AI-generated flashcards.",
    part: "Added the first Stripe Checkout route, Clerk setup and OpenAI flashcard prompt, then built the landing page and the flashcard flip and swipe UI.",
    challenge: "Wiring payments, sign-in and an AI prompt into a brand-new app on its first day. A teammate created the app and finished sign-in and payments.",
    stack: ["Next.js", "Stripe", "Clerk", "OpenAI"],
    image: { src: "/assets/Calmify.webp", alt: "Calmify's landing page" },
    links: [
      { label: "Live", href: "https://calmify-ten.vercel.app/" },
      { label: "Source", href: "https://github.com/pc9350/Calmify" },
    ],
  },
  {
    name: "ProfScore",
    kind: "Team of three, Headstarter",
    year: "2024",
    summary: "A Rate My Professor app with AI recommendations.",
    part: "Built the professor search page and its API route, which de-duplicates results and sorts them by rating.",
    challenge: "Search results came back duplicated and unordered; the route de-duplicates them and sorts by rating. A teammate built the AI recommendation pipeline behind it.",
    stack: ["Next.js", "React"],
    image: { src: "/assets/ProfScore.webp", alt: "ProfScore's professor search" },
    links: [
      { label: "Live", href: "https://profscore-beta.vercel.app/" },
      { label: "Source", href: "https://github.com/pc9350/Rate-my-professor" },
    ],
  },
  {
    name: "Battlefield: Tanks",
    kind: "Canvas game",
    year: "2023 · 2026",
    summary: "A turn-based tank artillery game in vanilla JavaScript on the Canvas API.",
    part: "First version alone in October 2023; rebuilt in July 2026 with an AI coding agent.",
    challenge: "A whole game loop on the raw Canvas API, with no engine.",
    stack: ["JavaScript", "HTML5 Canvas"],
    image: { src: "/assets/BattlefieldTanks.webp", alt: "Battlefield: Tanks mid-game" },
    links: [
      { label: "Play", href: "https://swejasonzhang.github.io/Battlefield-Tanks/" },
      { label: "Source", href: "https://github.com/swejasonzhang/Battlefield-Tanks" },
    ],
  },
];

export type Job = { org: string; title: string; type: string; dates: string; summary: string; tags: string[]; href?: string; current?: boolean };

export const experience: Job[] = [
  {
    org: "Inkmity",
    title: "Founder & Software Developer",
    type: "New York, NY",
    dates: "Aug 2025 — Present",
    current: true,
    href: "https://inkmity.com/",
    summary:
      "Launched a booking app, live since July 2026, that lets independent New York tattoo artists take a booking, waiver and card deposit from one link in their Instagram bio. Built the first version myself, including a deposit that counts as paid only when Stripe's signed webhook confirms it. Since June 2026 I direct Claude Code and hand-test every release, which caught sign-in, onboarding and translation bugs; I run it in production on Vercel and Render.",
    tags: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Stripe"],
  },
  {
    org: "Move Tact Management",
    title: "Software Engineer",
    type: "Contract · Remote",
    dates: "Feb — Jul 2025",
    summary:
      "Cut a 10+ person marketing team's daily update of 100+ artists' data from several hours by hand to minutes: sole author of 19 Python scripts, run daily, pulling TikTok, Instagram, YouTube and X metrics from the Ensemble Data and Chartmetric APIs into Google Sheets, with Slack alerts. Also wrote a Slack-to-Google Drive filing script and built a MERN dashboard and a creator-voting site with Stripe Checkout.",
    tags: ["Python", "Google Sheets API", "Slack API", "Stripe", "MERN"],
  },
  {
    org: "Series",
    title: "Software Engineer Intern",
    type: "Remote",
    dates: "Nov 2024 — Feb 2025",
    summary:
      "Built Node.js and Firebase endpoints and Twilio SMS integrations so Vera, the company's bot, could hold a personal text conversation with each user and connect them to people with shared interests. Worked through code review with the CTO on a three-person engineering team.",
    tags: ["Node.js", "Firebase", "Twilio"],
  },
  {
    org: "Headstarter AI",
    title: "Software Engineering Fellow",
    type: "Remote",
    dates: "Jul — Oct 2024",
    summary:
      "Built the professor search page and API route for ProfScore, a three-person Rate My Professor app. Added Calmify's first Stripe Checkout route, Clerk setup and OpenAI flashcard prompt, then built its flashcard UI.",
    tags: ["Next.js", "React", "Stripe", "Clerk"],
  },
];

export type School = { school: string; degree: string; dates: string; summary: string; current?: boolean };

export const education: School[] = [
  {
    school: "Queens College (CUNY)",
    degree: "B.S. in Computer Science",
    dates: "Fall 2026 — June 2028 (expected)",
    summary: "Evening classes, with C++ this term, so I can start an internship or co-op now.",
    current: true,
  },
  {
    school: "App Academy",
    degree: "Full-Stack Software Engineering Certificate",
    dates: "Aug — Dec 2023",
    summary: "JavaScript, React, Redux, Ruby on Rails, PostgreSQL, MongoDB, Express and Node.js. Built Amazeon alone and Bonjour World with a team of four.",
  },
  {
    school: "College of Staten Island (CUNY)",
    degree: "Computer Science coursework",
    dates: "2020 — 2022",
    summary: "Where I started computer science, including data structures and algorithms, before transferring to Queens College.",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "Python", "HTML", "CSS", "Ruby", "C++"] },
  { group: "Frontend", items: ["React", "Redux", "Next.js", "Tailwind CSS"] },
  { group: "Backend", items: ["Node.js", "Express", "REST APIs", "Socket.IO", "Ruby on Rails", "Firebase"] },
  { group: "Databases", items: ["MongoDB", "PostgreSQL"] },
  { group: "Integrations", items: ["Stripe", "Clerk", "Cloudinary", "Twilio", "Google Places", "Google Sheets", "Slack"] },
  { group: "Tools", items: ["Git", "GitHub", "Vercel", "Render", "MongoDB Atlas", "Claude Code"] },
];

export const about = [
  "I'm a software engineer and computer science student in New York who likes making the thing and then taking it to the people it's for. I built the first version of Inkmity myself, then pitched it to more than ten tattoo shops in person and sat down with a studio to hear how booking actually breaks for them.",
  "Before that I interned at Series, building the endpoints and Twilio SMS integration behind Vera, the company's texting bot, and at Move Tact I cut a marketing team's daily data update from several hours to minutes with Python. I'm finishing a B.S. at Queens College (CUNY) with evening classes, so I can start an internship or co-op now.",
  "Since June 2026 I build with Claude Code, and I'm open about which work I wrote by hand and which I directed.",
];

export const offClock =
  "Off the clock: anime, games and tattoo art. I wear koi, a Hannya mask, foo dogs and a Solo Leveling piece; getting stronger one honest level at a time is how I think about engineering, too.";
