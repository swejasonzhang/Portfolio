"use client";

const socials = [
  { href: "https://github.com/swejasonzhang", label: "GitHub" },
  { href: "https://linkedin.com/in/swejasonzhang", label: "LinkedIn" },
  { href: "https://x.com/swejasonzhang", label: "X" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Jason Zhang. Built with Next.js.</p>
        <div className="flex items-center gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
