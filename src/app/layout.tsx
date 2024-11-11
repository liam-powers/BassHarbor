import type { Metadata } from "next";
import "./globals.css";
import NavBar from './components/navigation/NavBar'
import Footer from "./components/navigation/Footer";

export const metadata: Metadata = {
    title: "Bass Harbor",
    description: "for all your low end needs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen min-w-screen text-[#FFFFFF] bg-easy-black font-body">
                <NavBar />
                {children}
                <Footer />
            </body>
        </html>
    );
}