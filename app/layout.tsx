import type { Metadata } from 'next';
import { Inter, Libre_Baskerville } from 'next/font/google';
import './globals.css';

// 1. Configure the fonts
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const libre = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-libre', // We can reference this in Tailwind
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nook | The Quiet Commitment Platform',
  description: 'Accountability through visibility.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${libre.variable}`}>
      {/* 2. Apply the brand background globally */}
      <body className="bg-[#F7F6F3] text-[#1F2933] antialiased">
        {children}
      </body>
    </html>
  );
}