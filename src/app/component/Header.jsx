"use client"
import Link from 'next/link'
import React, { useState } from "react";
import { useCart } from '../context/context'
import { Menu, Phone, X } from 'lucide-react'
import Image from 'next/image';
import navLogo from "../assets/images/nova.png"

const Header = () => {
  const { getCartCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#about", label: "About Us" },
    { href: "#sell", label: "Sell Your House" },
    { href: "#testimonials", label: "Testimonials" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-purple-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-slate-800 hover:text-purple-600 transition-colors"
            onClick={closeMobileMenu}
          >
            <Image
              src={navLogo}
              alt="NovaCore Logo"
              width={50}
              height={50}
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
              priority
            />
            <span className="text-xl font-bold hidden sm:block">NovaCore</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-800 hover:text-purple-600 transition-colors font-medium py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-600 after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Contact & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Phone Link - Desktop */}
            <a
              href="tel:2166814859"
              className="hidden md:flex items-center gap-2 text-slate-800 font-semibold hover:text-purple-600 transition-colors bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100"
            >
              <Phone className="w-4 h-4" />
              (216) 667-7884
            </a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-800 hover:text-purple-600 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="bg-white border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-800 hover:text-purple-600 hover:bg-purple-50 transition-colors font-medium py-3 px-4 rounded-lg"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </a>
              ))}
              
              {/* Phone Link - Mobile */}
              <a
                href="tel:2166814859"
                className="flex items-center gap-2 text-slate-800 font-semibold py-3 px-4 bg-purple-50 rounded-lg hover:bg-purple-100 hover:text-purple-600 transition-colors"
                onClick={closeMobileMenu}
              >
                <Phone className="w-4 h-4" />
               (216) 667-7884
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header