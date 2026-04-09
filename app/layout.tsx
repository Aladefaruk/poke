import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Pokémon Explorer",
    template: "%s · Pokédex",
  },
  description: "Browse, search, and discover Pokémon powered by PokéAPI.",
  openGraph: {
    siteName: "Pokémon Explorer",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
              <a href="/" className="flex items-center gap-2.5 group">
                <Image src="/logo.png" alt="Pokémon Explorer" width={298} height={48} className="w-full h-10" />
              </a>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </main>
          <footer className="mt-20 border-t border-zinc-800 py-8 text-center text-xs text-zinc-600">
            Data from {" "}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
               PokéAPI
            </a>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
