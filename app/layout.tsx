import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gulls Command Center | Holt Analytics",
  description: "San Diego Gulls ticketing command center built from cleaned workbook data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
