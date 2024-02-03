import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "trxmini.games - a staking/wagering arcade GameFi platform",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWrapper>
          <main className="min-h-screen max-h-screen w-11/12 mx-auto lg:max-w-screen-xl">
            <Navbar />
            {children}
          </main>
        </LayoutWrapper>
      </body>
    </html>
  );
}
