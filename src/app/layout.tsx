import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Astroflora 7.1 - Elite Scientific Platform',
  description: 'Advanced Astrobiological Research & Drug Discovery Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black min-h-screen`}>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900">
          {children}
        </div>
      </body>
    </html>
  )
}
