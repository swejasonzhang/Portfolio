"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [selectedStack, setSelectedStack] = useState<
    "frontend" | "backend" | "devops" | null
  >(null);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const experienceTimeline = [
    {
      year: "Jul 2025 - Present",
      title: "Software Engineer (Self-employed)",
      company: "Currently Seeking New Opportunities",
      description:
        "Sharpening problem-solving and system design skills through hands-on projects.",
      details: [
        "Built small full-stack apps to practice integration",
        "Focused on algorithm and data structure exercises",
      ],
    },
    {
      year: "Jul 2025 - Aug 2025",
      title: "Software Engineer Intern",
      company: "Leechy",
      description:
        "Developed backend APIs and ensured secure, cross-platform functionality.",
      details: [
        "Implemented JWT authentication and authorization",
        "Ensured backend compatibility across iOS & Android",
      ],
    },
    {
      year: "Mar 2025 - Jul 2025",
      title: "Software Engineer (Contract)",
      company: "Move Tact Management",
      description:
        "Built MERN stack projects and integrated multiple APIs to automate workflows.",
      details: [
        "Integrated Slack, Twitch, Stripe, and Chartmetric APIs",
        "Automated tasks using Python scripts",
        "Deployed projects on Vercel",
      ],
    },
    {
      year: "Feb 2025 - Mar 2025",
      title: "Software Engineer (Trial Period)",
      company: "Ensemble Data",
      description:
        "Processed and automated data workflows using Python and Ensemble APIs.",
      details: [
        "Exported analytics to CSV and Google Sheets",
        "Automated repetitive tasks to streamline workflow",
      ],
    },
    {
      year: "Nov 2024 - Feb 2025",
      title: "Software Engineer Intern",
      company: "Series",
      description:
        "Developed scalable APIs and improved CI/CD within Agile teams.",
      details: [
        "Built Node.js/Firebase APIs",
        "Integrated OpenAI and Twilio for enhanced features",
        "Improved CI/CD pipelines and workflow efficiency",
      ],
    },
    {
      year: "Jul 2024 - Oct 2024",
      title: "Software Engineer Intern",
      company: "Headstarter AI",
      description:
        "Built AI projects using modern full-stack tools and Pinecone for search.",
      details: [
        "Developed AI support agent using OpenAI + Pinecone",
        "Built dynamic SaaS products for mental health support",
      ],
    },
  ].sort(
    (a, b) =>
      new Date(b.year.split(" - ")[0]).getTime() -
      new Date(a.year.split(" - ")[0]).getTime()
  );

  const educationTimeline = [
    {
      year: "Aug 2023 - Dec 2023",
      title: "Software Development Certification",
      company: "App Academy",
      description:
        "Completed 1,000+ hours of full-stack development training in Ruby on Rails, React, and JavaScript. Strengthened teamwork through pair programming.",
    },
    {
      year: "May 2020 - Jun 2022",
      title: "Associate’s Degree, Computer Science",
      company: "CUNY College of Staten Island",
      description:
        "Studied Discrete Math, OOP, Data Structures, and Algorithms. Gained proficiency in C++ and DSA.",
    },
  ];

  const stacks: {
    stack: "frontend" | "backend" | "devops";
    title: string;
    color: string;
    skills: string[];
  }[] = [
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
  ];

  // Motion
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

  return (
    <section className="min-h-screen relative overflow-hidden py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 md:px-8">
        {/* Intro */}
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
            I have 2 years of experience building scalable MERN stack
            applications and have contributed to multiple team projects during
            internships, gaining hands-on experience in full-stack development
            and collaborative workflows.
          </p>
          <p className="text-sm md:text-base text-gray-500">
            Actively building and improving full-stack projects, I am passionate
            about learning and creating impactful solutions both independently
            and in teams.
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
            {stacks.map((s, i) => (
              <div
                key={i}
                className={`p-4 md:p-6 rounded-lg transition-colors border-2 ${
                  selectedStack === s.stack
                    ? `bg-${s.color}-500/20 border-${s.color}-500/50`
                    : "bg-gray-800/50 hover:bg-gray-800/80 border-transparent"
                }`}
                onMouseEnter={() => setSelectedStack(s.stack)}
                onMouseLeave={() => setSelectedStack(null)}
              >
                <h3
                  className={`text-lg md:text-xl font-semibold mb-4 text-${s.color}-400`}
                >
                  {s.title}
                </h3>
                <ul className="space-y-2 text-xs md:text-sm text-gray-400">
                  {s.skills.map((skill, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 bg-${s.color}-500 rounded-full`}
                      />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Experience Carousel */}
<motion.div
  variants={fadeInSection}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  transition={{ delay: 0.3, duration: 0.6 }}
  className="w-full max-w-5xl mx-auto px-4 mb-16"
>
  <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
    Experience
  </h3>
  <div className="relative overflow-x-hidden">
    <motion.div
      drag="x"
      dragConstraints={{ left: -maxDrag, right: 0 }}
      dragElastic={0.2}
      style={{ x }}
      onDragEnd={() => {
        let clampedX = x.get();
        if (clampedX > 0) clampedX = 0;
        if (clampedX < -maxDrag) clampedX = -maxDrag;

        animate(x, clampedX, {
          type: "spring",
          stiffness: 300,
          damping: 30,
        });
      }}
      className="flex gap-6"
    >
      {experienceTimeline.map((item, idx) => (
        <motion.div
          key={idx}
          onClick={() => setFlippedCard(flippedCard === idx ? null : idx)}
          className="min-w-[280px] perspective cursor-pointer flex-shrink-0"
        >
          <motion.div
            animate={{ rotateY: flippedCard === idx ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-gray-900/50 border border-gray-800 rounded-lg shadow-lg transform-style-preserve-3d p-4"
          >
            {/* Front */}
            <div
              className="absolute w-full top-0 left-0 p-4 flex flex-col justify-between min-h-[220px]"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div>
                <h4 className="text-lg md:text-xl font-semibold text-white">
                  {item.title}{" "}
                  <span className="text-blue-400">— {item.company}</span>
                </h4>
                <p className="text-sm text-gray-500">{item.year}</p>
              </div>
              <p className="mt-2 text-sm md:text-base text-gray-400">
                {item.description}
              </p>
            </div>

            {/* Back */}
            <div
              className="absolute w-full top-0 left-0 p-4 flex flex-col justify-start rotate-y-180 min-h-[220px] overflow-auto"
              style={{ backfaceVisibility: "hidden" }}
            >
              <h4 className="text-lg md:text-xl font-semibold text-white mb-2">
                Experience Details
              </h4>
              <ul className="list-disc list-inside text-gray-400 text-sm md:text-base space-y-1">
                {item.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
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
