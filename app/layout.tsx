import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/redux/provider";
import Setup from "./utils/auth/setup";
import AlertSystem from "./utils/alert/alert";

export const metadata: Metadata = {
  title: "CINFA",
  description: "Centro Internacional de Formación Académica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
