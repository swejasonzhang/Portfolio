/**
 * Every word of career content on the site. Facts match the résumé
 * (resume-src/content.js) and were checked against the repositories on
 * 2026-10-12. Change them together.
 */

export type Link = { label: string; href: string };

export const inkmity = {
  name: "Inkmity",
  meta: "Founder · 2025 – now",
  badge: "Live",
  line: "A booking app for independent New York tattoo artists: one link in an Instagram bio takes the booking, signed waiver and card deposit.",
  part: "Built the first version myself (530+ commits), including the Stripe deposit flow; since June 2026 I build it with Claude Code. 545 test files.",
  tags: ["React", "TypeScript", "Node.js", "MongoDB", "Stripe"],
  image: { src: "/assets/Inkmity.webp", alt: "Inkmity's live landing page: the headline, a new booking request, a held deposit and a signed waiver" },
  links: [{ label: "inkmity.com", href: "https://inkmity.com/" }] as Link[],
  note: "Source private",
  built: [
    "Wrote the first version myself, Aug 2025 – Jan 2026 (530+ commits): Clerk sign-in, client and artist dashboards, real-time chat with Socket.IO, a booking calendar, Cloudinary uploads and a Stripe deposit.",
    "Wrote the deposit flow: the booking page calls an Express route that creates a Stripe Checkout session, and a webhook verifies Stripe's signature and marks the deposit paid in MongoDB.",
    "Since June 2026 I build it with Claude Code, an AI coding agent: I specify each feature and fix, test it by hand in the live app and approve every release.",
    "Deploy and run it in production on Vercel and Render: environment variables, the live Stripe webhook, database scripts and server logs.",
    "Refocused the product from a marketplace to a booking tool artists link from Instagram, interviewed a New York studio, pitched 10+ shops in person and set the pricing: a flat $10 booking fee, first booking free.",
  ],
  moneyPath: [
    { title: "Book", text: "From the artist's link, or a one-off client link with agreed terms." },
    { title: "Waiver and intake", text: "Signed before a session, enforced on the client and the server." },
    { title: "Deposit", text: "Collected at booking through Stripe Checkout." },
    { title: "Capture", text: "The balance is charged when both sides confirm, or 6 hours after the session ends." },
    { title: "Split payout", text: "To the artist, and the studio if there is one, through Stripe Connect." },
    { title: "Clawback", text: "On a chargeback, the payout is reversed." },
  ],
  architecture: [
    { tier: "Browser", host: "Vercel", text: "React 19, Vite, TypeScript, Tailwind" },
    { tier: "API", host: "Render", text: "Node.js, Express 5 and Socket.IO in one long-running process" },
    { tier: "Data", host: "MongoDB Atlas", text: "Mongoose, 38 models, same region as the API" },
  ],
  services: "Clerk for sign-in and roles · Stripe Checkout, Connect and webhooks · Cloudinary for images · Gemini for moderation and matching · Resend for email · Redis for caching and rate limits · Sentry for errors",
  problems: [
    {
      problem: "Real-time chat and a raw-body Stripe webhook both break on serverless functions.",
      approach: "Run Express and Socket.IO as one long-running process on Render, in the same region as the database.",
    },
    {
      problem: "A replayed webhook could apply the same payment twice.",
      approach: "Verify Stripe's signature on the raw body and record every event, so a replay is ignored.",
    },
    {
      problem: "The balance must only be charged once the session really happened.",
      approach: "Capture when client and artist both confirm, or 6 hours after the session; a chargeback claws the payout back.",
    },
    {
      problem: "A failing backend job once reached production, because deploys started on push alongside CI.",
      approach: "Deploy only after every CI job passes: lint, type checks, build, tests against a real database and a dependency audit.",
    },
  ],
};

