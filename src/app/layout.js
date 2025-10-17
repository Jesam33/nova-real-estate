// app/layout.jsx
import './globals.css'
import { Geist } from 'next/font/google'
import Header from '@/app/component/Header'
import { CartProvider } from '@/app/context/context' // Adjust path if needed

const geist = Geist({ subsets: ['latin'] })

// app/page.tsx or app/layout.tsx

export const metadata = {
  title: "Novacore Properties - Premium Property in Lagos",
  description: "Discover premium properties in Lagos with Novacore.",
  keywords: ["properties", "Lagos properties", "real estate", "Novacore", "buy property online"],
  openGraph: {
    title: "Novacore Properties - Premium Property around the world",
    description: "Where artistry meets flavor.",
    images: [
      {
        url: "https://res.cloudinary.com/dijs29rd9/image/upload/v1760744172/nova_ozi853.jpg",
        width: 1200,
        height: 630,
        alt: "Novacore Properties Showcase",
      },
    ],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <CartProvider>
          <Header />
          <main className="">
            {children}
          </main>
          <footer className="bg-gray-800 text-white ">
            <div className="container mx-auto px-4 py-6 text-center">
              <p>&copy; 2025 Novacore Properties. All rights reserved.</p>
              <p className="mt-2 text-gray-400">
                Discover premium properties with us </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
