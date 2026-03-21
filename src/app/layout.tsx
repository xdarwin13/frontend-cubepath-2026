import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EduCubeIA - Plataforma Educativa con IA",
  description: "Genera cursos con inteligencia artificial. Profesores crean contenido con IA y estudiantes aprenden de forma innovadora.",
  keywords: ["educacion", "inteligencia artificial", "cursos", "IA", "aprendizaje"],
  manifest: "/icon/manifest.json",
  icons: {
    icon: [
      { url: "/icon/favicon.ico" },
      { url: "/icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/icon/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/icon/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/icon/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/icon/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/icon/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/icon/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icon/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icon/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/icon/favicon.ico"],
  },
  other: {
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": "/icon/ms-icon-144x144.png",
    "msapplication-config": "/icon/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
