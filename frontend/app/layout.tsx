import type { ReactNode } from "react";

export const metadata = {
  title: "Stratos AI Dashboard"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial, sans-serif", margin: 24 }}>{children}</body>
    </html>
  );
}
