"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import CountUp from "./CountUp";
import GateHeader from "./GateHeader";
import SystemWindow from "./SystemWindow";
import { siteConfig } from "../site";
import { EASE_OUT, reveal, rise, stagger, VIEWPORT } from "../lib/motion";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const GATE_INFO: { k: string; v: string }[] = [
  { k: "Status", v: "Live since July 2026" },
  { k: "Territory", v: "New York, one workflow" },
  { k: "Fee", v: "Flat $10 per booking, paid by the client; first booking free" },
  { k: "Artists pay", v: "Nothing; tips 100% to the artist" },
  { k: "Stack", v: "React 19 · Express 5 · MongoDB · Socket.io · Stripe · Clerk" },
];

const FROZEN = [
  "Studio tooling",
  "Nationwide discovery",
  "AI discovery",
  "Community surfaces",
  "Artist tier badges",
];

const MONEY_NODES: { step: string; title: string; sub: string; accent?: boolean }[] = [
  { step: "01", title: "Book", sub: "From the artist's permanent @handle link, or a one-off client link with agreed terms." },
  { step: "02", title: "Waiver + intake", sub: "Consent / liability waiver and health form. Enforced on client and server." },
  { step: "03", title: "Deposit", sub: "Collected at booking through Stripe Checkout." },
  { step: "04", title: "Session", sub: "The appointment itself. Intake is already in the artist's hands." },
  { step: "05", title: "Capture", sub: "Balance captured when both client and artist verify, or 6 h after the session ends.", accent: true },
  { step: "06", title: "Split payout", sub: "Artist / studio via Stripe Connect, transfer_group." },
  { step: "07", title: "Clawback", sub: "On chargeback, the payout is clawed back." },
];

const FEE_CONTRACT: { k: string; v: string }[] = [
  { k: "Fee", v: "Flat $10 per booking" },
  { k: "Who pays", v: "The client, never the artist" },
  { k: "First booking", v: "Free" },
  { k: "Artist pays", v: "No commission, subscription or listing fee" },
  { k: "Tips", v: "100% to the artist" },
  { k: "Rewards", v: "Client credits funded from fees already paid, capped · live" },
  { k: "Pinned by", v: "PLATFORM_FEE_BASE_CENTS / PLATFORM_FEE_PCT, asserted against the deploy blueprint by a test" },
];

const SATELLITES: { k: string; v: string }[] = [
  { k: "Clerk", v: "Auth · RBAC: client / artist / studio" },
  { k: "Stripe", v: "Checkout · PaymentIntents · Connect split payouts · webhooks" },
  { k: "Cloudinary", v: "Media" },
  { k: "Gemini", v: "Moderation, fails closed · brief extraction · assistant on its own key" },
  { k: "Resend / Nodemailer", v: "Email" },
  { k: "Redis", v: "ioredis cache · Socket.io adapter · optional" },
  { k: "Sentry + pino", v: "Monitoring and logging" },
];

const SECURITY: { k: string; v: ReactNode }[] = [
  { k: "Headers", v: "helmet" },
  { k: "Origins", v: "CORS allowlist" },
  { k: "Rate limits", v: "Three limiters: api / auth / assistant, with a Redis-backed option" },
  { k: "Operator keys", v: "rejectOperatorKeys middleware" },
  { k: "Legal", v: "Signed client waiver and artist / studio agreements, enforced before a session on client and server" },
  { k: "Deletion", v: "Self-serve account deletion erases personal data; transaction and signed-legal records are retained as required by law" },
];

const HARDENING = [
  "authzHardening",
  "operatorInjection",
  "racesHardening",
  "signedDocumentPrivacy",
  "instagramTokenPrivacy",
  "disputedBookingFreeze",
  "webhookAmountMismatch",
];

const SUITES = [
  "depositEscrow",
  "depositGuarantee",
  "balanceCaptureAtomicity",
  "webhookAmountMismatch",
  "statementDescriptorStability",
  "disputeEvidencePacket",
  "noShowSettlement",
  "slotReleaseLifecycle",
  "studioBookingSplit",
  "accountDeletion",
];

