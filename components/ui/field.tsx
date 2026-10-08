import type { LabelHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Grupo campo + etiqueta del sistema (reemplaza label + select sueltos). */
export function Field({
  label,
  children,
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-1.5 text-sm font-medium", className)}>
      <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{label}</span>
      {children}
    </label>
  );
}

export function FieldLabel(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} />;
}

/** Select del sistema con borde tinta. */
export function FieldSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-xl border-2 border-tinta bg-white px-3 py-2 text-sm shadow-sticker",
        "dark:border-neutral-600 dark:bg-neutral-900",
        "disabled:opacity-50",
        className
      )}
    />
  );
}
