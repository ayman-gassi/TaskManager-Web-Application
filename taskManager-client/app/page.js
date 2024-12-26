'use client'
import { useState, useEffect } from 'react';
import Navbar from "./_components/navbar";
import HeroSection from "./_components/Home/HeroSection";
import AboutSection from "./_components/Home/AboutSection";
import Faq from "./_components/Home/Faq";
import Footer from "./_components/Footer";
export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main suppressHydrationWarning>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <Faq />
      <Footer />
    </main>
  );
}
