/** Une clases condicionales sin dependencias (estilo shadcn `cn`). */
export function cn(...partes: Array<string | false | null | undefined>): string {
  return partes.filter(Boolean).join(" ");
}
