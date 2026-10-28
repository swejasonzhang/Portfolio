/* Icons from Lucide (ISC license) and Simple Icons (CC0), inlined. */
type P = { className?: string };
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const GitHubIcon = ({ className = "h-5 w-5" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
export const LinkedInIcon = ({ className = "h-5 w-5" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
export const MailIcon = ({ className = "h-5 w-5" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
export const XIcon = ({ className = "h-[18px] w-[18px]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);
export const ArrowUpRight = ({ className = "h-4 w-4" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);
export const FileIcon = ({ className = "h-4 w-4" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);
/** The diamond mark: a small personal motif. */
export const Diamond = ({ className = "h-2 w-2", filled = true }: P & { filled?: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 10 10" className={className}>
    <path d="M5 0.6 9.4 5 5 9.4 0.6 5Z" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" />
  </svg>
);
