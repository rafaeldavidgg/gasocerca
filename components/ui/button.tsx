import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variante = "primary" | "dark" | "ghost";
type Tamano = "sm" | "md";

/** Boton del sistema (estilo shadcn): borde tinta + sombra pegatina. */
export function Button({
  variante = "primary",
  tamano = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante; tamano?: Tamano }) {
  return (
    <button
      {...props}
      className={cn(
        "gc-press inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-tinta font-semibold",
        "disabled:cursor-not-allowed disabled:opacity-50",
        tamano === "sm" ? "px-3 py-1.5 text-sm" : "px-5 py-2.5 text-sm",
        variante === "primary" && "bg-energia-600 text-white shadow-sticker hover:bg-energia-700",
        variante === "dark" &&
          "bg-tinta text-papel shadow-sticker hover:bg-tinta-suave dark:bg-papel dark:text-tinta",
        variante === "ghost" &&
          "border-neutral-300 bg-transparent shadow-none hover:border-tinta dark:border-neutral-700",
        className
      )}
    />
  );
}
