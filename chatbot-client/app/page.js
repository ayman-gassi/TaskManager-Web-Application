'use client'
import Navbar from "./_components/navbar";
import HeroSection from "./_components/Home/HeroSection";
import AboutSection from "./_components/Home/AboutSection";
import Faq from "./_components/Home/Faq";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <Faq />
      <Footer />
    </>
  );
}
