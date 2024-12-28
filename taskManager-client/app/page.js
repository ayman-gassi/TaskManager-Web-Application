'use client'
import { useState, useEffect } from 'react';
import Navbar from "./_components/Navigation/Navbar";
import HeroSection from "./_components/Home/HeroSection";
import AboutSection from "./_components/Home/AboutSection";
import Faq from "./_components/Home/Faq";
import Footer from "./_components/Footer";
import { AuthProvider } from "./_context/AuthContext";
import Testimonial from './_components/Home/Testimonial';
export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  

  if (!mounted) {
    return null;
  }

  return (
    <AuthProvider>
      <main className='scroll-smooth' suppressHydrationWarning>
        <Navbar />
        <HeroSection />
        <Testimonial/>
        <AboutSection />
        <Faq />
        <Footer />
      </main>
    </AuthProvider>
  );
}
