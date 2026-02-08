import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers/app-providers";

export const metadata: Metadata = {
  title: 'Propwise — Customer Dashboard',
  description: 'Customer Activity Dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
