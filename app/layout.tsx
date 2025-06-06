import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ORIGIN_URL } from "@/utils/helpers";
const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Sommaire - AI- Pwered PDF Summarization",
  description:
    "Save hours of reading time.Treanform lengthy PDF into clear , accurate summaries in sencond with our advan AI technology",
  openGraph: {
    images: [
      {
        url: "/opengraph-image.jpg",
      },
    ],
  },
  metadataBase: new URL(ORIGIN_URL),
  alternates: {
    canonical: ORIGIN_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${fontSans.variable} antialiased `}>
          <div className="relative flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              classNames: {
                toast:
                  "bg-zinc-950 text-white border border-zinc-800 shadow-xl",
                title: "text-lg font-bold",
                description: "text-sm text-zinc-400",
                actionButton: "bg-green-500 text-white",
                cancelButton: "bg-red-500 text-white",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
