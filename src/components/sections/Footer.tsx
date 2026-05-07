import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Camera, Mail, MessageSquare } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-brand-amber/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Smart car care. We come to you. Launching soon in Trivandrum, Kerala.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Platform</h4>
              <Link href="/survey" className="text-white/40 hover:text-brand-amber transition-colors text-sm">Survey</Link>
              <Link href="#waitlist" className="text-white/40 hover:text-brand-amber transition-colors text-sm">Join Waitlist</Link>
              <Link href="/survey/partner" className="text-white/40 hover:text-brand-amber transition-colors text-sm">Become a Partner</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Company</h4>
              <Link href="#" className="text-white/40 hover:text-brand-amber transition-colors text-sm">About</Link>
              <Link href="#" className="text-white/40 hover:text-brand-amber transition-colors text-sm">Contact</Link>
              <Link href="#" className="text-white/40 hover:text-brand-amber transition-colors text-sm">Privacy Policy</Link>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Connect</h4>
            <div className="flex gap-4">
              <Link href="https://instagram.com/autobee.care" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-amber hover:text-black transition-all">
                <Camera className="w-5 h-5" />
              </Link>
              <Link href="https://wa.me/9100000000" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-amber hover:text-black transition-all">
                <MessageSquare className="w-5 h-5" />
              </Link>
              <Link href="mailto:hello@autobee.care" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-amber hover:text-black transition-all">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
          <p>© 2026 AutoBee. All rights reserved.</p>
          <p>Built with care in Kerala 🐝</p>
        </div>
      </div>
    </footer>
  );
};
