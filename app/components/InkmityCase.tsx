"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import CountUp from "./CountUp";
import { reveal, rise, stagger, VIEWPORT } from "../lib/motion";
import { siteConfig } from "../site";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

/** Annotations on the live landing page, positioned in percent of the capture. */
const PINS: { n: string; x: number; y: number; title: string; body: string }[] = [
  { n: "1", x: 6.4, y: 36, title: "One link in the bio", body: "Artists keep working from Instagram. Clients book from the link in the artist's bio." },
  { n: "2", x: 56, y: 44.5, title: "Requests arrive as a brief", body: "The client's message becomes a structured brief, extracted with Gemini." },
  { n: "3", x: 56, y: 63.4, title: "Deposit held", body: "Stripe Checkout takes the deposit; a signature-checked webhook marks it paid." },
  { n: "4", x: 75, y: 63.4, title: "Waiver and intake", body: "Signed before a session, enforced on the client and on the server." },
];

const FLOW: { step: string; title: string; sub: string; accent?: boolean }[] = [
  { step: "01", title: "Book", sub: "From the artist's @handle link, or a one-off client link with agreed terms." },
  { step: "02", title: "Waiver + intake", sub: "Consent waiver and health form, enforced on client and server." },
  { step: "03", title: "Deposit", sub: "Collected at booking through Stripe Checkout." },
  { step: "04", title: "Session", sub: "The appointment. The intake is already in the artist's hands." },
  { step: "05", title: "Capture", sub: "Balance charged when both sides confirm, or 6 h after the session ends.", accent: true },
  { step: "06", title: "Split payout", sub: "To the artist, and the studio if there is one, through Stripe Connect." },
  { step: "07", title: "Clawback", sub: "On a chargeback, the payout is reversed." },
];

const SATELLITES: { k: string; v: string }[] = [
  { k: "Clerk", v: "Sign-in, roles: client, artist, studio" },
  { k: "Stripe", v: "Checkout, Connect payouts, webhooks" },
  { k: "Cloudinary", v: "Portfolio and reference images" },
  { k: "Gemini", v: "Moderation, briefs, idea-to-artist matching" },
  { k: "Resend", v: "Email" },
  { k: "Redis", v: "Cache, Socket.io adapter, rate limits" },
  { k: "Sentry + pino", v: "Errors and logs" },
];

const PROBLEMS: { problem: string; approach: string }[] = [
  {
    problem: "Real-time chat and a raw-body Stripe webhook both break on serverless functions.",
    approach: "Run Express 5 and Socket.io as one long-running process on Render, in the same region as the Atlas cluster.",
  },
  {
    problem: "A replayed webhook could apply the same payment twice.",
    approach: "Verify Stripe's signature on the raw body and record every event in a WebhookEvent model, so a replay is ignored.",
  },
  {
    problem: "The balance must only be charged once the session really happened.",
    approach: "Capture when client and artist both confirm, or 6 hours after the session ends. A chargeback claws the payout back.",
  },
  {
    problem: "The booking fee could drift between the code and the deploy.",
    approach: "Keep it as one config value, pinned to the deploy blueprint by a test, and test the money path at zero and at the paid rate.",
  },
  {
    problem: "A failing backend job once shipped to production, because deploys started on push alongside CI.",
    approach: "Deploy only after every CI job is green: autoDeployTrigger: checksPass.",
  },
  {
    problem: "Strangers can upload images and write reviews.",
    approach: "Image and review moderation fails closed. Production refuses to boot without a moderation key unless fail-open is set on purpose.",
  },
];

const PIPELINE = ["Push", "Lint · typecheck · build", "Tests on a real database", "npm audit, high and above", "All green", "Render deploys"];

