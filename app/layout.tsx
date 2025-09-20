import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mascotas del Milagro – Mi Amigo Fiel",
  description: "Plataforma colaborativa para publicar y encontrar mascotas perdidas o encontradas en El Carril.",
  openGraph: {
    title: "Mascotas del Milagro – Mi Amigo Fiel",
    description: "Ayuda a reunir mascotas con sus familias. Publica, busca y comparte avisos.",
    url: "https://mi-amigo-fiel.vercel.app/",
    images: [
      {
        url: "https://mi-amigo-fiel.vercel.app/mi_amigo_fiel.jpeg",
        width: 1200,
        height: 630,
        alt: "Mascotas del Milagro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mascotas del Milagro – Mi Amigo Fiel",
    description: "Plataforma colaborativa para reunir mascotas con sus familias.",
    images: ["https://mi-amigo-fiel.vercel.app/mi_amigo_fiel.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-50 bg-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-600">🐾 Mi Amigo Fiel</h1>
            <nav className="space-x-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Inicio</Link>
              <Link href="/perdidos" className="text-gray-700 hover:text-blue-600">Perdidos</Link>
              <Link href="/adopciones" className="text-gray-700 hover:text-blue-600">Adopciones</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
