import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BASE_URL = "https://gasocercamia.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "GasoCerca - Gasolineras más baratas cerca de ti | Precios oficiales",
  description:
    "Encuentra la gasolina y el diésel más baratos cerca de ti con precios oficiales del Ministerio (MITERD), actualizados a diario. Sin registro, gratis y con mapa.",
  keywords: ["gasolineras baratas", "precio gasolina", "precio diésel", "MITERD", "gasóleo barato", "GLP"],
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "GasoCerca",
    title: "GasoCerca - Gasolineras más baratas cerca de ti | Precios oficiales",
    description:
      "Precios oficiales de carburantes (MITERD) y mapa para encontrar la gasolinera más barata cerca de ti.",
    images: [{ url: "/logo.svg", width: 512, height: 512, alt: "Logo de GasoCerca" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GasoCerca - Gasolineras más baratas cerca de ti",
    description: "Precios oficiales MITERD, mapa y la más barata cerca de ti. Gratis, sin registro.",
    images: ["/logo.svg"],
  },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16a34a" },
    { media: "(prefers-color-scheme: dark)", color: "#052e16" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[1000] focus:rounded focus:bg-energia-600 focus:px-3 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
