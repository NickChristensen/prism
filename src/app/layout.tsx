import Script from "next/script";
import type { Metadata } from "next";
import { Geist_Mono, Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const outfitHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Prism",
  description:
    "Prism renders rich views for OpenClaw. Open a Prism link with an ID to see a generated page.",
};

const themeScript = `
(() => {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const applyTheme = (isDark) => {
    root.classList.toggle('dark', isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
  };

  applyTheme(media.matches);

  const handleChange = (event) => applyTheme(event.matches);

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', handleChange);
  } else {
    media.addListener(handleChange);
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistMono.variable,
        inter.variable,
        outfitHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col p-4 pb-8">
        <Script id="theme-sync" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
