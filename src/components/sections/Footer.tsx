import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Mail, MessageSquare, Sparkles } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-brand-amber/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Smart vehicle care. At your fingertips. Launching soon in Trivandrum, Kerala.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Platform</h4>
              <Link href="/survey" className="text-white/40 hover:text-brand-amber transition-colors text-sm">Survey</Link>
              <Link href="/join" className="text-white/40 hover:text-brand-amber transition-colors text-sm">Join Waitlist</Link>
              <Link href="/survey/partner" className="text-white/40 hover:text-brand-amber transition-colors text-sm">Become a Partner</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Company</h4>
              <Link href="/about" className="text-white/40 hover:text-brand-amber transition-colors text-sm">About</Link>
              <Link href="/contact" className="text-white/40 hover:text-brand-amber transition-colors text-sm">Contact</Link>
              <Link href="/privacy-policy" className="text-white/40 hover:text-brand-amber transition-colors text-sm">Privacy Policy</Link>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Connect</h4>
            <div className="flex gap-4">
              <Link href="https://instagram.com/autobee.care" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-amber hover:text-black transition-all text-white/60">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              <Link href="https://wa.me/9188601017" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-amber hover:text-black transition-all text-white/60">
                <MessageSquare className="w-5 h-5" />
              </Link>
              <Link href="mailto:hello@autobee.care" aria-label="Email" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-amber hover:text-black transition-all text-white/60">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
          <p>© 2026 Autobee. All rights reserved.</p>
          <p className="flex items-center gap-1">Built with care in Kerala <Sparkles className="w-3 h-3 text-brand-amber/50" /></p>
        </div>
      </div>
    </footer>
  );
};
