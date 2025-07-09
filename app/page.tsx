import { Footer } from "@/components/landing/footer"
import Header from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
      </main>
      <Footer />
    </div>
  )
}