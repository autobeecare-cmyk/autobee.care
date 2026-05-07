"use client";

import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Gift, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-amber/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-brand-amber/10 border border-brand-amber/20 rounded-full px-4 py-2 mb-6">
            <Gift className="w-4 h-4 text-brand-amber" />
            <span className="text-brand-amber text-xs md:text-sm font-bold tracking-widest uppercase">Win 3 FREE Premium Washes</span>
          </div>
          <h1 className="font-outfit font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight">
            Smart Vehicle Care.<br />
            <span className="text-brand-amber">At Your Fingertips.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-white/60 text-lg md:text-2xl max-w-2xl font-light leading-relaxed"
        >
          Book exact time slots. Know the price upfront. Get guaranteed on-time service—or get cashback.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link 
            href="/survey" 
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-brand-amber hover:bg-brand-amber/90 text-black font-bold rounded-full px-8 h-14 text-lg group"
            )}
          >
            Claim Your Free Wash
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/join" 
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-white/20 hover:bg-white/5 text-white font-semibold rounded-xl px-8 h-14 text-lg"
            )}
          >
            Join Waitlist
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 text-sm text-white/40 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-brand-amber" /> Take our 2-min survey to enter the giveaway
        </motion.p>

        {/* Animated wheel or icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute right-[-10%] top-[20%] opacity-[0.03] pointer-events-none hidden lg:block"
        >
          <svg width="600" height="600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" stroke="#F5B700" strokeWidth="0.5" strokeDasharray="4 4" />
            <path d="M50 2L50 98" stroke="#F5B700" strokeWidth="0.5" />
            <path d="M2 50L98 50" stroke="#F5B700" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="10" stroke="#F5B700" strokeWidth="1" />
          </svg>
        </motion.div>
      </div>

    </section>
  );
};
