"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button, buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { CheckCircle2, Share2, Home } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ThankYouPage() {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const share = () => {
    navigator.clipboard.writeText("https://autobee.care/survey");
    toast.success("Link copied!", {
      description: "Share it with your friends and help us grow! 🐝",
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-12"
      >
        <Logo className="mx-auto text-3xl" />
        
        <div className="space-y-6">
          <div className="w-24 h-24 bg-brand-amber/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-amber/30">
            <CheckCircle2 className="w-12 h-12 text-brand-amber" />
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-extrabold text-white">
            You're awesome.<br />
            <span className="text-brand-amber">Thank you!</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Your feedback is invaluable. We'll announce the wash voucher winners on the 15th via WhatsApp.
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-8">
          <Link 
            href="/" 
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-brand-amber hover:bg-brand-amber/90 text-black font-bold rounded-xl h-14 text-lg"
            )}
          >
            <Home className="mr-2 w-5 h-5" /> Visit AutoBee Home
          </Link>
          <Button variant="outline" size="lg" onClick={share} className="border-white/10 hover:bg-white/5 text-white font-semibold rounded-xl h-14 text-lg">
            <Share2 className="mr-2 w-5 h-5" /> Share with Friends
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
