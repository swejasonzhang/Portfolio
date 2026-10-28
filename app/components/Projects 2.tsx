import ArcCase from "./ArcCase";
import InkmityCase from "./InkmityCase";
import ProjectIndex from "./ProjectIndex";
import SectionHeader from "./SectionHeader";

/**
 * Gate 01 — the S-Rank gate. Inkmity first and deepest, then the hackathon,
 * then the earlier builds as an index.
 */
export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="gate-red relative isolate py-28 md:py-40">
      <div className="frame">
        <SectionHeader
          index={1}
          id="projects-title"
          title="Projects"
          lead="What each one does, what I built, the problems in it and how I solved them. Every number comes from the repository."
        />
        <div className="mt-20 md:mt-28">
          <InkmityCase />
        </div>
        <div className="mt-36 md:mt-48">
          <ArcCase />
        </div>
        <div className="mt-36 md:mt-48">
          <ProjectIndex />
        </div>
      </div>
    </section>
  );
}