const CI_JOBS: { k: string; v: string }[] = [
  { k: "Backend", v: "lint + tests with DB integration + coverage" },
  { k: "Frontend", v: "lint + typecheck + build + coverage" },
  { k: "Audit", v: "npm audit at high and above, both sides" },
];

const VERIFY: { k: string; v: string }[] = [
  {
    k: "npm run verify:money",
    v: "End-to-end smoke against the real Stripe TEST API: deposit → split payouts → balance → clawback. Refuses non-test keys.",
  },
  {
    k: "npm run verify:prod",
    v: "Read-only production checker: migrations, webhook landing, Stripe endpoint config, recent payments and transfers.",
  },
  {
    k: "Playwright",
    v: "Visual snapshots at 375 / 768 / 1440 asserting no horizontal overflow, plus a 7-viewport fit audit for clipped or overflowing elements.",
  },
];

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

/** camelCase identifier → spaced words, so it stays readable in the all-caps System face. */
const words = (id: string) => id.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

/** A ruled mono register: label left, value right. */
function Register({
  rows,
  className = "",
  valueClassName = "",
}: {
  rows: { k: string; v: ReactNode }[];
  className?: string;
  valueClassName?: string;
}) {
  return (
    <dl className={`divide-y divide-line ${className}`}>
      {rows.map((r) => (
        <div
          key={r.k}
          className="flex flex-col gap-1.5 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
        >
          <dt className="hud shrink-0 text-mute">{r.k}</dt>
          <dd className={`text-sm leading-relaxed text-ice sm:text-right ${valueClassName}`}>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`space-y-4 text-pretty text-sm leading-relaxed text-ice-2 md:text-base ${className}`}>
      {children}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 hud text-mute">
      <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[var(--gate)]" />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floors                                                             */
/* ------------------------------------------------------------------ */

function FloorOne() {
  return (
    <div className="grid gap-10 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-5">
        <Prose>
          <p>
            Inkmity is deliberately narrow: one workflow, one city. It is a booking tool for independent
            tattoo artists in New York. It is not a marketplace, a social network, a studio OS or a
            national directory (yet).
          </p>
          <p>
            Artists keep working from Instagram. Inkmity sits behind the link in their bio and turns a
            DM conversation into a booking with a deposit, a signed waiver and a calendar slot.
          </p>
        </Prose>
      </div>

      <div className="md:col-span-7">
        <SystemWindow title="Frozen" right="features.ts" animate={false} bodyClassName="px-5 py-1 md:px-6">
          <ul className="divide-y divide-line">
            {FROZEN.map((f) => (
              <li key={f} className="flex items-baseline justify-between gap-6 py-3.5">
                <span className="text-sm text-ice">{f}</span>
                <span className="hud text-[var(--gate)]">Frozen</span>
              </li>
            ))}
          </ul>
        </SystemWindow>
        <p className="mt-4 text-pretty text-sm leading-relaxed text-ice-2">
          Features that are built but not yet needed are frozen behind flags, not deleted.
        </p>
      </div>
    </div>
  );
}

function FloorTwo() {
  const last = MONEY_NODES.length - 1;
  return (
    <div>
      <ol className="grid md:grid-cols-7">
        {MONEY_NODES.map((n, i) => (
          <li key={n.step} className="relative pb-10 pl-8 last:pb-0 md:pb-0 md:pl-0 md:pr-5 md:pt-9">
            {/* connector to the next node */}
            {i !== last && (
              <span
                aria-hidden="true"
                className="absolute left-[7px] top-0 h-full w-px bg-line md:left-0 md:top-[7px] md:h-px md:w-full"
              />
            )}
            {/* joint */}
            <span
              aria-hidden="true"
              className={`absolute left-[2px] top-[2px] h-[11px] w-[11px] rotate-45 border bg-void ${
                n.accent ? "border-[var(--gate)] bg-[rgba(var(--gate-rgb),0.3)]" : "border-sys"
              }`}
            />
            <span className={`hud block ${n.accent ? "text-[var(--gate)]" : "text-mute"}`}>{n.step}</span>
            <h4
              className={`mt-2 font-display text-display-sm uppercase ${
                n.accent ? "glow-gate text-[var(--gate)]" : "text-ice"
              }`}
            >
              {n.title}
            </h4>
            <p className="mt-2 max-w-[28ch] text-pretty text-sm leading-relaxed text-ice-2">{n.sub}</p>
          </li>
        ))}
      </ol>

      {/* Side branch */}
      <div className="mt-10 md:grid md:grid-cols-7">
        <div className="relative pl-8 md:col-span-3 md:col-start-4 md:pl-0 md:pt-9">
          <span
            aria-hidden="true"
            className="absolute left-[7px] -top-10 h-10 w-px bg-line md:left-[7px] md:-top-6 md:h-6"
          />
          <span
            aria-hidden="true"
            className="absolute left-[2px] top-[2px] h-[11px] w-[11px] rotate-45 border border-sys bg-void"
          />
          <span className="hud block text-mute">Side branch</span>
          <h4 className="mt-2 font-display text-display-sm uppercase text-ice">Tip → 100% to the artist</h4>
          <p className="mt-2 max-w-[32ch] text-pretty text-sm leading-relaxed text-ice-2">
            Post-session tips are destination charges routed entirely to the artist.
          </p>
        </div>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-12 md:gap-8">
        <Prose className="md:col-span-5">
          <p>
            Inkmity is merchant of record and carries the risk. A client pays a flat $10 per booking and the
            first one is free; the artist is never charged.
          </p>
          <p>
            The fee is one config value, pinned to the deploy blueprint by a test so it cannot drift
            silently. The money path is tested at zero and at the paid rate.
          </p>
          <p>
            Stripe webhooks arrive on a raw-body handler, the signature is verified, and every event is
            recorded in a WebhookEvent model so a replay cannot be applied twice.
          </p>
        </Prose>
        <div className="md:col-span-7">
          <SystemWindow title="Fee contract" right="One config value" animate={false} bodyClassName="px-5 py-1 md:px-6">
            <Register rows={FEE_CONTRACT} />
          </SystemWindow>
        </div>
      </div>
    </div>
  );
}

function Tier({ title, right, lines }: { title: string; right: string; lines: string[] }) {
  return (
    <SystemWindow title={title} right={right} animate={false} className="h-full" bodyClassName="px-5 py-1 md:px-6">
      <ul className="divide-y divide-line">
        {lines.map((l) => (
          <li key={l} className="py-3 font-mono text-xs text-ice">
            {l}
          </li>
        ))}
      </ul>
    </SystemWindow>
  );
}

function Seam() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center py-2 md:py-0">
      <span className="h-8 w-px bg-line md:hidden" />
      <span className="rule hidden w-full md:block" />
    </div>
  );
}

function FloorThree() {
  const half = Math.ceil(SATELLITES.length / 2);
  return (
    <div>
      <div className="grid md:grid-cols-[1fr_3rem_1fr_3rem_1fr] md:items-stretch">
        <Tier title="Browser" right="Vercel" lines={["React 19 · Vite · TypeScript", "Tailwind · Radix / shadcn", "Framer Motion"]} />
        <Seam />
        <Tier
          title="API"
          right="Render · Ohio"
          lines={["Node.js · Express 5", "Socket.io realtime", "Long-running process", "Stripe webhook: raw body"]}
        />
        <Seam />
        <Tier title="Data" right="Atlas" lines={["MongoDB Atlas", "Mongoose · 38 models", "Same region as the API"]} />
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-12 md:gap-8">
        <Prose className="md:col-span-5">
          <p>
            A React 19 single-page app on Vercel talks to an Express 5 API that runs as a long-running
            process on Render, in the Ohio region next to the Atlas cluster.
          </p>
          <p>
            Why not serverless, from the repository:{" "}
            <span className="text-ice">
              &ldquo;Express + Socket.io needs a long-running process, and the Stripe webhook needs a
              raw-body handler — both break on serverless.&rdquo;
            </span>
          </p>
        </Prose>
        <div className="md:col-span-7">
          <Label>Satellites</Label>
          <div className="mt-4 grid border-y border-line md:grid-cols-2 md:gap-x-10">
            <Register rows={SATELLITES.slice(0, half)} valueClassName="font-mono text-xs" />
            <Register rows={SATELLITES.slice(half)} valueClassName="font-mono text-xs" className="border-t border-line md:border-t-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FloorFour() {
  return (
    <div className="grid gap-10 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-7">
        <Register rows={SECURITY} className="border-y border-line" />
        <SystemWindow title="Warning" tone="danger" alert animate={false} className="mt-8 max-w-md">
          <p className="text-pretty text-sm leading-relaxed text-ice">
            Moderation <span className="text-danger">fails closed</span>. Production refuses to boot without a
            Gemini key unless <span className="font-mono text-xs">MODERATION_FAIL_OPEN=true</span> is set
            deliberately.
          </p>
        </SystemWindow>
      </div>
      <div className="md:col-span-5">
        <SystemWindow title="Hardening suites" right="Jest · backend" animate={false} bodyClassName="px-5 py-1 md:px-6">
          <ul className="divide-y divide-line">
            {HARDENING.map((h) => (
              <li key={h} className="py-3 font-mono text-xs text-ice">
                {words(h)}
              </li>
            ))}
          </ul>
        </SystemWindow>
      </div>
    </div>
  );
}

function FloorFive() {
  return (
    <div>
      <div className="grid grid-cols-3 border-y border-line">
        {[
          { n: 545, k: "Test files" },
          { n: 60, k: "Integration suites" },
          { n: 7, k: "Viewports in the fit audit" },
        ].map((s, i) => (
          <div key={s.k} className={`py-6 ${i > 0 ? "border-l border-line pl-4 md:pl-8" : ""}`}>
            <div className="glow-gate font-display text-display-lg uppercase text-[var(--gate)]">
              <CountUp to={s.n} />
            </div>
            <div className="hud mt-2 text-mute">{s.k}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <SystemWindow title="Integration suites" right="10 of 60" animate={false} bodyClassName="px-5 py-1 md:px-6">
            <ul className="divide-y divide-line">
              {SUITES.map((s) => (
                <li key={s} className="py-3 font-mono text-xs text-ice">
                  {words(s)}
                </li>
              ))}
            </ul>
          </SystemWindow>
        </div>

        <div className="space-y-10 md:col-span-7">
          <SystemWindow title="CI" right="GitHub Actions" animate={false} bodyClassName="px-5 py-1 md:px-6">
            <Register rows={CI_JOBS} />
          </SystemWindow>

          <div>
            <Label>Deploy gate</Label>
            <Prose className="mt-4">
              <p>
                Render deploys only after CI is green,{" "}
                <span className="font-mono text-xs text-ice">autoDeployTrigger: checksPass</span>. The
                blueprint records why: auto-deploy used to start on push in parallel with CI,{" "}
                <span className="text-ice">
                  &ldquo;so a red backend job still shipped to api.inkmity.com&rdquo;.
                </span>
              </p>
            </Prose>
          </div>

          <div>
            <Label>Verification</Label>
            <Register rows={VERIFY} className="mt-4 border-y border-line" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FloorSix() {
  return (
    <div className="grid gap-10 md:grid-cols-12 md:gap-8">
      <Prose className="md:col-span-7">
        <p>
          I built the first version by hand, August 2025 to January 2026, 530+ commits: sign-in with
          Clerk, client and artist dashboards, real-time chat with Socket.IO, a booking calendar, image
          uploads to Cloudinary and a Stripe deposit. I wrote the deposit flow: the booking page calls an
          Express route that creates a Stripe Checkout session, and a webhook verifies the Stripe signature
          and marks the deposit paid in MongoDB.
        </p>
        <p>
          Since June 2026 I build with Claude Code, an AI coding agent. I specify each feature and fix,
          test the result by hand in the live app and approve every release. That is how the sign-in
          routing, onboarding and translation bugs were caught.
        </p>
        <p>
          I deploy and run the app on Render and Vercel: production environment variables, the live
          Stripe webhook endpoint, database update scripts from the terminal, and the deploy and server
          logs when something fails.
        </p>
        <p>
          I refocused the product from a marketplace to a booking tool artists link from Instagram,
          interviewed a New York tattoo studio, pitched 10+ shops in person, and set the pricing: a flat
          $10 booking fee, first booking free.
        </p>
      </Prose>

      <div className="md:col-span-5">
        <SystemWindow title="Build log" right="Aug 2025 – present" animate={false} bodyClassName="px-5 py-1 md:px-6">
          <dl className="divide-y divide-line">
            <div className="py-4">
              <dt className="hud text-[var(--gate)]">By hand</dt>
              <dd className="mt-1.5 text-sm text-ice">
                Aug 2025 – Jan 2026 · <CountUp to={530} suffix="+" /> commits
              </dd>
            </div>
            <div className="py-4">
              <dt className="hud text-[var(--gate)]">With Claude Code</dt>
              <dd className="mt-1.5 text-sm text-ice">Jun 2026 – present · I specify, test, approve</dd>
            </div>
            <div className="py-4">
              <dt className="hud text-mute">Repository today</dt>
              <dd className="mt-1.5 font-mono text-xs leading-relaxed text-ice-2">
                29 route files · 38 models · 50+ services · ~199k lines incl. tests
              </dd>
            </div>
          </dl>
        </SystemWindow>
        <p className="hud mt-4 text-mute">Founder &amp; Software Developer · Aug 2025 – Present</p>
      </div>
    </div>
  );
}

const FLOORS: { n: number; title: string; summary: string; body: () => ReactNode; boss?: boolean }[] = [
  { n: 1, title: "The scope", summary: "One workflow, one city. Built but not needed → frozen behind a flag.", body: FloorOne },
  { n: 2, title: "The money path", summary: "Flat $10, paid by the client. Deposit → capture → split → clawback.", body: FloorTwo, boss: true },
  { n: 3, title: "Architecture", summary: "React SPA on Vercel ⇄ Express + Socket.io on Render ⇄ Atlas.", body: FloorThree },
  { n: 4, title: "Trust and security", summary: "Fails closed. Signed before a session. Deleted on request.", body: FloorFour },
  { n: 5, title: "Testing and delivery", summary: "545 test files. Deploys only after CI is green.", body: FloorFive },
  { n: 6, title: "Provenance", summary: "By hand, then with Claude Code. I approve every release.", body: FloorSix },
];

const panelId = (n: number) => `inkmity-floor-${n}`;

/* ------------------------------------------------------------------ */
/*  Gate 01                                                            */
/* ------------------------------------------------------------------ */

/**
 * Gate 01, the S-Rank gate. Inkmity as a dungeon: the capture and gate info
 * on the threshold, then six floors to descend, each a disclosure.
 */
export default function Dungeon() {
  const [open, setOpen] = useState<Set<number>>(() => new Set([1]));
  const reduce = useReducedMotion();

  const toggle = useCallback((n: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }, []);

  // Open the floor named in the URL hash (#inkmity-floor-3) on mount and on change.
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#inkmity-floor-([1-6])$/);
      if (!m) return;
      const n = Number(m[1]);
      setOpen((prev) => (prev.has(n) ? prev : new Set(prev).add(n)));
      requestAnimationFrame(() => {
        document.getElementById(`${panelId(n)}-button`)?.scrollIntoView({ block: "start" });
      });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  return (
    <section
      id="inkmity"
      aria-labelledby="inkmity-title"
      className="gate-red relative isolate overflow-hidden py-24 md:py-36"
    >
      <span
        aria-hidden="true"
        className="vertical hud absolute left-6 top-1/2 hidden -translate-y-1/2 text-mute lg:block"
      >
        Gate 01 — Inkmity
      </span>

      <div className="frame">
        <GateHeader
          id="inkmity-title"
          gate="01"
          rank="S-Rank"
          status="Live · inkmity.com"
          title="Inkmity"
          subtitle="The easiest way for an independent NYC tattoo artist to turn Instagram conversations into organized bookings."
        />

        {/* Threshold: capture + gate info */}
        <motion.div
          variants={stagger(0.16)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid gap-10 md:grid-cols-12 md:gap-8"
        >
          <motion.figure variants={reveal} className="md:col-span-7">
            <div className="relative aspect-[2/1] border border-[rgba(var(--gate-rgb),0.4)]">
              <Image
                src="/assets/Inkmity.jpg"
                alt="Inkmity, the live app"
                fill
                sizes="(max-width:1024px) 100vw, 60vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="flex justify-between gap-4 border border-t-0 border-line px-3 py-2 hud text-mute">
              <span>Capture 01 · inkmity.com</span>
              <span>Live since Jul 2026</span>
            </figcaption>
          </motion.figure>

          <div className="flex flex-col gap-6 md:col-span-5">
            <SystemWindow title="Gate info" right="S-Rank" bodyClassName="px-5 py-1 md:px-6">
              <Register rows={GATE_INFO} />
            </SystemWindow>
            <motion.div variants={reveal}>
              <a
                href={siteConfig.inkmity}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-3 border border-[rgba(var(--gate-rgb),0.6)] bg-[rgba(var(--gate-rgb),0.1)] px-5 font-mono text-2xs uppercase tracking-label text-[var(--gate)] transition-all duration-300 hover:bg-[var(--gate)] hover:text-void sm:w-auto"
              >
                Enter inkmity.com ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Floors */}
        <div className="mt-24 md:mt-32">
          <div className="flex items-center gap-4 hud text-mute">
            <span className="text-[var(--gate)]">Floors</span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
            <span className="text-right">Six floors · descend in any order</span>
          </div>

          <ul className="mt-6 border-b border-line">
            {FLOORS.map((f) => {
              const isOpen = open.has(f.n);
              const id = panelId(f.n);
              const Body = f.body;
              return (
                <li key={f.n} className="border-t border-line">
                  <h3>
                    <button
                      type="button"
                      id={`${id}-button`}
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() => toggle(f.n)}
                      className="group flex w-full items-baseline gap-5 py-6 text-left md:gap-8"
                    >
                      <span
                        className={`font-display text-display-md transition-[color,text-shadow] duration-300 ${
                          f.boss
                            ? `text-[var(--gate)] ${isOpen ? "glow-gate" : "opacity-80 group-hover:opacity-100"}`
                            : `text-ice-2 group-hover:text-[var(--gate)] ${isOpen ? "glow-gate text-[var(--gate)]" : ""}`
                        }`}
                      >
                        F{f.n}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-4 gap-y-2 md:flex-none">
                        <span className="font-display text-display-md uppercase text-ice">{f.title}</span>
                        {f.boss && (
                          <span className="hud border border-[rgba(var(--gate-rgb),0.6)] bg-[rgba(var(--gate-rgb),0.1)] px-2 py-0.5 text-[var(--gate)]">
                            Boss floor
                          </span>
                        )}
                      </span>
                      <span className="hidden min-w-0 flex-1 truncate font-mono text-2xs text-mute transition-colors duration-300 group-hover:text-ice-2 md:block">
                        {f.summary}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`relative ml-auto h-4 w-4 shrink-0 self-center transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        <span
                          className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 transition-colors duration-300 ${
                            isOpen ? "bg-[var(--gate)]" : "bg-line-strong group-hover:bg-[var(--gate)]"
                          }`}
                        />
                        <span
                          className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 transition-colors duration-300 ${
                            isOpen ? "bg-[var(--gate)]" : "bg-line-strong group-hover:bg-[var(--gate)]"
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={id}
                        id={id}
                        role="region"
                        aria-labelledby={`${id}-button`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.9, ease: EASE_OUT }}
                        className="overflow-hidden"
                      >
                        <div className="pb-14 pt-2 md:pb-20 md:pl-[4.5rem]">
                          <Body />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Cleared stamp */}
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-20 flex flex-wrap items-center justify-between gap-4 border-y border-[rgba(var(--gate-rgb),0.5)] bg-[rgba(var(--gate-rgb),0.05)] px-5 py-4"
        >
          <p className="hud glow-gate text-[var(--gate)]">
            <span>[Gate 01 · S-Rank]</span> Status: cleared and live
          </p>
          <a
            href={siteConfig.inkmity}
            target="_blank"
            rel="noopener noreferrer"
            className="link-sys hud inline-flex min-h-[44px] items-center text-mute"
          >
            Live since July 2026 · inkmity.com<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
