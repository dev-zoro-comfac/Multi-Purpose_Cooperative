import type { Metadata } from "next";
import { RouteLayout } from "@/types/layout-type";
import { Public_Sans } from "next/font/google";
import AppProvider from "@/providers";
import "@/styles/globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "App",
  description: "App Boilerplate",
};

export default function RootLayout({ children }: RouteLayout) {
  return (
    <html lang="en">
      <body className={`${publicSans.className}`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
