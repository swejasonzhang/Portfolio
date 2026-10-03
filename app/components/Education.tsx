"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import YinYang from "./YinYang";
import Backdrop from "./Backdrop";
import { reveal, stagger, VIEWPORT } from "../lib/motion";

const PAST = [
  {
    no: "02",
    year: "Aug 2023 – Dec 2023",
    title: "Full-Stack Software Engineering Certificate",
    school: "App Academy",
    description:
      "Full-stack program in JavaScript, React, Redux, Ruby on Rails, PostgreSQL, MongoDB, Express and Node.js. Capstone: Amazeon, a solo online store.",
  },
  {
    no: "03",
    year: "2020 – 2022",
    title: "Computer Science Coursework",
    school: "College of Staten Island (CUNY)",
    description: "Computer science coursework, transferred to Queens College.",
  },
];

const META =
  "flex flex-wrap justify-between gap-x-3 gap-y-1 font-mono text-2xs uppercase tracking-label tabular-nums text-gray-400";

export default function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="relative isolate py-24 md:py-32">
      <Backdrop variant="graph" />
      <div className="container-ink">
        <SectionHeading id="education-title" no="03" kicker="Where it started" title="Education" />

        <motion.div variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          <motion.div variants={reveal}>
            <TiltCard max={3} className="flash-frame flash-frame-heavy p-7 md:min-h-[260px] md:p-10 lg:p-12">
              <div className="md:grid md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12">
                <div>
                  <div className={META}>
                    <span className="whitespace-nowrap">
                      Nº 01 <span className="text-gray-500">/ 03</span>
                    </span>
                    <span className="whitespace-nowrap">Fall 2026 – Present</span>
                  </div>
                  <h3 className="mt-4 font-display text-display-lg text-white">B.S. in Computer Science</h3>
                  <p className="mt-2 text-base font-medium text-gray-200">Queens College (CUNY)</p>
                </div>
                <div className="mt-6 md:mt-0">
                  <p className="mb-3 flex items-center gap-2 font-mono text-2xs uppercase tracking-label text-gray-300">
                    <YinYang outline className="h-3 w-3 animate-spin-slow" />
                    <span>Current · Expected May 2029</span>
                  </p>
                  <p className="text-[15px] leading-relaxed text-gray-400">
                    Evening classes; currently taking C++ programming. Open to a software engineering
                    internship or co-op alongside the degree, and I can start right away.
                  </p>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {PAST.map((e) => (
              <motion.div key={e.no} variants={reveal}>
                <TiltCard max={4} className="plate h-full p-6">
                  <div className={META}>
                    <span className="whitespace-nowrap">
                      Nº {e.no} <span className="text-gray-500">/ 03</span>
                    </span>
                    <span className="whitespace-nowrap">{e.year}</span>
                  </div>
                  <h3 className="mt-3 font-display text-display-md text-white">{e.title}</h3>
                  <p className="mt-1 text-sm font-medium text-gray-200">{e.school}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-gray-400">{e.description}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
