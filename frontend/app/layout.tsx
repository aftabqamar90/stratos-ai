import type { ReactNode } from "react";

import { AdminShell } from "../components/admin/AdminShell";

import "./globals.css";

export const metadata = {
  title: "Stratos AI Dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
