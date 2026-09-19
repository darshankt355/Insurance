"use client"
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import InsuranceProducts from '../components/InsuranceProducts';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <InsuranceProducts />
      <Footer />
    </>
  );
}
