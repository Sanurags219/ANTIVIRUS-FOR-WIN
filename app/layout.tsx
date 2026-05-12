import type {Metadata} from 'next';
import './globals.css';
import { Geist, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

export const metadata: Metadata = {
  title: 'CyberShield AI Antivirus',
  description: 'AI-powered security dashboard for real-time threat detection.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, jetbrainsMono.variable)}>
      <body suppressHydrationWarning className="bg-black text-white">{children}</body>
    </html>
  );
}
