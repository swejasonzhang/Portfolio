"use client";

import { motion, useMotionValue, animate, type Variants } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";
import TechMarquee from "./TechMarquee";

interface ExperienceItem {
  year: string;
  title: string;
  company: string;
  description: string;
  details?: string[];
}

interface EducationItem {
  year: string;
  title: string;
  company: string;
  description: string;
}

const accents = {
  light: {
    title: "text-white",
    dot: "bg-white",
    hoverBorder: "hover:border-white/50",
  },
  mid: {
    title: "text-gray-200",
    dot: "bg-gray-300",
    hoverBorder: "hover:border-white/30",
  },
  dim: {
    title: "text-gray-400",
    dot: "bg-gray-500",
    hoverBorder: "hover:border-white/20",
  },
} as const;

type Accent = keyof typeof accents;

export default function HeroSection() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [showBackText, setShowBackText] = useState<number | null>(null);

  const experienceTimeline: ExperienceItem[] = useMemo(() => {
    const raw: ExperienceItem[] = [
      {
        year: "Jul 2025 - Present",
        title: "Full Stack Developer",
        company: "Personal Projects",
        description:
          "Actively building and refining full-stack applications, enhancing system design, and exploring AI integrations to deliver practical and scalable solutions.",
        details: [
          "Developing and deploying full-stack MERN projects, including personal and portfolio projects.",
          "Learning new technologies through hands-on projects, Coursera courses, and hackathons.",
        ],
      },
      {
        year: "Jul 2025 - Aug 2025",
        title: "Software Engineer Intern",
        company: "Leechy",
        description:
          "Focused on Kotlin and iOS integration with backend endpoints, ensuring secure communication and seamless mobile functionality.",
        details: [
          "Implemented JWT-based authentication and role-based authorization for iOS clients.",
          "Integrated backend APIs with Kotlin-based mobile applications.",
          "Ensured smooth communication between mobile and backend systems across platforms.",
        ],
      },
      {
        year: "Mar 2025 - Jul 2025",
        title: "Software Engineer (Contract)",
        company: "Move Tact Management",
        description:
          "Worked on automating workflows and integrating third-party APIs to improve internal processes.",
        details: [
          "Automated tasks using Python scripts for data processing and reporting.",
          "Integrated Slack, Twitch, Stripe, and Chartmetric APIs for operational automation.",
          "Deployed small projects on Vercel and tested integrations with existing systems.",
        ],
      },
      {
        year: "Feb 2025 - Mar 2025",
        title: "Software Engineer (Trial Period)",
        company: "Move Tact Management",
        description:
          "Assisted in building internal tools and automating repetitive workflows to improve team efficiency.",
        details: [
          "Created scripts to automate data exports and report generation.",
          "Streamlined workflows to reduce manual effort and errors.",
          "Collaborated with the team to ensure smooth integration with existing systems.",
        ],
      },
      {
        year: "Nov 2024 - Feb 2025",
        title: "Software Engineer Intern",
        company: "Series",
        description:
          "Developed scalable backend APIs and improved CI/CD processes to support agile development and efficient deployment.",
        details: [
          "Built Node.js and Firebase APIs for internal and client-facing services.",
          "Integrated OpenAI and Twilio to enhance user interactions.",
          "Optimized CI/CD pipelines to accelerate deployment and reduce downtime.",
        ],
      },
      {
        year: "Jul 2024 - Oct 2024",
        title: "Software Engineer Intern",
        company: "Headstarter AI",
        description:
          "Built AI-powered SaaS applications to support mental health and dynamic data-driven products.",
        details: [
          "Developed AI support agents using OpenAI + Pinecone for semantic search and responses.",
          "Built dynamic SaaS products using full-stack React and Node.js architecture.",
          "Collaborated in Agile teams to deliver robust, production-ready solutions.",
        ],
      },
    ];

    return raw.sort(
      (a, b) =>
        new Date(b.year.split(" - ")[0]).getTime() -
        new Date(a.year.split(" - ")[0]).getTime()
    );
  }, []);

  const educationTimeline: EducationItem[] = useMemo(
    () => [
      {
        year: "Aug 2023 - Dec 2023",
        title: "Software Development Certification",
        company: "App Academy",
        description:
          "Completed 1,000+ hours of full-stack development training in Ruby on Rails, React, and JavaScript. Strengthened teamwork through pair programming.",
      },
      {
        year: "May 2020 - Jun 2022",
        title: "Computer Science",
        company: "CUNY College of Staten Island",
        description:
          "Studied Discrete Math, OOP, Data Structures, and Algorithms. Gained proficiency in C++ and DSA.",
      },
    ],
    []
  );

  const stacks: {
    stack: string;
    title: string;
    color: Accent;
    skills: string[];
  }[] = [
    {
      stack: "frontend",
      title: "Frontend Development",
      color: "light",
      skills: [
        "Modern React Architectures",
        "Performance Optimization",
        "Responsive & Interactive UIs",
      ],
    },
    {
      stack: "backend",
      title: "Backend Development",
      color: "mid",
      skills: [
        "API Design & Development",
        "Database Architecture",
        "Real-time Systems",
      ],
    },
    {
      stack: "devops",
      title: "DevOps & Cloud",
      color: "dim",
      skills: [
        "AWS Infrastructure",
        "CI/CD Pipelines",
        "Scalable Architecture",
      ],
    },
  ];

  const x = useMotionValue(0);
  const cardWidth = 280;
  const gap = 24;
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    function updateVisibleCards() {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    }
    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const carouselVisibleWidth = visibleCards * (cardWidth + gap) - gap;
  const totalCarouselWidth =
    experienceTimeline.length * (cardWidth + gap) - gap;
  const maxDrag = totalCarouselWidth - carouselVisibleWidth;

  const fadeInSection: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleCardClick = (idx: number) => {
    if (flippedCard === idx) {
      setFlippedCard(null);
      setShowBackText(null);
    } else {
      setFlippedCard(idx);
      setTimeout(() => setShowBackText(idx), 300);
    }
  };

  return (
    <div className="relative overflow-hidden py-28 md:py-36">
      <div className="relative z-10 flex flex-col items-center justify-center px-4 md:px-8">

        <motion.div
          variants={fadeInSection}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl space-y-4 text-center md:mb-16 md:space-y-6"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-medium text-gray-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Available for new opportunities
          </motion.span>

          <motion.h1
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="gradient-text text-4xl font-bold md:text-7xl"
          >
            Jason Zhang
          </motion.h1>
          <h2 className="text-2xl font-bold text-white md:text-4xl">
            Full Stack Developer
          </h2>
          <p className="text-base text-gray-400 md:text-lg">
            I am a full-stack developer with 2+ years of experience building
            scalable MERN stack applications. I&rsquo;ve contributed to multiple
            team projects during internships, gaining hands-on experience in
            full-stack development, system design, and collaborative workflows.
          </p>
          <p className="text-sm text-gray-500 md:text-base">
            Currently, I am working on{" "}
            <a
              href="https://inkmity.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block font-medium"
            >
              {Array.from("Inkmity").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ color: "rgba(255,255,255,0)" }}
                  animate={{ color: "#ffffff" }}
                  transition={{ delay: 1.2 + i * 0.05, duration: 0.5 }}
                  className="underline-offset-4 transition-all hover:text-gray-300 hover:underline"
                >
                  {char}
                </motion.span>
              ))}
            </a>
            , a platform designed to make finding the right tattoo artist
            easier, helping users discover artists that match their style,
            preferences, and budget while connecting with a community that
            appreciates great tattoo art.
          </p>

          <p className="text-sm text-gray-500 md:text-base">
            Actively building and improving projects, I am passionate about
            learning, creating impactful solutions, and combining my technical
            skills with my personal interests.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <MagneticButton
              href="#projects"
              className="inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
            >
              View My Work
            </MagneticButton>
            <MagneticButton
              href="#contact"
              className="inline-block rounded-lg border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10"
            >
              Get in Touch
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-16 w-full"
        >
          <TechMarquee />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mb-16 w-full max-w-4xl rounded-2xl border border-white/10 bg-gray-900/60 p-6 md:p-8"
        >
          <h3 className="mb-8 text-center text-2xl font-bold text-white md:text-3xl">
            What I Do
          </h3>
          <div className="mx-auto grid grid-cols-1 place-items-center gap-5 sm:max-w-md md:max-w-none md:grid-cols-3 md:gap-6">
            {stacks.map((s) => {
              const accent = accents[s.color];
              return (
                <motion.div key={s.stack} variants={item} className="w-full">
                  <TiltCard
                    className={`glow-border flex h-full w-full flex-col items-center rounded-xl border-2 border-transparent bg-gray-800/40 p-5 text-center transition-colors hover:bg-gray-800/70 md:p-6 ${accent.hoverBorder}`}
                  >
                    <h3
                      className={`mb-4 text-lg font-semibold md:text-xl ${accent.title}`}
                    >
                      {s.title}
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-400 md:text-sm">
                      {s.skills.map((skill, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-center gap-2"
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${accent.dot}`}
                          />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={fadeInSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 w-full max-w-5xl space-y-6 overflow-hidden px-4"
        >
          <h3 className="text-center text-2xl font-bold text-white md:text-3xl">
            Experience
          </h3>
          <p className="text-center text-sm text-gray-400 md:text-base">
            Drag to explore — click any card to flip it for details.
          </p>
          <div className="relative overflow-hidden">
            <motion.div
              drag="x"
              dragConstraints={{ left: -maxDrag, right: 0 }}
              dragElastic={0.4}
              dragMomentum={true}
              style={{ x }}
              className="flex cursor-grab gap-6 active:cursor-grabbing"
              onDragEnd={() => {
                const currentX = x.get();
                const cardWithGap = cardWidth + gap;

                if (window.innerWidth < 640) {
                  let closestIndex = Math.round(-currentX / cardWithGap);
                  if (closestIndex < 0) closestIndex = 0;
                  if (closestIndex > experienceTimeline.length - 1)
                    closestIndex = experienceTimeline.length - 1;

                  const targetX = -closestIndex * cardWithGap;
                  animate(x, targetX, {
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                  });
                } else {
                  let clampedX = currentX;
                  if (clampedX > 0) clampedX = 0;
                  if (clampedX < -maxDrag) clampedX = -maxDrag;
                  animate(x, clampedX, {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  });
                }
              }}
            >
              {experienceTimeline.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="perspective min-w-[280px] flex-shrink-0 cursor-pointer"
                  onClick={() => handleCardClick(idx)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                >
                  <motion.div
                    className="relative h-[300px] w-[280px] rounded-xl shadow-lg"
                    animate={{ rotateY: flippedCard === idx ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >

                    <div
                      className="absolute inset-0 flex flex-col justify-between rounded-xl border border-white/10 bg-gray-900/70 p-5"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div>
                        <p className="mb-2 text-xs font-medium text-gray-500">
                          {item.year}
                        </p>
                        <h4 className="text-lg font-semibold text-white md:text-xl">
                          {item.title}
                        </h4>
                        <p className="text-sm font-medium text-gray-300">
                          {item.company}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">
                        {item.description}
                      </p>
                      {item.details && (
                        <span className="mt-3 text-xs text-gray-600">
                          Click to flip →
                        </span>
                      )}
                    </div>

                    {item.details && (
                      <div
                        className="absolute inset-0 flex flex-col justify-start rounded-xl border border-white/30 bg-gray-800/85 p-5"
                        style={{
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <h4 className="mb-2 text-lg font-semibold text-white md:text-xl">
                          Highlights
                        </h4>
                        <ul className="list-inside list-disc space-y-1 overflow-hidden text-sm text-gray-400">
                          {showBackText === idx &&
                            item.details.map((detail: string, i: number) => (
                              <li key={i}>{detail}</li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto w-full max-w-5xl px-4"
        >
          <h3 className="mb-6 text-center text-2xl font-bold text-white md:text-3xl">
            Education
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {educationTimeline.map((edu, idx) => (
              <motion.div key={idx} variants={item}>
                <TiltCard
                  max={5}
                  className="glow-border h-full rounded-xl border border-white/10 bg-gray-900/70 p-5"
                >
                  <p className="text-xs font-medium text-gray-500">{edu.year}</p>
                  <h4 className="mt-1 text-lg font-semibold text-white md:text-xl">
                    {edu.title}
                  </h4>
                  <p className="text-sm font-medium text-gray-300">
                    {edu.company}
                  </p>
                  <p className="mt-2 text-sm text-gray-400 md:text-base">
                    {edu.description}
                  </p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
