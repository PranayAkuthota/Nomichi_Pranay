import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nomichi · Travel that finds you",
  description:
    "Slow, offbeat, small-group journeys designed for people who want a trip to feel personal.",
  openGraph: {
    title: "Nomichi · Travel that finds you",
    description: "Slow, offbeat, small-group journeys designed for people who want a trip to feel personal.",
    siteName: "Nomichi",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased bg-cream text-ink" suppressHydrationWarning>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1C1B1A",
              color: "#FFFBF5",
              border: "1px solid #45471D",
              fontFamily: "Poppins, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
