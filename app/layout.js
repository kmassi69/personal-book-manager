import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Folio — Personal Book Manager",
  description: "A thoughtful space to log books, reflect on habits, and discover authors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-[#FDFBF7] text-[#1A1D1E] antialiased selection:bg-[#3A5A40]/10 selection:text-[#3A5A40] min-h-screen">
        {children}
      </body>
    </html>
  );
}