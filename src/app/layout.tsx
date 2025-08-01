import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mental Health Support Companion",
  description: "Your confidential space for emotional support and guidance",
  keywords: "mental health, counseling, psychology, therapy, emotional support, wellbeing",
  authors: [{ name: "Mental Health Support Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense Integration */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5047747164751937"
          crossOrigin="anonymous"
        ></script>
        <style>{`
          /* Seamless page transition animations */
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          /* Apply animations to page content */
          .page-transition {
            animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .page-transition-slide {
            animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .page-transition-scale {
            animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          /* Smooth transitions for all elements */
          * {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          /* Prevent scrolling on homepage */
          body.homepage {
            overflow: hidden;
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased page-transition`}
      >
        {children}
      </body>
    </html>
  );
}
