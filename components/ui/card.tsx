import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Tarjeta ticket del sistema. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("gc-ticket rounded-ticket bg-white dark:bg-neutral-950", className)}
    />
  );
}

/** Separador discontinuo tipo ticket. */
export function CardDivider({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("gc-ticket-dash mx-0", className)} />;
}
