"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ProjectsSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const projects = [
    {
      title: "Inkmity",
      description:
        "Inkmity is a modern web application connecting tattoo clients and artists, designed to simplify the process of finding the right artist based on your preferences. It provides a space for clients to explore designs, discover local talent, and engage with a community that appreciates and celebrates tattoo art.",
      details: [
        "Built with MongoDB, Express.js, React, Node.js (MERN stack) and modern frontend tools like Tailwind CSS, Framer Motion, and React Toastify",
        "Features waitlist sign-up, responsive interactive UI, notifications, and planned AI enhancements like chatbot guidance and tattoo placement visualization",
      ],
      live: "https://inkmity.com/",
      github: "https://github.com/swejasonzhang/Inkmity",
      image: "/assets/Inkmity.jpg",
    },
    {
      title: "Amazeon",
      description:
        "Amazeon is an e-commerce platform that replicates the Amazon shopping experience, offering users the convenience to purchase a wide range of products.",
      details: [
        "Built with Ruby on Rails (backend), React/Redux (frontend), and AWS for cloud infrastructure",
        "Features rotating product images, smooth UI, and optimized server performance",
      ],
      live: "https://amazeon.onrender.com",
      github: "https://github.com/swejasonzhang/FullStack",
      image: "/assets/Amazeon.jpg",
    },
    {
      title: "Bonjour World",
      description:
        "Bonjour World is a dynamic web platform for language exchange, connecting learners and teachers worldwide.",
      details: [
        "Built on MERN stack with React/Redux frontend and Node.js backend",
        "Integrated Google Maps and Translate APIs for location and real-time translations",
      ],
      live: "https://bonjourworld.onrender.com/",
      github: "https://github.com/yuris1234/Bonjour-World",
      image: "/assets/BonjourWorld.jpg",
    },
    {
      title: "Calmify",
      description:
        "Calmify is a meditation and mental wellness platform providing guided exercises, personalized routines, and stress tracking features.",
      details: [
        "Developed with React frontend, Node.js/Express backend, MongoDB database",
        "Integrates third-party APIs for guided meditation audio and real-time stress analytics",
      ],
      live: "https://calmify-ten.vercel.app/",
      github: "https://github.com/pc9350/Calmify",
      image: "/assets/Calmify.jpg",
    },
    {
      title: "ProfScore",
      description:
        "ProfScore aggregates student reviews and ratings for professors to help students make informed decisions.",
      details: [
        "Built with React/Next.js frontend, Node.js backend, MongoDB database",
        "Features AI-powered comment analysis, ranking algorithms, and interactive dashboards for visualization",
      ],
      live: "https://profscore-beta.vercel.app/",
      github: "https://github.com/pc9350/Rate-my-professor",
      image: "/assets/ProfScore.jpg",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-16 text-center"
        >
          Full Stack Projects
        </motion.h2>

        <div className="space-y-16">
          {projects.map((proj, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800"
            >
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center lg:text-left">
                    {proj.title}
                  </h3>
                  <p className="text-gray-400">{proj.description}</p>
                  <ul className="text-gray-400 list-disc list-inside space-y-1">
                    {proj.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                  <div className="flex gap-4 justify-center lg:justify-start">
                    <a href={proj.live} className="text-blue-400 underline">
                      Live Demo
                    </a>
                    <a href={proj.github} className="text-purple-400 underline">
                      GitHub
                    </a>
                  </div>
                </div>
                <div className="bg-black/30 rounded-xl p-6 flex items-center justify-center">
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    className="rounded-lg"
                    width={800}
                    height={600}
                    priority
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}