import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <section className="relative w-full min-h-screen bg-white text-black px-6 pt-24 pb-16 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-extrabold tracking-tight mb-4">404</h1>
      <p className="text-xl mb-8">Projecte no trobat</p>
      <div className="flex gap-6 text-sm">
        <Link href="/projects" className="underline hover:text-red-500 transition-colors">
          Tots els projectes
        </Link>
        <Link href="/" className="underline hover:text-red-500 transition-colors">
          Inici
        </Link>
      </div>
    </section>
  );
}
