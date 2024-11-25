import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/providers/react-query";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Gym bro",
    description: "Start your fitness journey today",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <ReactQueryClientProvider>
            <html lang="en">
                {/* Required for pricing table */}
                <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
                
                <body className={inter.className}>
                    {children}
                    <Toaster />
                </body>
            </html>
        </ReactQueryClientProvider>
    );
}
