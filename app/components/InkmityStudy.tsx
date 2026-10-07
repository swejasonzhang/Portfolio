"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import Gate from "./Gate";
import Seal from "./Seal";
import { EASE_OUT, reveal, stagger, VIEWPORT, wipe } from "../lib/motion";
import { siteConfig } from "../site";

/* ------------------------------------------------------------------ */
/* Small editorial primitives (local to the study)                     */
/* ------------------------------------------------------------------ */

type Row = { label: string; value: ReactNode };

/** A ruled mono ledger: label in the margin, value on the line. */
function Register({
  rows,
  align = "left",
  className = "",
  labelWidth = "minmax(0,6.5rem)",
}: {
  rows: Row[];
  align?: "left" | "right";
  className?: string;
  labelWidth?: string;
}) {
  return (
    <dl className={`font-mono text-2xs ${className}`}>
      {rows.map((r) => (
        <div
          key={r.label}
          className="grid gap-4 border-t border-line py-3 last:border-b"
          style={{ gridTemplateColumns: `${labelWidth} minmax(0,1fr)` }}
        >
          <dt className="uppercase tracking-label text-ash">{r.label}</dt>
          <dd className={`leading-relaxed text-washi ${align === "right" ? "text-right" : ""}`}>
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Mono caption above a figure. */
function Caption({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`mb-4 font-mono text-2xs uppercase tracking-label text-ash ${className}`}>{children}</p>
  );
}

/** Body prose on ink. */
function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`max-w-[58ch] space-y-5 text-pretty text-base leading-relaxed text-washi/80 [&_strong]:font-normal [&_strong]:text-washi ${className}`}
    >
      {children}
    </div>
  );
}

/** A pulled line from the repository, set in serif italic on a single rule. */
function Pull({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <blockquote className="border-l border-line-rule pl-5">
      <p className="font-serif text-display-sm italic text-washi">{children}</p>
      {cite && <footer className="mt-2 font-mono text-2xs tracking-label text-ash">{cite}</footer>}
    </blockquote>
  );
}

/** Mono code token, no box. */
function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono text-[0.9em] text-washi">{children}</code>;
}

/**
 * A connector: a 1px line with a small rotated-square joint at its midpoint.
 * `double` draws two parallel lines (a two-way exchange).
 */
