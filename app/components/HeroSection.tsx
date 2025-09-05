"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

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

export default function HeroSection() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [showBackText, setShowBackText] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const stacks = [
    {
      stack: "frontend",
      title: "Frontend Development",
      color: "blue",
      skills: [
        "Modern React Architectures",
        "Performance Optimization",
        "Responsive & Interactive UIs",
      ],
    },
    {
      stack: "backend",
      title: "Backend Development",
      color: "purple",
      skills: [
        "API Design & Development",
        "Database Architecture",
        "Real-time Systems",
      ],
    },
    {
      stack: "devops",
      title: "DevOps & Cloud",
      color: "teal",
      skills: [
        "AWS Infrastructure",
        "CI/CD Pipelines",
        "Scalable Architecture",
      ],
    },
  ] as const;

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

  const fadeInSection = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
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

  if (!mounted) return <div style={{ visibility: "hidden" }} />;

  return (
    <section className="min-h-screen relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 md:px-8">
        {/* Hero Header */}
        <motion.div
          variants={fadeInSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 space-y-4 md:space-y-6 max-w-3xl"
        >
          <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500">
            Jason Zhang
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Full Stack Developer
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            I am a full-stack developer with 2+ years of experience building
            scalable MERN stack applications. I’ve contributed to multiple team
            projects during internships, gaining hands-on experience in
            full-stack development, system design, and collaborative workflows.
          </p>
          <p className="text-sm md:text-base text-gray-500">
            Currently, I am working on{" "}
            <span className="relative inline-block">
              {Array.from("ForTheLoveOfTattoos").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ color: "rgba(255,255,255,0)" }}
                  animate={{ color: "#ffffff" }}
                  transition={{ delay: 1.5 + i * 0.05, duration: 0.5 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            , a MERN stack platform for tattoo enthusiasts to explore artwork,
            share stories, and connect with artists worldwide.
          </p>

          <p className="text-sm md:text-base text-gray-500">
            Actively building and improving projects, I am passionate about
            learning, creating impactful solutions, and combining my technical
            skills with my personal interests.
          </p>
        </motion.div>

        {/* Tech Skills */}
        <motion.div
          variants={fadeInSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full max-w-5xl mx-auto mb-16 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-4 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {stacks.map((s) => {
              const base =
                "p-4 md:p-6 rounded-lg transition-colors border-2 flex flex-col items-center text-center bg-gray-800/50 hover:bg-gray-800/80 border-transparent";
              const hoverClasses: Record<string, string> = {
                blue: "hover:border-blue-500",
                purple: "hover:border-purple-500",
                teal: "hover:border-teal-500",
              };
              const classes = `${base} ${hoverClasses[s.color]}`;

              return (
                <div key={s.stack} className={classes}>
                  <h3
                    className={`text-lg md:text-xl font-semibold mb-4 text-${s.color}-400`}
                  >
                    {s.title}
                  </h3>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-400">
                    {s.skills.map((skill, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 justify-center"
                      >
                        <div
                          className={`w-1.5 h-1.5 bg-${s.color}-500 rounded-full`}
                        />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Experience Carousel */}
        <motion.div
          variants={fadeInSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full max-w-5xl mx-auto px-4 mb-16 overflow-y-hidden space-y-6"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
            Experience
          </h3>
          <p className="text-base md:text-lg text-gray-400 text-center">
            Please click on each individual card to learn more!
          </p>
          <div className="relative overflow-x-hidden">
            <motion.div
              drag="x"
              dragConstraints={{ left: -maxDrag, right: 0 }}
              dragElastic={0.4}
              dragMomentum={true}
              style={{ x }}
              className="flex gap-6"
              onDragEnd={() => {
                const currentX = x.get();
                const cardWithGap = cardWidth + gap;

                if (window.innerWidth < 640) {
                  // Mobile: snap to nearest card
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
                  // Desktop: regular drag
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
                  className="min-w-[280px] perspective flex-shrink-0 cursor-pointer"
                  onClick={() => handleCardClick(idx)}
                >
                  <motion.div
                    className="relative h-[300px] w-[280px] rounded-lg shadow-lg"
                    animate={{ rotateY: flippedCard === idx ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front */}
                    <div
                      className="absolute inset-0 bg-gray-900/50 border border-gray-800 rounded-lg flex flex-col justify-between p-4"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div>
                        <h4 className="text-lg md:text-xl font-semibold text-white text-center md:text-left">
                          {item.title}{" "}
                          <span className="text-blue-400">
                            — {item.company}
                          </span>
                        </h4>
                        <p className="text-sm text-gray-500 text-center md:text-left">
                          {item.year}
                        </p>
                      </div>
                      <p className="mt-2 text-sm md:text-base text-gray-400">
                        {item.description}
                      </p>
                    </div>

                    {/* Back */}
                    {item.details && (
                      <div
                        className="absolute inset-0 bg-gray-800/70 border border-teal-500/50 rounded-lg flex flex-col justify-start p-4 "
                        style={{
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <h4 className="text-lg md:text-xl font-semibold text-white mb-2 ">
                          Experience Details
                        </h4>
                        <ul className="list-disc list-inside text-gray-400 text-sm md:text-base space-y-1 overflow-y-auto max-h-[300px]">
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

        {/* Education */}
        <motion.div
          variants={fadeInSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-5xl mx-auto px-4"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
            Education
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {educationTimeline.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-gray-900/50 border border-gray-800"
              >
                <h4 className="text-lg md:text-xl font-semibold text-white">
                  {item.title}{" "}
                  <span className="text-teal-400">— {item.company}</span>
                </h4>
                <p className="text-sm text-gray-500">{item.year}</p>
                <p className="mt-2 text-sm md:text-base text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
