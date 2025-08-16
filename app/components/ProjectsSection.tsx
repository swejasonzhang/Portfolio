"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ProjectsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-16 text-center"
        >
          Full Stack Projects
        </motion.h2>

        <div className="space-y-16">
          {/* Amazeon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800"
          >
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center lg:text-left">Amazeon</h3>
                <p className="text-gray-400">
                  Amazeon is an e-commerce platform that replicates the Amazon shopping experience, offering users the convenience to purchase a wide range of products.
                </p>
                <p className="text-gray-400">
                  Built with Ruby on Rails (backend), React/Redux (frontend), and AWS for cloud infrastructure. Features rotating product images, smooth UI, and optimized server performance.
                </p>
                <div className="flex gap-4">
                  <a href="https://amazeon.onrender.com" className="text-blue-400 underline">Live Demo</a>
                  <a href="https://github.com/swejasonzhang/FullStack" className="text-purple-400 underline">GitHub</a>
                </div>
              </div>
              <div className="bg-black/30 rounded-xl p-6">
                <Image
                  src="/assets/Amazeon.jpg"
                  alt="Amazeon"
                  className="rounded-lg"
                  width={800}
                  height={600}
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Bonjour World */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800"
          >
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center lg:text-left">Bonjour World</h3>
                <p className="text-gray-400">
                  Bonjour World is a dynamic web platform for language exchange, connecting learners and teachers worldwide.
                </p>
                <p className="text-gray-400">
                  Built on MERN stack with React/Redux frontend and Node.js backend. Integrated Google Maps and Translate APIs for location and real-time translations.
                </p>
                <div className="flex gap-4">
                  <a href="https://bonjourworld.onrender.com/" className="text-blue-400 underline">Live Demo</a>
                  <a href="https://github.com/yuris1234/Bonjour-World" className="text-purple-400 underline">GitHub</a>
                </div>
              </div>
              <div className="bg-black/30 rounded-xl p-6">
                <Image
                  src="/assets/BonjourWorld.jpg"
                  alt="Bonjour World"
                  className="rounded-lg"
                  width={800}
                  height={600}
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Calmify */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800"
          >
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center lg:text-left">Calmify</h3>
                <p className="text-gray-400">
                  Calmify is a meditation and mental wellness platform providing guided exercises, personalized routines, and stress tracking features.
                </p>
                <p className="text-gray-400">
                  Developed with React frontend, Node.js/Express backend, MongoDB database. Integrates third-party APIs for guided meditation audio and real-time stress analytics.
                </p>
                <div className="flex gap-4">
                  <a href="https://calmify-ten.vercel.app/" className="text-blue-400 underline">Live Demo</a>
                  <a href="https://github.com/pc9350/Calmify" className="text-purple-400 underline">GitHub</a>
                </div>
              </div>
              <div className="bg-black/30 rounded-xl p-6">
                <Image
                  src="/assets/Calmify.jpg"
                  alt="Calmify"
                  className="rounded-lg"
                  width={800}
                  height={600}
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* ProfScore */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800"
          >
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center lg:text-left">ProfScore</h3>
                <p className="text-gray-400">
                  ProfScore aggregates student reviews and ratings for professors to help students make informed decisions.
                </p>
                <p className="text-gray-400">
                  Built with React/Next.js frontend, Node.js backend, MongoDB database. Features AI-powered comment analysis, ranking algorithms, and interactive dashboards for visualization.
                </p>
                <div className="flex gap-4">
                  <a href="https://profscore-beta.vercel.app/" className="text-blue-400 underline">Live Demo</a>
                  <a href="https://github.com/pc9350/Rate-my-professor" className="text-purple-400 underline">GitHub</a>
                </div>
              </div>
              <div className="bg-black/30 rounded-xl p-6">
                <Image
                  src="/assets/ProfScore.jpg"
                  alt="ProfScore"
                  className="rounded-lg"
                  width={800}
                  height={600}
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}