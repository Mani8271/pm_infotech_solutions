import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "PM INFOTECH SOLUTIONS | Enterprise Digital Products",
  description: "We design and engineer powerful digital products, intelligent software solutions and scalable experiences for ambitious businesses worldwide.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
