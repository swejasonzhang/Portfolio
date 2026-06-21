"use client";

export default function YinYang({
  className = "",
  outline = false,
}: {
  className?: string;
  outline?: boolean;
}) {
  if (outline) {
    return (
      <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="50" cy="50" r="49" />
          <path d="M50,1 A24.5,24.5 0 0,1 50,50 A24.5,24.5 0 0,0 50,99" />
        </g>
        <circle cx="50" cy="25.5" r="6" fill="currentColor" />
        <circle cx="50" cy="74.5" r="6" fill="none" stroke="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="49" fill="#fff" />
      <path d="M50,1 A49,49 0 0,1 50,99 Z" fill="#0a0a0a" />
      <circle cx="50" cy="25.5" r="24.5" fill="#0a0a0a" />
      <circle cx="50" cy="74.5" r="24.5" fill="#fff" />
      <circle cx="50" cy="25.5" r="8" fill="#fff" />
      <circle cx="50" cy="74.5" r="8" fill="#0a0a0a" />
    </svg>
  );
}
