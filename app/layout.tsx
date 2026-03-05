import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout/MainLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATISBO — Todo Chile en Bicicleta",
  description: "Una travesía documental para recorrer cada comuna de Chile sobre dos ruedas. Bitácoras, mapas y fotografía de viaje.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-white text-black`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
