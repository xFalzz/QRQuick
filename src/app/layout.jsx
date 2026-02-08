import { Darker_Grotesque } from "next/font/google";
import "./globals.css";

const darkerGrotesque = Darker_Grotesque({ subsets: ["latin"] });

export const metadata = {
    metadataBase: new URL("https://qrquick.com"),
    title: {
        default: "QRQuick | Create Free QR Codes & Short Links",
        template: "%s | QRQuick"
    },
    description: "Create custom QR Codes for URLs, WiFi, PDF, and more. Free, secure, and easy to use. Includes URL shortening and click tracking.",
    keywords: ["QR Code Generator", "Free QR Code", "URL Shortener", "QR Tracking", "WiFi QR Code", "Custom QR"],
    authors: [{ name: "QRQuick Team" }],
    icons: {
        icon: ["/favicon/QRQuick grey 512.png"],
        apple: ["/favicon/QRQuick grey 512.png"],
        shortcut: ["/favicon/QRQuick grey 512.png"],
    },
    openGraph: {
        title: "QRQuick | Create Your Free QR Codes",
        description: "Easily create QR Codes with any types, share them anywhere. Track your links with our built-in URL shortener.",
        url: "https://qrquick.com",
        siteName: "QRQuick",
        images: [
            {
                url: "/OpenGraphIMG.jpg",
                width: 1260,
                height: 800,
                alt: "QRQuick Preview",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "QRQuick | Free QR Code Generator",
        description: "Create, Customize, and Track QR Codes for free.",
        images: ["/OpenGraphIMG.jpg"],
    },
    robots: {
        index: true,
        follow: true,
    },
};

import JsonLd from "@/components/JsonLd";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={darkerGrotesque.className}>
                <JsonLd />
                {children}
            </body>
        </html>
    );
}
