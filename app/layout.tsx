import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/redux/provider";
import Setup from "./utils/auth/setup";
import AlertSystem from "./utils/alert/alert";

export const metadata: Metadata = {
  title: "Farrera Academy",
  description: "Plataforma corporativa de capacitación de Grupo Farrera",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`font-sans antialiased`}>
        <Provider>
          <Setup />
          <AlertSystem />
          {children}
        </Provider>
      </body>
    </html>
  );
}
