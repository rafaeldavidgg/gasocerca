import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Estado vacio del sistema (reemplaza parrafos sueltos). */
export function Empty({
  icono,
  titulo,
  texto,
  className,
}: {
  icono?: ReactNode;
  titulo: string;
  texto?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "gc-ticket grid gap-1 rounded-ticket border-dashed bg-white/60 p-6 text-center dark:bg-neutral-950",
        className
      )}
    >
      {icono && (
        <div aria-hidden="true" className="text-3xl">
          {icono}
        </div>
      )}
      <p className="font-display text-lg uppercase tracking-wide">{titulo}</p>
      {texto && <div className="text-sm text-neutral-600 dark:text-neutral-400">{texto}</div>}
    </div>
  );
}
