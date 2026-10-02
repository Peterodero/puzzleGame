import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Colgate — Turn. Match. Smile.",
  description:
    "An interactive drag-and-drop picture puzzle: rebuild the campaign image before the timer runs out to unlock a price-drop reward.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      {/*
        h-full + overflow-hidden on body: the game must fit the kiosk
        viewport (1080 × 1920) with zero scrolling.
      */}
      <body className="h-full overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased selection:bg-red-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
