'use client'
import { useState, useEffect } from 'react';
import Navbar from "./_components/navbar";
import HeroSection from "./_components/Home/HeroSection";
import AboutSection from "./_components/Home/AboutSection";
import Faq from "./_components/Home/Faq";
import Footer from "./_components/Footer";
import PageWrapper from './_components/Layout/PageWrapper'

export default function Home() {
  return (
    <PageWrapper>
      <main>
        <Navbar />
        <HeroSection />
        <AboutSection />
        <Faq />
        <Footer />
      </main>
    </PageWrapper>
  );
}