function Connector({
  vertical = false,
  double = false,
  className = "",
}: {
  vertical?: boolean;
  double?: boolean;
  className?: string;
}) {
  const stroke = "rgba(239,232,218,0.32)";
  const joint = "rgba(239,232,218,0.6)";
  if (vertical) {
    return (
      <svg viewBox="0 0 8 32" aria-hidden="true" className={className} preserveAspectRatio="none">
        {double ? (
          <>
            <line x1="2" y1="0" x2="2" y2="32" stroke={stroke} strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="6" y1="0" x2="6" y2="32" stroke={stroke} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </>
        ) : (
          <line x1="4" y1="0" x2="4" y2="32" stroke={stroke} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        )}
        <rect x="2.5" y="14.5" width="3" height="3" fill={joint} transform="rotate(45 4 16)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 8" aria-hidden="true" className={className} preserveAspectRatio="none">
      {double ? (
        <>
          <line x1="0" y1="2" x2="32" y2="2" stroke={stroke} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="6" x2="32" y2="6" stroke={stroke} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </>
      ) : (
        <line x1="0" y1="4" x2="32" y2="4" stroke={stroke} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      )}
      <rect x="14.5" y="2.5" width="3" height="3" fill={joint} transform="rotate(45 16 4)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Figures                                                             */
/* ------------------------------------------------------------------ */

const MONEY_STEPS = [
  { label: "Book", sub: "a session is requested" },
  { label: "Waiver + intake", sub: "enforced on client and server" },
  { label: "Deposit", sub: "Stripe Checkout" },
  { label: "Session", sub: "the work happens" },
  { label: "Capture", sub: "both verify, or 6 h after the session", accent: true },
  { label: "Split payout", sub: "artist / studio · Stripe Connect" },
  { label: "Clawback", sub: "on chargeback" },
] as const;

/** The money path: a ruled flow, horizontal on md+, vertical below. */
function MoneyPath() {
  return (
    <ol className="relative grid gap-y-10 md:grid-cols-7 md:gap-x-8 md:gap-y-12">
      {MONEY_STEPS.map((s, i) => {
        const accent = "accent" in s && s.accent;
        const last = i === MONEY_STEPS.length - 1;
        return (
          <li key={s.label} className="relative">
            <div className={`border-b pb-3 ${accent ? "border-shu" : "border-line-rule"}`}>
              <span className={`block font-mono text-2xs tracking-label ${accent ? "text-shu-soft" : "text-ash"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 block font-mono text-sm text-washi">{s.label}</span>
              <span className="mt-1 block font-mono text-2xs leading-relaxed text-ash">{s.sub}</span>
            </div>
            {!last && (
              <>
                <Connector className="absolute -right-8 top-8 hidden h-2 w-8 md:block" />
                <Connector vertical className="absolute -bottom-10 left-0 h-10 w-2 md:hidden" />
              </>
            )}
          </li>
        );
      })}

      {/* Side branch: the tip, after the session. */}
      <li className="relative md:col-span-3 md:col-start-4 md:pl-10">
        {/* mobile: continues the vertical line */}
        <Connector vertical className="absolute -top-10 left-0 h-10 w-2 md:hidden" />
        {/* md+: an elbow descending from Session */}
        <svg
          viewBox="0 0 40 56"
          aria-hidden="true"
          className="absolute -top-12 left-0 hidden h-14 w-10 md:block"
        >
          <path d="M1 0 V 44 H 40" fill="none" stroke="rgba(239,232,218,0.32)" strokeWidth="1" />
          <rect x="-0.5" y="42.5" width="3" height="3" fill="rgba(239,232,218,0.6)" transform="rotate(45 1 44)" />
        </svg>
        <div className="border-b border-line-rule pb-3">
          <span className="block font-mono text-2xs uppercase tracking-label text-ash">Branch · post-session</span>
          <span className="mt-2 block font-mono text-sm text-washi">Tip → 100% to the artist</span>
          <span className="mt-1 block font-mono text-2xs leading-relaxed text-ash">
            destination charge, nothing withheld
          </span>
        </div>
      </li>
    </ol>
  );
}

const SATELLITES = [
  { name: "Clerk", role: "auth · roles: client / artist / studio" },
  { name: "Stripe", role: "Checkout · PaymentIntents · Connect split payouts · webhooks" },
  { name: "Cloudinary", role: "media" },
  { name: "Gemini", role: "moderation, fails closed · brief extraction · assistant on its own key" },
  { name: "Resend / Nodemailer", role: "email" },
  { name: "Redis", role: "optional · ioredis cache · Socket.io adapter" },
  { name: "Sentry + pino", role: "monitoring and logging" },
] as const;

function ArchNode({ kicker, name, lines, accent = false }: { kicker: string; name: string; lines: string[]; accent?: boolean }) {
  return (
    <div className={`border-b pb-3 ${accent ? "border-line-strong" : "border-line-rule"}`}>
      <span className="block font-mono text-2xs uppercase tracking-label text-ash">{kicker}</span>
      <span className="mt-2 block font-serif text-display-sm text-washi">{name}</span>
      <span className="mt-1 block font-mono text-2xs leading-relaxed text-ash">
        {lines.map((l, i) => (
          <span key={l} className="inline">
            {i > 0 && <span aria-hidden="true"> · </span>}
            {l}
          </span>
        ))}
      </span>
    </div>
  );
}

/** Architecture: the core triad as a ruled exchange, then the satellites. */
function Architecture() {
  return (
    <div>
      <div className="grid gap-y-6 md:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1.2fr)_2.5rem_minmax(0,1fr)] md:items-start md:gap-y-0">
        <ArchNode kicker="Browser" name="React 19 SPA" lines={["Vite", "TypeScript", "Tailwind", "Radix / shadcn", "Framer Motion", "Vercel"]} />
        <div className="h-8 w-2 md:mt-9 md:h-2 md:w-full">
          <Connector vertical double className="h-full w-full md:hidden" />
          <Connector double className="hidden h-full w-full md:block" />
        </div>
        <ArchNode
          kicker="API"
          name="Express 5 + Socket.io"
          lines={["Node.js", "Render", "long-running process", "Ohio region"]}
          accent
        />
        <div className="h-8 w-2 md:mt-9 md:h-2 md:w-full">
          <Connector vertical double className="h-full w-full md:hidden" />
          <Connector double className="hidden h-full w-full md:block" />
        </div>
        <ArchNode kicker="Data" name="MongoDB Atlas" lines={["Mongoose", "38 models", "same region as the API"]} />
      </div>

      <Caption className="mt-12">Satellites of the API</Caption>
      <ul className="grid md:grid-cols-2 md:gap-x-10">
        {SATELLITES.map((s) => (
          <li key={s.name} className="flex items-baseline gap-4 border-t border-line py-3 last:border-b md:[&:nth-last-child(2)]:border-b">
            <span aria-hidden="true" className="relative top-[-2px] h-[5px] w-[5px] shrink-0 rotate-45 bg-ash" />
            <span className="w-32 shrink-0 font-mono text-sm text-washi">{s.name}</span>
            <span className="font-mono text-2xs leading-relaxed text-ash">{s.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A plain mono list of identifiers, ruled. */
function MonoList({ items, cols = 1 }: { items: readonly string[]; cols?: 1 | 2 }) {
  return (
    <ul className={`font-mono text-sm text-washi ${cols === 2 ? "sm:columns-2 sm:gap-10" : ""}`}>
      {items.map((it) => (
        <li key={it} className="flex items-baseline gap-4 border-t border-line py-2.5 last:border-b">
          <span aria-hidden="true" className="relative top-[-2px] h-[5px] w-[5px] shrink-0 rotate-45 bg-ash" />
          <span className="break-all">{it}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* The six layers                                                      */
/* ------------------------------------------------------------------ */

const HARDENING = [
  "authzHardening",
  "operatorInjection",
  "racesHardening",
  "signedDocumentPrivacy",
  "instagramTokenPrivacy",
  "disputedBookingFreeze",
  "webhookAmountMismatch",
] as const;

const SUITES = [
  "depositEscrow",
  "depositGuarantee",
  "balanceCaptureAtomicity",
  "webhookAmountMismatch",
  "statementDescriptorStability",
  "noShowSettlement",
  "slotReleaseLifecycle",
  "studioBookingSplit",
  "disputeEvidencePacket",
  "accountDeletion",
] as const;

type Layer = {
  title: string;
  summary: string;
  body: ReactNode;
};

const LAYERS: Layer[] = [
  {
    title: "The decision",
    summary: "One workflow, one city. A constitution the code answers to.",
    body: (
      <>
        <div className="md:col-span-6">
          <Prose>
            <p>
              Inkmity does one thing in one city. An independent NYC tattoo artist puts one link in an Instagram
              bio, and the conversation already happening in DMs becomes an organized booking. It is deliberately
              narrow: <strong>not</strong> a marketplace, a social network, a studio OS or a national directory — yet.
            </p>
            <p>
              Decisions answer to a written constitution, <Code>PRINCIPLES.md</Code>. Success is 20 NYC artists
              using it weekly on real client work.
            </p>
          </Prose>
          <div className="mt-8">
            <Pull cite="PRINCIPLES.md">
              &ldquo;If a decision contradicts this document, this document wins — or the document gets changed
              deliberately, with a reason written down.&rdquo;
            </Pull>
          </div>
          <div className="mt-10">
            <Caption>Anti-goals</Caption>
            <ul className="max-w-[58ch] space-y-2 text-base leading-relaxed text-washi/80">
              {[
                "Never ask an artist to abandon Instagram.",
                "Do not replace the artistic conversation in DMs.",
                "Do not become another social network.",
                "Do not force a rigid workflow.",
                "Never charge a client without naming what the charge buys.",
              ].map((a) => (
                <li key={a} className="flex gap-4">
                  <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-line-rule" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 md:col-span-5 md:col-start-8 md:mt-0">
          <Caption>The build rule — a feature ships only if it does at least one</Caption>
          <Register
            labelWidth="2.5rem"
            rows={[
              { label: "i", value: "Reduce artist work" },
              { label: "ii", value: "Reduce client friction" },
              { label: "iii", value: "Increase trust" },
              { label: "iv", value: "Increase repeat usage" },
            ]}
          />
          <p className="mt-3 font-mono text-2xs tracking-label text-ash">Satisfies none → don&rsquo;t build.</p>

          <div className="mt-12">
            <Caption>Built, tested, frozen behind flags</Caption>
            <p className="mb-4 font-serif text-display-sm italic text-washi">
              &ldquo;Frozen is a decision, not a backlog.&rdquo;
            </p>
            <Register
              labelWidth="4.5rem"
              rows={[
                { label: "frozen", value: "Studio tooling" },
                { label: "frozen", value: "Nationwide discovery" },
                { label: "frozen", value: "AI discovery" },
                { label: "frozen", value: "Community surfaces" },
                { label: "frozen", value: "Artist tier badges" },
              ]}
            />
            <p className="mt-3 font-mono text-2xs leading-relaxed text-ash">
              Flags live in <Code>frontend/src/lib/features.ts</Code>. Nothing was deleted.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    title: "The money path",
    summary: "Flat $10 from the client. Merchant of record. One fee value, pinned by a test.",
    body: (
      <>
        <div className="md:col-span-12">
          <Caption>Fig. 02 — from request to settlement</Caption>
          <MoneyPath />
        </div>

        <div className="mt-14 md:col-span-6">
          <Prose>
            <p>
              The client pays a <strong>flat $10 per booking</strong>; the first booking is free. The artist pays
              nothing — no commission, subscription or listing fee — and tips go 100% to the artist. Inkmity is
              merchant of record and carries the risk.
            </p>
            <p>
              The fee is one config value, <Code>PLATFORM_FEE_BASE_CENTS</Code> / <Code>PLATFORM_FEE_PCT</Code>,
              pinned to the deploy blueprint by a test so it cannot drift silently. The money path is tested at
              zero and at the paid rate.
            </p>
            <p>
              Stripe webhooks are read from the raw body and signature-verified, and each event is recorded in a{" "}
              <Code>WebhookEvent</Code> model so a repeated delivery is recognized rather than settled twice.
            </p>
            <p>
              Client rewards — credits funded from fees that client already paid, capped — are live. Artist tier
              badges are frozen.
            </p>
          </Prose>
        </div>

        <div className="mt-12 md:col-span-5 md:col-start-8 md:mt-14">
          <Caption>Who pays what</Caption>
          <Register
            labelWidth="minmax(0,7rem)"
            rows={[
              { label: "Client", value: "Flat $10 per booking · first free · deposit at booking · balance at capture" },
              { label: "Artist", value: "Nothing · tips 100% · paid out via Connect" },
              { label: "Studio", value: "Its share of the split, via transfer_group" },
              { label: "Inkmity", value: "Merchant of record · carries chargeback risk" },
              { label: "Rewards", value: "Client credits from fees already paid, capped · live" },
            ]}
          />
        </div>
      </>
    ),
  },
  {
    title: "Architecture",
    summary: "React 19 on Vercel. Express 5 + Socket.io on Render, long-running, next to Atlas.",
    body: (
      <>
        <div className="md:col-span-12">
          <Caption>Fig. 03 — core exchange</Caption>
          <Architecture />
        </div>

        <div className="mt-14 md:col-span-6">
          <Prose>
            <p>
              The frontend is a React 19 + Vite + TypeScript single-page app — Tailwind, Radix/shadcn, Framer
              Motion — on Vercel. The backend is Node.js, Express 5, Socket.io and MongoDB through Mongoose,
              running on Render as a <strong>long-running process</strong>.
            </p>
            <p>
              It runs in Render&rsquo;s Ohio region, next to the Atlas cluster. Auth is Clerk with role-based
              access for clients, artists and studios. Redis — ioredis and the Socket.io Redis adapter — is
              optional, for cache and realtime scale when it is needed.
            </p>
          </Prose>
        </div>
        <div className="mt-10 md:col-span-5 md:col-start-8 md:mt-14">
          <Caption>Why not serverless</Caption>
          <Pull cite="README">
            &ldquo;Express + Socket.io needs a long-running process, and the Stripe webhook needs a raw-body
            handler — both break on serverless.&rdquo;
          </Pull>
        </div>
      </>
    ),
  },
  {
    title: "Trust and security",
    summary: "Waiver and intake before any session. Moderation fails closed. Deletion that keeps what the law requires.",
    body: (
      <>
        <div className="md:col-span-6">
          <Prose>
            <p>
              Before a session can be requested, the client signs a consent and liability waiver and completes a
              health and intake form — <strong>enforced on both client and server</strong>. Artists and studios sign
              their own agreements. The signed documents are kept.
            </p>
            <p>
              The API sits behind helmet and a CORS allowlist, with three rate limiters — api, auth, assistant —
              that can be Redis-backed, and a <Code>rejectOperatorKeys</Code> middleware.
            </p>
            <p>
              Moderation <strong>fails closed</strong>: production refuses to boot without a Gemini key unless{" "}
              <Code>MODERATION_FAIL_OPEN=true</Code> is set deliberately. The assistant can run on a separate key so
              heavy chat never starves the moderation quota.
            </p>
            <p>
              Account deletion is self-serve. It erases personal data while retaining transaction and signed-legal
              records as required by law.
            </p>
          </Prose>
        </div>
        <div className="mt-12 md:col-span-5 md:col-start-8 md:mt-0">
          <Caption>Hardening suites — backend integration</Caption>
          <MonoList items={HARDENING} />
          <p className="mt-3 font-mono text-2xs leading-relaxed text-ash">
            Seven of sixty. Each runs against a real database in CI.
          </p>
        </div>
      </>
    ),
  },
  {
    title: "Testing and delivery",
    summary: "545 test files. Deploys gated on green CI. The money path smoke-tested against Stripe.",
    body: (
      <>
        <div className="md:col-span-6">
          <Prose>
            <p>
              <strong>545 test files</strong>, Jest on both sides, and 60 backend integration suites. Ten of them:
            </p>
          </Prose>
          <div className="mt-6 max-w-[58ch]">
            <MonoList items={SUITES} cols={2} />
          </div>
          <Prose className="mt-8">
            <p>
              Render deploys only after CI is green — <Code>autoDeployTrigger: checksPass</Code>. The blueprint
              comment records why: auto-deploy used to start on push, in parallel with CI, &ldquo;so a red backend
              job still shipped to api.inkmity.com&rdquo;.
            </p>
            <p>
              <Code>npm run verify:money</Code> is an end-to-end smoke against the real Stripe test API — deposit →
              split payouts → balance → clawback — and refuses non-test keys. <Code>npm run verify:prod</Code> is a
              read-only production checker: migrations, webhook landing, Stripe endpoint config, recent payments and
              transfers.
            </p>
            <p>
              Playwright visual snapshots at 375, 768 and 1440 assert no horizontal overflow, and a 7-viewport fit
              audit looks for clipped or overflowing elements.
            </p>
          </Prose>
        </div>
        <div className="mt-12 md:col-span-5 md:col-start-8 md:mt-0">
          <Caption>CI — GitHub Actions</Caption>
          <Register
            labelWidth="minmax(0,5.5rem)"
            rows={[
              { label: "Backend", value: "lint · tests with DB integration · coverage" },
              { label: "Frontend", value: "lint · typecheck · build · coverage" },
              { label: "Both", value: "npm audit at high and above" },
            ]}
          />
          <div className="mt-10">
            <Caption>Release gate</Caption>
            <Register
              labelWidth="minmax(0,5.5rem)"
              rows={[
                { label: "Deploy", value: "only on green — checksPass" },
                { label: "Money", value: "verify:money, Stripe test keys only" },
                { label: "Prod", value: "verify:prod, read-only" },
                { label: "Viewports", value: "375 · 768 · 1440, plus a 7-viewport fit audit" },
              ]}
            />
          </div>
        </div>
      </>
    ),
  },
  {
    title: "Provenance",
    summary: "First version by hand. Since June 2026, built with Claude Code — I specify, test, approve.",
    body: (
      <>
        <div className="md:col-span-6">
          <Prose>
            <p>
              I built the first version by hand, August 2025 to January 2026 — <strong>530+ commits</strong>:
              sign-in with Clerk, client and artist dashboards, real-time chat with Socket.IO, a booking calendar,
              image uploads to Cloudinary and a Stripe deposit.
            </p>
            <p>
              I wrote the deposit flow: the booking page calls an Express route that creates a Stripe Checkout
              session, and a webhook verifies the Stripe signature and marks the deposit paid in MongoDB.
            </p>
            <p>
              Since June 2026 I build with <strong>Claude Code</strong>, an AI coding agent. I specify each feature
              and fix, test the result by hand in the live app and approve every release. That testing caught
              sign-in routing, onboarding and translation bugs.
            </p>
            <p>
              I deploy and run the app on Render and Vercel: production environment variables, the live Stripe
              webhook endpoint, database update scripts from the terminal, deploy and server logs when something
              fails.
            </p>
            <p>
              I refocused the product from a marketplace to a booking tool artists link from Instagram, interviewed
              a New York tattoo studio, pitched 10+ shops in person, and set the pricing: a flat $10 booking fee,
              first booking free.
            </p>
          </Prose>
        </div>
        <div className="mt-12 md:col-span-5 md:col-start-8 md:mt-0">
          <Caption>Two hands</Caption>
          <Register
            labelWidth="minmax(0,7.5rem)"
            rows={[
              { label: "By hand", value: "Aug 2025 – Jan 2026 · 530+ commits" },
              { label: "With Claude Code", value: "Jun 2026 – present · I specify, test, approve" },
            ]}
          />
          <div className="mt-10">
            <Caption>The repository today</Caption>
            <Register
              labelWidth="minmax(0,7.5rem)"
              rows={[
                { label: "Routes", value: "29 route files" },
                { label: "Models", value: "38 Mongoose models" },
                { label: "Services", value: "50+ service modules" },
                { label: "Lines", value: "about 199,000 across backend and frontend, tests included" },
              ]}
            />
          </div>
        </div>
      </>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* The study                                                           */
/* ------------------------------------------------------------------ */

const FACTS: Row[] = [
  { label: "Status", value: "Live since July 2026" },
  { label: "City", value: "New York, one workflow" },
  { label: "Fee", value: "Flat $10 per booking, paid by the client; first booking free" },
  { label: "Artists pay", value: "Nothing; tips 100% to the artist" },
  { label: "Stack", value: "React 19 · Express 5 · MongoDB · Socket.io · Stripe · Clerk" },
];

export default function InkmityStudy() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number[]>([1]);

  // Deep link: #inkmity-layer-03 opens that layer on arrival.
  useEffect(() => {
    const m = window.location.hash.match(/^#inkmity-layer-(\d{2})$/);
    if (!m) return;
    const n = Number(m[1]);
    if (n >= 1 && n <= LAYERS.length) {
      setOpen((prev) => (prev.includes(n) ? prev : [...prev, n]));
    }
  }, []);

  const toggle = (n: number) =>
    setOpen((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  return (
    <section id="inkmity" aria-labelledby="inkmity-title" className="relative isolate py-28 md:py-40">
      <span
        aria-hidden="true"
        className="vertical absolute left-6 top-1/2 hidden -translate-y-1/2 font-mono text-2xs uppercase tracking-kicker text-ash lg:block"
      >
        II — Inkmity · Case study
      </span>

      <div className="frame">
        <Gate
          id="inkmity-title"
          numeral="II"
          title="Inkmity"
          kicker="Case study · live"
          lead="The easiest way for an independent NYC tattoo artist to turn Instagram conversations into organized bookings."
        />

        {/* The print and its register */}
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid gap-y-12 md:grid-cols-12 md:gap-x-10"
        >
          <div className="md:col-span-7">
            <div className="relative">
              <motion.div variants={wipe} className="relative aspect-[2/1] border border-line">
                <Image
                  src="/assets/Inkmity.jpg"
                  alt="inkmity.com, the live booking app"
                  fill
                  sizes="(max-width:1024px) 100vw, 60vw"
                  className="object-cover object-top"
                />
              </motion.div>
              <motion.span variants={reveal} className="absolute -bottom-4 -right-3 h-12 w-12">
                <Seal className="h-12 w-12" />
              </motion.span>
            </div>
            <motion.p variants={reveal} className="mt-8 font-mono text-2xs uppercase tracking-label text-ash">
              Print 01 — inkmity.com
            </motion.p>
          </div>

          <motion.div variants={reveal} className="md:col-span-4 md:col-start-9 md:self-end">
            <Register rows={FACTS} align="right" labelWidth="minmax(0,5.5rem)" />
            <a
              href={siteConfig.inkmity}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-stamp mt-8"
            >
              Visit inkmity.com
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Six layers */}
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-28 md:mt-36"
        >
          <motion.div variants={reveal} className="mb-10 flex items-baseline justify-between gap-6">
            <p className="font-mono text-2xs uppercase tracking-kicker text-ash">Six layers · open any</p>
            <p className="hidden font-mono text-2xs tracking-label text-ash sm:block">01 — 06</p>
          </motion.div>

          <ol className="border-b border-line">
            {LAYERS.map((layer, idx) => {
              const n = idx + 1;
              const num = String(n).padStart(2, "0");
              const isOpen = open.includes(n);
              const panelId = `inkmity-layer-${num}`;
              const buttonId = `inkmity-layer-${num}-button`;
              return (
                <motion.li key={layer.title} variants={reveal} className="border-t border-line">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(n)}
                      className="group flex w-full items-baseline gap-6 py-6 text-left md:gap-10"
                    >
                      <span
                        className={`w-8 shrink-0 font-mono text-2xs tracking-label transition-colors duration-300 ${
                          isOpen ? "text-shu-soft" : "text-ash group-hover:text-washi"
                        }`}
                      >
                        {num}
                      </span>
                      <span className="font-serif text-display-md text-washi">{layer.title}</span>
                      <span className="hidden min-w-0 flex-1 truncate font-mono text-2xs text-ash md:block">
                        {layer.summary}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`relative ml-auto flex h-6 w-6 shrink-0 translate-y-1 items-center justify-center transition-[transform,color] duration-500 ease-out ${
                          isOpen ? "rotate-45 text-washi" : "text-ash group-hover:text-washi"
                        }`}
                      >
                        <span className="absolute h-px w-4 bg-current" />
                        <span className="absolute h-4 w-px bg-current" />
                      </span>
                    </button>
                  </h3>

                  <div id={panelId} role="region" aria-labelledby={buttonId}>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reduce ? 0 : 0.5, ease: EASE_OUT }}
                          className="overflow-hidden"
                        >
                          <div className="grid pb-16 pt-4 md:grid-cols-12 md:gap-x-10 md:pb-24 md:pl-[4.5rem]">
                            {layer.body}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </motion.div>

        {/* Close of the chapter */}
        <motion.figure
          variants={stagger(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-28 md:mt-40 md:grid md:grid-cols-12 md:gap-x-10"
        >
          <blockquote className="md:col-span-9 md:col-start-3">
            <p className="font-serif text-display-lg italic text-washi">
              <motion.span variants={wipe} className="block text-balance">
                &ldquo;An artist profile proves nothing. A completed client transaction proves the product.&rdquo;
              </motion.span>
            </p>
          </blockquote>
          <motion.figcaption
            variants={reveal}
            className="mt-6 font-mono text-2xs uppercase tracking-label text-ash md:col-span-9 md:col-start-3"
          >
            — Inkmity product constitution
          </motion.figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
