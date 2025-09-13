import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import "./styles/theme.css"
import AuthProvider from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-jetbrains-mono'
})

export const metadata: Metadata = {
  title: "FitSync AI - Personalized Fitness & Nutrition Platform",
  description:
    "Experience the future of fitness with FitSync AI. Get personalized workout plans, nutrition guidance, and AI-powered coaching tailored to your goals. Transform your fitness journey with cutting-edge technology.",
  keywords: "FitSync AI, fitness, workout, nutrition, AI coach, personalized training, health, wellness, smart fitness, AI trainer",
  generator: 'FitSync AI Platform',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#06b6d4',
  openGraph: {
    title: 'FitSync AI - Smart Fitness Platform',
    description: 'Transform your fitness journey with AI-powered personalized training and nutrition guidance.',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FitSync AI" />
        <link rel="apple-touch-icon" href="/pwa/icon-192x192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 min-h-screen text-gray-100 antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="bg-noise relative">
              {children}
            </div>
            <Toaster 
              theme="dark"
              toastOptions={{
                style: {
                  background: 'rgba(17, 25, 40, 0.95)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  color: '#f8fafc',
                  backdropFilter: 'blur(8px)'
                }
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
