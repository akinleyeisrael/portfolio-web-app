import { Metadata } from "next"
import Footer from "../../components/Footer"
import { Inter } from "next/font/google"

export const metadata: Metadata = {
  title: "Akinola Akinleye",
  description: "web app portfolio with admin dashbpard",
  metadataBase: new URL('https://akinolaakinleye.com')
}

const inter = Inter({ subsets: ['greek'] })
export default function HomeLayout({ children, }: { children: React.ReactNode }) {
  return (
    <main className={inter.className}>
      {children}
      <Footer />
    </main>
  )
}