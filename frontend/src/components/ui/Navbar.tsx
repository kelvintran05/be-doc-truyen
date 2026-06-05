"use client";

import * as React from "react";
import NextLink from "next/link";
import { Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const navLinks = [
    { label: "Truyện Cho Bé", sub: "おはなし", href: "/#stories" },
    { label: "Sách Nói", sub: "よみきかせ", href: "/#audiobooks" },
    { label: "Khu Vui Chơi", sub: "あそび", href: "/activities" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-[72px] bg-[#FCFAF5] border-b-4 border-double border-[#4A3F35]/15 flex items-center justify-between px-space-4 md:px-space-5 select-none transition-all duration-300 shadow-[0_1px_4px_rgba(74,63,53,0.02)]">
      {/* Brand Logo - Traditional Red Hanko Stamp & Subtitle */}
      <NextLink href="/" className="flex items-center gap-2.5 group outline-none rounded-md focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2">
        <div className="w-9 h-9 bg-[#E55B5B] rounded-lg flex items-center justify-center border-2 border-white shadow-[0_2px_8px_rgba(229,91,91,0.2)] select-none group-hover:rotate-3 transition-transform duration-300">
          <span className="font-fredoka text-[11px] font-black text-white leading-none tracking-tighter text-center">
            BÉ<br/>ĐỌC
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-fredoka text-base font-bold text-surface-base flex items-center gap-1 leading-none">
            BéĐọc <span className="text-[10px] text-[#E55B5B] font-bold">ベードック</span>
          </span>
          <span className="text-[7px] font-black text-[#8FA781] tracking-widest uppercase font-mono mt-0.5 leading-none">
            おはなしえほん
          </span>
        </div>
      </NextLink>

      {/* Desktop Navigation with Sepia Divider Lines */}
      <nav className="hidden md:flex items-center">
        {navLinks.map((link, idx) => (
          <React.Fragment key={link.label}>
            {idx > 0 && <div className="h-4 w-px bg-[#4A3F35]/15 mx-5" />}
            <NextLink
              href={link.href}
              className="group flex flex-col items-center select-none outline-none"
            >
              <span className="text-[13px] font-black text-slate-700 group-hover:text-[#E55B5B] transition-colors leading-none">
                {link.label}
              </span>
              <span className="text-[8px] font-bold text-slate-400 group-hover:text-[#FFB7C5] transition-colors mt-0.5 tracking-wider font-mono leading-none">
                {link.sub}
              </span>
            </NextLink>
          </React.Fragment>
        ))}
      </nav>

      {/* Subtle Muji-Style Header Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <NextLink href="/courses">
          <button className="px-4 py-1.5 bg-[#EBF3E8] border border-dashed border-[#8FA781]/50 hover:bg-[#8FA781]/20 text-[#5C7050] rounded-full font-black text-xs transition-all cursor-pointer flex items-center gap-1 shadow-[0_2px_8px_rgba(92,112,80,0.06)] animate-pulse">
            <Sparkles className="h-3.5 w-3.5 fill-current text-[#8FA781]" /> KHÓA HỌC TIẾNG ANH 🇬🇧
          </button>
        </NextLink>
        <NextLink href="#login">
          <button className="px-4 py-1.5 bg-transparent border border-[#4A3F35]/35 hover:bg-[#FAF8F5] text-slate-700 rounded-full font-bold text-xs transition-all cursor-pointer">
            Đăng nhập
          </button>
        </NextLink>
        <NextLink href="#stories">
          <button className="px-5 py-1.5 bg-[#FFF5F6] border border-dashed border-[#E55B5B]/50 hover:bg-[#FFB7C5]/30 text-[#E55B5B] rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-[0_2px_8px_rgba(229,91,91,0.06)]">
            Dùng Thử Miễn Phí <Sparkles className="h-3.5 w-3.5 fill-current text-[#E55B5B]/30" />
          </button>
        </NextLink>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex items-center justify-center p-2 rounded-xl border border-[#4A3F35]/15 bg-white text-surface-base shadow-[0_2px_8px_rgba(74,63,53,0.05)] hover:bg-[#FAF8F5] focus:outline-none cursor-pointer"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-x-0 top-[71px] bottom-0 bg-surface-strong border-t border-[#4A3F35]/12 z-40 flex flex-col p-space-4 animate-in fade-in duration-300 md:hidden">
          <nav className="flex flex-col gap-space-3 py-6">
            {navLinks.map((link) => (
              <NextLink
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between font-fredoka text-base font-bold text-surface-base border border-[#4A3F35]/12 p-4 rounded-2xl bg-white shadow-[0_4px_12px_rgba(74,63,53,0.02)] active:translate-y-[1px]"
              >
                <span>{link.label}</span>
                <span className="text-xs font-medium text-slate-400 font-mono">{link.sub}</span>
              </NextLink>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-space-3 pb-8">
            <NextLink href="/courses">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-[#EBF3E8] border border-dashed border-[#8FA781]/50 text-[#5C7050] font-black rounded-full text-sm cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(92,112,80,0.06)] animate-pulse"
              >
                <Sparkles className="h-4 w-4 fill-current text-[#8FA781]" /> KHÓA HỌC TIẾNG ANH 🇬🇧
              </button>
            </NextLink>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-3 zen-btn-white text-sm cursor-pointer"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-3 zen-btn-sakura text-sm cursor-pointer"
            >
              Dùng Thử Miễn Phí
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
