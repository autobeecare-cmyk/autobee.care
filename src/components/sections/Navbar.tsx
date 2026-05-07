"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/survey" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Take the Survey
          </Link>
          <Link 
            href="#waitlist" 
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-brand-amber hover:bg-brand-amber/90 text-black font-semibold rounded-full px-6"
            )}
          >
            Join Waitlist
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <Link 
            href="/survey" 
            className="text-lg font-medium text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Take the Survey
          </Link>
          <Link 
            href="#waitlist" 
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-brand-amber hover:bg-brand-amber/90 text-black font-semibold rounded-full w-full py-6"
            )}
          >
            Join Waitlist
          </Link>
        </div>
      )}
    </nav>
  );
};
