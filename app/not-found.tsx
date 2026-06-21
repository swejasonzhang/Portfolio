import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="gradient-text text-7xl font-bold md:text-8xl">404</h1>
      <p className="max-w-md text-gray-400">
        This page drifted out of balance — it doesn&apos;t exist (or moved
        elsewhere).
      </p>
      <Link
        href="/"
        className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
      >
        Back home
      </Link>
    </div>
  );
}
