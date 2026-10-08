import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="gc-ticket rounded-ticket bg-tinta p-8 text-papel">
        <p className="font-display text-6xl leading-none text-energia-400" aria-hidden="true">
          404
        </p>
        <h1 className="gc-display mt-2 font-display text-2xl uppercase">Sin carburante por aqui</h1>
        <p className="mt-2 text-sm text-papel/80">
          Esa pagina no existe (o se quedo sin gasolina).
        </p>
        <Link href="/" className="mt-5 inline-block">
          <Button variante="primary">Volver al buscador</Button>
        </Link>
      </div>
    </div>
  );
}
