import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'São Raimundo - Doações',
  description: 'Sistema de doações da Igreja São Raimundo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#f6d8cb]">
          {children}
        </div>
      </body>
    </html>
  )
}
