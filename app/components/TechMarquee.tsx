const stack = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Tailwind CSS",
  "Python",
  "Socket.IO",
  "Stripe",
  "Clerk",
  "Firebase",
  "Redux",
  "Ruby on Rails",
  "C++",
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0" aria-hidden={hidden || undefined}>
      {stack.map((tech) => (
        <span
          key={tech}
          className="mr-8 flex items-center gap-4 whitespace-nowrap font-mono text-2xs uppercase tracking-label text-gray-400"
        >
          <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-white/60" />
          {tech}
        </span>
      ))}
    </div>
  );
}

/**
 * Full-bleed hairline band that closes the hero: the stack, set in mono,
 * looping seamlessly. Two identical rows; the track slides -50%.
 */
export default function TechMarquee() {
  return (
    <div
      aria-label="Technologies"
      className="bleed mask-fade-x overflow-hidden border-y border-line py-3"
    >
      <div className="flex w-max animate-marquee">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
