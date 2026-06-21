"use client";

const stack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Tailwind CSS",
  "Framer Motion",
  "Python",
  "AWS",
  "Firebase",
  "Redux",
  "Ruby on Rails",
  "OpenAI",
  "Docker",
];

export default function TechMarquee() {
  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
        {[...stack, ...stack].map((tech, i) => (
          <span
            key={i}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
