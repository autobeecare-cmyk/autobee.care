"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { CheckCircle2, Share2, Home, Store } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export default function PartnerThankYouPage() {
  useEffect(() => {
    // Gold confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#F5B700", "#FFD700", "#fff", "#000"],
    });
  }, []);

  const share = () => {
    navigator.clipboard.writeText("https://autobee.care/survey/partner");
    toast.success("Link copied!", {
      description: "Share it with other wash center owners!",
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-10"
      >
        <Logo className="mx-auto text-3xl" />

        {/* Badge */}
        <div className="flex items-center justify-center gap-2 bg-brand-amber/10 border border-brand-amber/20 rounded-full px-4 py-2 w-fit mx-auto">
          <Store className="w-4 h-4 text-brand-amber" />
          <span className="text-brand-amber text-sm font-bold tracking-wide uppercase">Partner Application</span>
        </div>

        <div className="space-y-4">
          <div className="w-24 h-24 bg-brand-amber/20 rounded-full flex items-center justify-center mx-auto border-2 border-brand-amber/40">
            <CheckCircle2 className="w-12 h-12 text-brand-amber" />
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-extrabold text-white">
            You're in the<br />
            <span className="text-brand-amber flex items-center justify-center gap-2">hive! <Sparkles className="w-8 h-8" /></span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed max-w-sm mx-auto">
            Thanks for your interest in partnering with Autobee. Our team will reach out on WhatsApp to walk you through the next steps. Follow us on Instagram for updates!
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 text-left space-y-3">
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold">What happens next</p>
          {[
            "Our team reviews your application",
            "You'll get a WhatsApp call from us",
            "We walk you through onboarding",
            "You start getting customers",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-brand-amber font-outfit font-bold text-sm mt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-white/70 text-sm">{item}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-brand-amber hover:bg-brand-amber/90 text-black font-bold rounded-xl h-14 text-base"
            )}
          >
            <Home className="mr-2 w-4 h-4" /> Back to Autobee
          </Link>
          <button
            onClick={share}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-white/10 hover:bg-white/5 text-white font-semibold rounded-xl h-14 text-base"
            )}
          >
            <Share2 className="mr-2 w-4 h-4" /> Share with other centers
          </button>
        </div>
      </motion.div>
    </div>
  );
}