function Capture() {
  const [active, setActive] = useState<string | null>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 90, damping: 18 });
  const sry = useSpring(ry, { stiffness: 90, damping: 18 });
  const glareX = useTransform(sry, [-4, 4], ["30%", "70%"]);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <motion.figure
        variants={reveal}
        className="lg:col-span-8"
        style={{ perspective: 1400 }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
      >
        <motion.div style={{ rotateX: srx, rotateY: sry }} className="relative">
          {/* layered depth: an offset frame of the gate's light behind the capture */}
          <span aria-hidden="true" className="chamfer-lg absolute -bottom-3 -right-3 left-3 top-3 bg-[rgba(var(--gate-rgb),0.12)] ring-1 ring-inset ring-[rgba(var(--gate-rgb),0.35)]" />
          <div className="chamfer-lg relative aspect-[3414/1896] overflow-hidden bg-void-2 ring-1 ring-inset ring-line-strong">
            <Image src="/assets/Inkmity.jpg" alt="Inkmity's live landing page: the headline, a new booking request, a held deposit and a signed waiver" fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
            <motion.span aria-hidden="true" style={{ left: glareX }} className="pointer-events-none absolute -top-1/2 h-[200%] w-1/3 -translate-x-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
            {PINS.map((p) => (
              <button
                key={p.n}
                type="button"
                aria-label={`${p.n}: ${p.title}`}
                aria-pressed={active === p.n}
                onClick={() => setActive((a) => (a === p.n ? null : p.n))}
                onFocus={() => setActive(p.n)}
                onBlur={() => setActive(null)}
                onPointerEnter={() => setActive(p.n)}
                onPointerLeave={() => setActive(null)}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 p-2"
              >
                <span
                  className={`flex h-6 w-6 rotate-45 items-center justify-center border transition-all duration-500 md:h-7 md:w-7 ${
                    active === p.n ? "scale-125 border-white bg-[var(--gate)] shadow-[0_0_24px_var(--gate)]" : "border-[var(--gate)] bg-void/80 shadow-[0_0_14px_rgba(var(--gate-rgb),0.6)]"
                  }`}
                >
                  <span className="-rotate-45 font-display text-xs font-bold text-white md:text-sm">{p.n}</span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>
        <figcaption className="mt-5 flex flex-wrap justify-between gap-3 hud text-mute">
          <span>Capture · inkmity.com · the live landing page</span>
          <span className="text-[var(--gate)]">Hover or tap a number</span>
        </figcaption>
      </motion.figure>

      <motion.ol variants={reveal} className="space-y-1 self-center lg:col-span-4">
        {PINS.map((p) => (
          <li
            key={p.n}
            onPointerEnter={() => setActive(p.n)}
            onPointerLeave={() => setActive(null)}
            className={`flex gap-4 border-l-2 py-3 pl-4 transition-colors duration-500 ${active === p.n ? "border-[var(--gate)] bg-[rgba(var(--gate-rgb),0.07)]" : "border-line"}`}
          >
            <span className="display text-2xl leading-none text-[var(--gate)]">{p.n}</span>
            <span>
              <span className="block display text-lg tracking-wide text-ice">{p.title}</span>
              <span className="mt-1 block text-[0.95rem] leading-relaxed text-ice-2">{p.body}</span>
            </span>
          </li>
        ))}
      </motion.ol>
    </div>
  );
}

function Label({ children, n }: { children: string; n: string }) {
  return (
    <div className="flex items-center gap-4 hud">
      <span className="text-[var(--gate)]">{n}</span>
      <span className="text-silver">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}

function MoneyPath() {
  return (
    <div>
      <div className="relative">
        {/* the track, with a pulse of light travelling the path */}
        <span aria-hidden="true" className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px overflow-hidden bg-line lg:left-0 lg:top-[11px] lg:h-px lg:w-full">
          <span className="absolute left-0 top-0 h-[10%] w-px bg-gradient-to-b from-transparent via-[var(--gate)] to-transparent motion-safe:animate-travel-y lg:h-px lg:w-[10%] lg:bg-gradient-to-r lg:motion-safe:animate-travel-x" />
        </span>
        <ol className="grid gap-8 lg:grid-cols-7 lg:gap-5">
          {FLOW.map((n) => (
            <motion.li key={n.step} variants={reveal} className="relative pl-10 lg:pl-0 lg:pt-10">
              <span
                aria-hidden="true"
                className={`absolute left-[5px] top-1 h-3.5 w-3.5 rotate-45 border lg:left-0 lg:top-[5px] ${
                  n.accent ? "border-[var(--gate)] bg-[var(--gate)] shadow-[0_0_16px_var(--gate)]" : "border-silver-2 bg-void"
                }`}
              />
              <span className={`hud ${n.accent ? "text-[var(--gate)]" : "text-mute"}`}>{n.step}</span>
              <h5 className={`mt-1.5 display text-xl tracking-wide ${n.accent ? "glow-gate text-[var(--gate)]" : "text-ice"}`}>{n.title}</h5>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-ice-2">{n.sub}</p>
            </motion.li>
          ))}
        </ol>
      </div>
      <motion.p variants={reveal} className="mt-10 max-w-[70ch] border-l-2 border-[var(--gate)] pl-5 text-ice-2">
        <span className="text-ice">The fee:</span> a flat $10 per booking, paid by the client, and the first booking is free.
        Artists pay nothing, and tips go 100% to the artist.
      </motion.p>
    </div>
  );
}

function Tier({ name, host, lines }: { name: string; host: string; lines: string[] }) {
  return (
    <div className="chamfer cut-edge relative bg-void-2/80 p-5 ring-1 ring-inset ring-line-strong">
      <div className="flex items-baseline justify-between gap-3">
        <span className="display text-2xl text-ice">{name}</span>
        <span className="hud text-[var(--gate)]">{host}</span>
      </div>
      <ul className="mt-4 space-y-1.5 text-[0.92rem] text-ice-2">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

function Link2() {
  return (
    <div aria-hidden="true" className="relative flex items-center justify-center py-3 lg:py-0">
      <span className="relative block h-10 w-px overflow-hidden bg-line-strong lg:h-px lg:w-full">
        <span className="absolute left-0 top-0 h-1/3 w-px bg-sys motion-safe:animate-travel-y lg:h-px lg:w-1/3 lg:motion-safe:animate-travel-x" />
      </span>
    </div>
  );
}

function Architecture() {
  return (
    <div>
      <div className="grid items-center lg:grid-cols-[1fr_4rem_1.15fr_4rem_1fr]">
        <Tier name="Browser" host="Vercel" lines={["React 19 · Vite · TypeScript", "Tailwind · Radix", "Framer Motion"]} />
        <Link2 />
        <Tier name="API" host="Render · Ohio" lines={["Node.js · Express 5", "Socket.io for real-time chat", "One long-running process", "Stripe webhook on a raw body"]} />
        <Link2 />
        <Tier name="Data" host="Atlas" lines={["MongoDB Atlas", "Mongoose · 38 models", "Same region as the API"]} />
      </div>
      <dl className="mt-8 grid gap-x-10 border-y border-line sm:grid-cols-2 lg:grid-cols-4">
        {SATELLITES.map((s) => (
          <div key={s.k} className="border-b border-line py-3.5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0">
            <dt className="hud text-silver">{s.k}</dt>
            <dd className="mt-1 text-[0.92rem] text-ice-2">{s.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * The flagship case study. Inkmity, as it actually is: the live product with
 * its parts annotated, what it does and what I built, the money path, the
 * architecture, the problems and how they were solved, how it ships, and how
 * it was made. Every number is from the repository.
 */
export default function InkmityCase() {
  return (
    <article id="inkmity" aria-labelledby="inkmity-title" className="gate-red relative scroll-mt-24">
      {/* Title card */}
      <motion.div variants={stagger(0.14)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <motion.p variants={reveal} className="hud flex items-center gap-3 text-[var(--gate)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[var(--gate)]" />
            Flagship · Live since July 2026
          </motion.p>
          <h3 id="inkmity-title" className="mt-4 display text-display-hero">
            <motion.span variants={rise} className="metal block pb-[0.05em]">
              Inkmity
            </motion.span>
          </h3>
          <motion.p variants={reveal} className="mt-6 max-w-[48ch] text-pretty text-xl leading-relaxed text-ice">
            A booking tool for independent New York tattoo artists. One link in the artist&rsquo;s Instagram bio turns a DM
            conversation into a booking with a deposit, a signed waiver and a calendar slot.
          </motion.p>
        </div>
        <motion.dl variants={reveal} className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 lg:col-span-5">
          <div>
            <dt className="hud text-mute">Role</dt>
            <dd className="mt-1 text-ice">Founder, and the only engineer</dd>
          </div>
          <div>
            <dt className="hud text-mute">Since</dt>
            <dd className="mt-1 text-ice">August 2025</dd>
          </div>
          <div className="col-span-2">
            <dt className="hud text-mute">Stack</dt>
            <dd className="mt-1 text-ice">React · TypeScript · Node.js · Express · MongoDB · Stripe · Socket.IO</dd>
          </div>
          <div className="col-span-2">
            <a href={siteConfig.inkmity} target="_blank" rel="noopener noreferrer" className="btn-sys">
              Visit inkmity.com ↗{NEW_TAB}
            </a>
          </div>
        </motion.dl>
      </motion.div>

      {/* The product, annotated */}
      <motion.div variants={stagger(0.12)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-20 md:mt-28">
        <Capture />
      </motion.div>

      {/* What it does, what I built */}
      <motion.div variants={stagger(0.12)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-24 grid gap-12 md:mt-32 lg:grid-cols-12">
        <motion.div variants={reveal} className="scrim -mx-6 px-6 py-2 lg:col-span-5">
          <Label n="A">What it does</Label>
          <p className="prose-sys mt-6">
            Artists share their link or send a one-off invite with agreed terms. Clients book a consultation or a session,
            sign the waiver and health intake, and pay the deposit. After the session the balance is charged, the payout is
            split, and the client can tip and leave a verified review. Chat between the two is real time.
          </p>
        </motion.div>
        <motion.div variants={reveal} className="scrim -mx-6 px-6 py-2 lg:col-span-6 lg:col-start-7">
          <Label n="B">What I built</Label>
          <p className="prose-sys mt-6">
            I wrote the first version alone, <strong>August 2025 to January 2026, 530+ commits</strong>: Clerk sign-in, client
            and artist dashboards, Socket.IO chat, a booking calendar, Cloudinary uploads and the Stripe deposit. I wrote the
            deposit flow myself: an Express route creates the Checkout session, and a webhook verifies Stripe&rsquo;s signature
            and marks the deposit paid in MongoDB.
          </p>
          <p className="prose-sys mt-4">
            Since June 2026 I build it with <strong>Claude Code</strong>, an AI coding agent. I specify each feature and fix,
            test the result by hand in the live app and approve every release. I deploy and run it myself.
          </p>
        </motion.div>
      </motion.div>

      {/* Money path */}
      <motion.div variants={stagger(0.08)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-24 md:mt-32">
        <Label n="C">The money path</Label>
        <motion.p variants={reveal} className="mt-5 max-w-[60ch] text-ice-2">
          Inkmity is the merchant of record and carries the risk, so every step that moves money is explicit.
        </motion.p>
        <div className="mt-12">
          <MoneyPath />
        </div>
      </motion.div>

      {/* Architecture */}
      <motion.div variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-24 md:mt-32">
        <Label n="D">Architecture</Label>
        <motion.div variants={reveal} className="mt-10">
          <Architecture />
        </motion.div>
      </motion.div>

      {/* Problems and approaches */}
      <motion.div variants={stagger(0.08)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-24 md:mt-32">
        <Label n="E">Problems, and how I solved them</Label>
        <ol className="mt-10 divide-y divide-line border-y border-line">
          {PROBLEMS.map((p, i) => (
            <motion.li key={p.problem} variants={reveal} className="grid gap-4 py-7 md:grid-cols-12 md:gap-8">
              <span className="display text-3xl leading-none text-[var(--gate)] md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-lg leading-snug text-ice md:col-span-5">{p.problem}</p>
              <p className="flex gap-3 text-ice-2 md:col-span-6">
                <span aria-hidden="true" className="mt-2 h-px w-6 shrink-0 bg-[var(--gate)]" />
                <span>{p.approach}</span>
              </p>
            </motion.li>
          ))}
        </ol>
      </motion.div>

      {/* Delivery */}
      <motion.div variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="mt-24 md:mt-32">
        <Label n="F">How it ships</Label>
        <div className="mt-10 grid grid-cols-3 gap-4 md:gap-8">
          {[
            { n: 545, k: "test files" },
            { n: 60, k: "integration suites" },
            { n: 7, k: "viewports in the layout audit" },
          ].map((s) => (
            <motion.div key={s.k} variants={reveal} className="border-l border-[rgba(var(--gate-rgb),0.5)] pl-4">
              <p className="display text-display-lg leading-none text-ice">
                <CountUp to={s.n} />
              </p>
              <p className="mt-2 text-sm text-ice-2">{s.k}</p>
            </motion.div>
          ))}
        </div>
        <motion.ol variants={reveal} className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-3">
          {PIPELINE.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span className={`chamfer cut-edge px-3.5 py-2 text-sm ring-1 ring-inset ${i === PIPELINE.length - 2 ? "bg-[rgba(var(--gate-rgb),0.16)] text-ice ring-[rgba(var(--gate-rgb),0.6)]" : "bg-void-2/80 text-ice-2 ring-line-strong"}`}>
                {s}
              </span>
              {i < PIPELINE.length - 1 && <span aria-hidden="true" className="text-mute">→</span>}
            </li>
          ))}
        </motion.ol>
        <motion.p variants={reveal} className="mt-8 max-w-[70ch] text-ice-2">
          Two scripts check the money outside CI: one runs deposit, split payouts, balance and clawback end to end against
          Stripe&rsquo;s test API and refuses live keys; the other is a read-only check of production.
        </motion.p>
      </motion.div>
    </article>
  );
}
