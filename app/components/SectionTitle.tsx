import Reveal from "./Reveal";

export default function SectionTitle({ id, eyebrow, title, lead }: { id: string; eyebrow: string; title: string; lead?: string }) {
  return (
    <Reveal className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-muted">{lead}</p>}
    </Reveal>
  );
}
