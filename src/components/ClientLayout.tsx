"use client";

import { Inter } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> {/* Default lang, context will handle actual display lang */}
      <body className={`${inter.className} bg-midnight-ocean-1 text-white`}>
        <LanguageProvider>
          <LanguageToggle /> {/* Add LanguageToggle here for global availability */}
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