export const arc = {
  name: "Arc",
  meta: "Hackknight 2026 · 48 hours",
  line: "A webcam range-of-motion coach: tracks your body in the browser and counts only the reps done with good form.",
  part: "Built the web app and API with Claude Code on a team of three; merged all 44 pull requests through CI, with 600 tests.",
  tags: ["React", "TypeScript", "MediaPipe", "Express", "MongoDB"],
  image: { src: "/assets/Arc.webp", alt: "Arc's landing page: a 3D body curling a dumbbell toward a 140° goal, the live angle reading 135°" },
  links: [
    { label: "getarc.health", href: "https://getarc.health/" },
    { label: "Source", href: "https://github.com/swejasonzhang/Hackknight2026" },
  ] as Link[],
  built: [
    "Owned the web app and API: in-browser pose tracking with MediaPipe, the rep and form engine for 15 movements, the 3D body, the data model, CI and deployment.",
    "Specified each feature for Claude Code, tested it by hand and merged all 44 pull requests through CI, with 600 automated tests on the final code.",
    "Made the day-two call to move pose tracking from a Python app into the browser, so there was nothing to install.",
  ],
  credit: "Kelvin built the Python camera app; Jerome built the Gemini and ElevenLabs voice coach.",
  problems: [
    {
      problem: "Webcam landmarks shake, so joint angles jumped from frame to frame.",
      approach: "Smooth every landmark with its own One Euro filter, bridge frames the model is unsure of, and read angles in 3D from MediaPipe's world landmarks.",
    },
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
    part: "Built it alone across 167 commits. In July 2026 I rebuilt the front end in TypeScript with an AI coding agent.",
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
    part: "Across 15 merged pull requests: Google Places address autocomplete, profile image upload, search and the attendee list.",
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
      "Founded and launched a booking app for independent New York tattoo artists, live since July 2026. Built the first version myself (530+ commits), including the Stripe deposit flow and its signature-verified webhook. Since June 2026 I build it with Claude Code, testing and approving every release, and run it in production on Vercel and Render.",
    tags: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Stripe"],
  },
  {
    org: "Move Tact Management",
    title: "Software Engineer",
    type: "Contract · Remote",
    dates: "Feb — Jul 2025",
    summary:
      "Automated reporting for a 10+ person marketing team: sole author of 19 Python scripts (108 commits) pulling TikTok, Instagram, YouTube and X metrics from the Ensemble Data and Chartmetric APIs into Google Sheets, with Slack alerts. Also wrote a Slack-to-Google Drive filing script and built a MERN dashboard and a creator-voting site with Stripe Checkout.",
    tags: ["Python", "Google Sheets API", "Slack API", "Stripe", "MERN"],
  },
  {
    org: "Series",
    title: "Software Engineer Intern",
    type: "Remote",
    dates: "Nov 2024 — Feb 2025",
    summary:
      "Opened 50+ pull requests on a three-person engineering team with the CTO, working through code review. Built Node.js and Firebase backend endpoints and Twilio integrations for Vera, the company's communications bot.",
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
    summary: "Evening classes, with C++ this term, so I can work an internship or co-op during the day.",
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
    summary: "Where I started computer science, before transferring to Queens College.",
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
  "I'm a software engineer and computer science student in New York who likes making the thing and then taking it to the people it's for. I built the first version of Inkmity by hand, then pitched it to more than ten tattoo shops in person and sat down with a studio to hear how booking actually breaks for them.",
  "Before that I interned at Series, opening 50+ pull requests on a small team with the CTO, and wrote data automation for a marketing team at Move Tact. I'm finishing a B.S. at Queens College (CUNY) with evening classes, so I can start an internship or co-op now.",
  "Since June 2026 I build with Claude Code, and I'm open about which work I wrote by hand and which I directed.",
];

export const offClock =
  "Off the clock: anime, games and tattoo art. I wear koi, a Hannya mask, foo dogs and a Solo Leveling piece; getting stronger one honest level at a time is how I think about engineering, too.";
