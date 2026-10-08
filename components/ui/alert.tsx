import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tono = "info" | "success" | "warning" | "danger";

/** Alerta del sistema (reemplaza divs sueltos). */
export function Alert({
  tono = "info",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tono?: Tono }) {
  return (
    <div
      role={tono === "danger" ? "alert" : "status"}
      {...props}
      className={cn(
        "gc-ticket flex items-start gap-2 rounded-xl px-3 py-2 text-sm",
        tono === "info" && "bg-white dark:bg-neutral-950",
        tono === "success" &&
          "bg-energia-100 text-energia-900 dark:bg-energia-900 dark:text-energia-100",
        tono === "warning" &&
          "bg-orange-100 text-orange-950 dark:bg-orange-950 dark:text-orange-100",
        tono === "danger" && "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100",
        className
      )}
    />
  );
}
