import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/src/providers/QueryProvider";
import SideBar from "@/src/components/Sidebar/SideBar";
import Navbar from "@/src/components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import MobileNavbar from "../components/Navbar/MobileNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zynk",
  description: "Connect with your friends on Zynk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <div className="flex dark:bg-gray-900">
            <div>
              <SideBar />
            </div>
            <div className="flex-1 dark:bg-gray-950">
              <Navbar />
              <MobileNavbar/>
              <div>
                <Toaster position="top-right" reverseOrder={false} />
                <main>{children}</main>
              </div>
            </div>
            
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
