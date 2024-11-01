import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Token Balance Checker",
  description: "Check ERC20 token balances for any Ethereum wallet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
