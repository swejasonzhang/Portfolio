"use client";

import { motion, useMotionValue, animate, type Variants } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";
import TechMarquee from "./TechMarquee";
import InteractiveYinYang from "./InteractiveYinYang";
import { Divider } from "./ink/Motifs";

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

interface Half {
  symbol: string;
  title: string;
  tagline: string;
  skills: string[];
}

const halves: Half[] = [
  {
    symbol: "◑",
    title: "The Craft",
    tagline: "The half you can see and feel.",
    skills: [
      "Modern React architectures",
      "Interactive, responsive UIs",
      "Motion & micro-interactions",
    ],
  },
  {
    symbol: "◐",
    title: "The Logic",
    tagline: "The half that holds it all up.",
    skills: [
      "API & database design",
      "Real-time & AI systems",
      "Cloud, CI/CD & scale",
    ],
  },
];

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
        {/* ---------------- HERO ---------------- */}
        <motion.div
          variants={fadeInSection}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="mb-14 grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:mb-20 lg:grid-cols-[1.2fr_1fr]"
        >
          <div className="order-2 space-y-6 text-center lg:order-1 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-400 lg:justify-start"
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                Available for new opportunities
              </span>
            </motion.div>

            <div>
              <motion.h1
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                data-cursor="hi"
                className="font-display ink-bleed text-6xl leading-[0.85] text-white md:text-8xl lg:text-[7rem]"
              >
                Jason
                <br />
                Zhang
              </motion.h1>
              <div className="mt-4 flex items-center justify-center gap-3 lg:justify-start">
                <span className="h-px w-8 bg-white/40" />
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-gray-300 md:text-sm">
                  Full-Stack Developer
                </p>
              </div>
            </div>

            <p className="mx-auto max-w-lg text-base text-gray-300 md:text-lg lg:mx-0">
              I&rsquo;m a full-stack developer who thinks in balance. I care as
              much about the structure holding a system up as the surface you
              actually touch &mdash; logic and craft, front and back, two halves
              of the same thing.
            </p>
            <p className="mx-auto max-w-lg text-sm text-gray-400 md:text-base lg:mx-0">
              It&rsquo;s the same balance I love in a good yin-yang &mdash; and
              part of why I built{" "}
              <a
                href="https://inkmity.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="ink-underline font-medium text-white transition-opacity hover:opacity-70"
              >
                Inkmity
              </a>
              , a home for tattoo artists and the people who love their work.
              Clean lines, bold statements: that&rsquo;s how I write code too.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-1 lg:justify-start">
              <MagneticButton
                href="#projects"
                className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-black transition-colors hover:bg-gray-200"
              >
                View My Work
              </MagneticButton>
              <MagneticButton
                href="#contact"
                className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-6 py-2.5 font-mono text-xs font-medium uppercase tracking-widest text-gray-200 transition-colors hover:bg-white/10"
              >
                Get in Touch
              </MagneticButton>
            </div>
          </div>

          {/* Yin-yang centerpiece — the signature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 flex justify-center lg:order-2"
          >
            <InteractiveYinYang size={320} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-16 w-full"
        >
          <TechMarquee />
        </motion.div>

        {/* ---------------- TWO SIDES (skills) ---------------- */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mb-20 w-full max-w-4xl"
        >
          <div className="mb-10 text-center">
            <Divider className="mx-auto mb-4 h-5 w-64 text-white/60" />
            <h3 className="font-display text-4xl text-white md:text-5xl">
              Two Sides, One Developer
            </h3>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-gray-400">
              Logic &amp; craft · front &amp; back
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {halves.map((h) => (
              <motion.div key={h.title} variants={item}>
                <TiltCard
                  max={5}
                  className="flash-frame flex h-full flex-col items-center rounded-sm bg-[#050505] p-7 text-center md:p-8"
                >
                  <span className="text-4xl text-white" aria-hidden>
                    {h.symbol}
                  </span>
                  <h4 className="mt-3 font-display text-2xl text-white md:text-3xl">
                    {h.title}
                  </h4>
                  <p className="mt-2 text-xs italic text-gray-500">
                    {h.tagline}
                  </p>
                  <div className="my-4 h-px w-12 bg-white/20" />
                  <ul className="space-y-2 text-sm text-gray-400">
                    {h.skills.map((skill, idx) => (
                      <li key={idx} className="flex items-center justify-center gap-2.5">
                        <span className="h-1 w-1 rotate-45 bg-white" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ---------------- EXPERIENCE ---------------- */}
        <motion.div
          variants={fadeInSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 w-full max-w-5xl space-y-6 overflow-hidden px-4"
        >
          <div className="text-center">
            <div className="mb-3 flex items-center justify-center gap-4">
              <span className="h-0.5 w-10 bg-white/50" />
              <h3 className="font-display text-4xl text-white md:text-5xl">
                Experience
              </h3>
              <span className="h-0.5 w-10 bg-white/50" />
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">
              Built line by line
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Drag to explore &mdash; tap any card to flip it for details.
            </p>
          </div>
          <div className="relative overflow-hidden">
            <motion.div
              drag="x"
              dragConstraints={{ left: -maxDrag, right: 0 }}
              dragElastic={0.4}
              dragMomentum={true}
              style={{ x }}
              data-cursor="drag"
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
              {experienceTimeline.map((exp, idx) => (
                <motion.div
                  key={idx}
                  className="h-[300px] min-w-[280px] flex-shrink-0 cursor-pointer"
                  onClick={() => handleCardClick(idx)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                >
                  <motion.div
                    className="relative h-[300px] w-[280px] rounded-sm shadow-lg"
                    animate={{ rotateY: flippedCard === idx ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      transformStyle: "preserve-3d",
                      transformPerspective: 1200,
                      transformOrigin: "center center",
                    }}
                  >
                    <div
                      className="flash-frame absolute inset-0 flex flex-col justify-between rounded-sm bg-[#050505] p-6"
                      style={{ position: "absolute", backfaceVisibility: "hidden" }}
                    >
                      <div>
                        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                          <span>Nº {String(idx + 1).padStart(2, "0")}</span>
                          <span>{exp.year}</span>
                        </div>
                        <h4 className="font-display text-2xl text-white">
                          {exp.title}
                        </h4>
                        <p className="text-sm font-medium text-gray-300">
                          {exp.company}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">
                        {exp.description}
                      </p>
                      {exp.details && (
                        <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">
                          Tap to flip →
                        </span>
                      )}
                    </div>

                    {exp.details && (
                      <div
                        className="flash-frame absolute inset-0 flex flex-col justify-start rounded-sm bg-[#0a0a0a] p-6"
                        style={{
                          position: "absolute",
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rotate-45 bg-white" />
                          <h4 className="font-display text-xl text-white">
                            Highlights
                          </h4>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-400">
                          {showBackText === idx &&
                            exp.details.map((detail: string, i: number) => (
                              <li key={i} className="flex gap-2">
                                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rotate-45 bg-white" />
                                <span>{detail}</span>
                              </li>
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

        {/* ---------------- EDUCATION ---------------- */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto w-full max-w-5xl px-4"
        >
          <div className="mb-8 text-center">
            <div className="mb-3 flex items-center justify-center gap-4">
              <span className="h-0.5 w-10 bg-white/50" />
              <h3 className="font-display text-4xl text-white md:text-5xl">
                Education
              </h3>
              <span className="h-0.5 w-10 bg-white/50" />
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">
              Where it started
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {educationTimeline.map((edu, idx) => (
              <motion.div key={idx} variants={item}>
                <TiltCard
                  max={5}
                  className="flash-frame h-full rounded-sm bg-[#050505] p-6"
                >
                  <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    <span>Nº {String(idx + 1).padStart(2, "0")}</span>
                    <span>{edu.year}</span>
                  </div>
                  <h4 className="font-display text-2xl text-white">
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
