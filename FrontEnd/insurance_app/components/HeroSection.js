"use client"
import React from 'react';

const HeroSection = () => (
  <section className="flex flex-col items-center justify-center py-12 md:py-20 lg:py-24 bg-blue-50 font-sans px-4 sm:px-6 md:px-8">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      Let's find you the <span className="text-blue-600">Best Insurance</span>
    </h1>
    <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-8 text-center max-w-2xl" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      Offering insurance at the lowest prices | Quick, easy & hassle-free
    </p>
    <button className="bg-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      View All Products
    </button>
  </section>
);

export default HeroSection;