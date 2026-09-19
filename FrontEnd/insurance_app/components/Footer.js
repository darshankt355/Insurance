"use client"
import React from 'react';

const Footer = () => (
  <footer className="py-6 bg-gray-100 text-center text-gray-600 mt-12">
    <p className="text-sm sm:text-base" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      &copy; {new Date().getFullYear()} InsuranceApp. All rights reserved.
    </p>
  </footer>
);

export default Footer;