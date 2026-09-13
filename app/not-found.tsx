import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-6xl">⛽</p>
      <h1 className="mt-2 text-2xl font-extrabold">404 · Sin carburante por aquí</h1>
      <p className="mt-1 text-neutral-600 dark:text-neutral-400">Esa página no existe (o se quedó sin gasolina).</p>
      <Link href="/" className="mt-4 inline-block rounded-full bg-energia-600 px-5 py-2 font-semibold text-white">
        Volver al buscador
      </Link>
    </div>
  );
}
