"use client";

import * as React from "react";
import NextLink from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Truyện", href: "/#stories", active: true },
    { label: "Sách Nói", href: "/#audiobooks" },
    { label: "Hoạt Động", href: "/activities" },
    { label: "Khóa Học", href: "/courses" },
    { label: "Liên Hệ", href: "/#contact" },
  ];

  return (
    <header
      className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md" : ""
      }`}
    >
      <div className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <NextLink href="/" className="flex items-center gap-2.5 outline-none group">
          {/* Logo Icon - Open Book */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
              {/* Book pages */}
              <path
                d="M8 10C8 10 12 8 20 8C28 8 32 10 32 10V32C32 32 28 30 20 30C12 30 8 32 8 32V10Z"
                fill="#E55B5B"
                opacity="0.9"
              />
              <path
                d="M8 10C8 10 12 8 20 8V30C12 30 8 32 8 32V10Z"
                fill="#D14949"
              />
              <path
                d="M32 10C32 10 28 8 20 8V30C28 30 32 32 32 32V10Z"
                fill="#FF7A7A"
              />
              {/* Center spine */}
              <path
                d="M20 8V30"
                stroke="white"
                strokeWidth="1.5"
                opacity="0.5"
              />
              {/* Star decoration */}
              <circle cx="14" cy="18" r="2" fill="white" opacity="0.7" />
              <circle cx="26" cy="18" r="1.5" fill="white" opacity="0.5" />
            </svg>
          </div>
          {/* Logo Text */}
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-serif text-black tracking-tight">
              Bé<span className="text-[#E55B5B]">Đọc</span>
            </span>
          </div>
        </NextLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NextLink
              key={link.label}
              href={link.href}
              className={`text-sm transition-colors ${
                link.active
                  ? "text-black font-medium"
                  : "text-[#6F6F6F] hover:text-black"
              }`}
            >
              {link.label}
            </NextLink>
          ))}
        </nav>

        {/* CTA Button */}
        <NextLink
          href="/#stories"
          className="hidden md:flex bg-black text-white rounded-full px-6 py-2.5 text-sm font-medium hover:scale-[1.03] transition-transform"
        >
          Bắt Đầu
        </NextLink>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center p-2 text-black cursor-pointer"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-x-0 top-[72px] bottom-0 bg-white z-40 flex flex-col p-6 animate-in fade-in duration-300 md:hidden">
          <nav className="flex flex-col gap-2 py-6">
            {navLinks.map((link) => (
              <NextLink
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`py-3 px-4 rounded-xl text-base font-medium transition-colors ${
                  link.active
                    ? "bg-black text-white"
                    : "text-[#6F6F6F] hover:bg-gray-100"
                }`}
              >
                {link.label}
              </NextLink>
            ))}
          </nav>
          <div className="mt-auto pb-8">
            <NextLink
              href="/#stories"
              onClick={() => setIsOpen(false)}
              className="block bg-black text-white rounded-full py-3 text-sm font-medium text-center"
            >
              Bắt Đầu Đọc Truyện
            </NextLink>
          </div>
        </div>
      )}
    </header>
  );
}
