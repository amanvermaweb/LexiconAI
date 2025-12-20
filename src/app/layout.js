import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: "400",
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata = {
  title: "LexiconAI",
  description: "LexiconAI - Your AI-Chatbot Companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
