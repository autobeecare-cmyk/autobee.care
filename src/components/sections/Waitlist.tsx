"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

export const Waitlist = () => {
  return (
    <section id="waitlist" className="py-24 bg-black">
      <div className="w-full bg-[#F5B700] p-12 md:p-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-black/10 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-black" />
              <span className="text-black text-xs font-bold tracking-widest uppercase">Limited Slots</span>
            </div>
            
            <h2 className="font-outfit font-extrabold text-4xl md:text-7xl text-black mb-8 leading-tight">
              Ready to reclaim <br className="hidden md:block" /> your weekends?
            </h2>
            
            <p className="text-black/70 text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto">
              Join 500+ vehicle owners in Trivandrum waiting for the smarter way to wash.
            </p>

            <Link
              href="/join"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-black hover:bg-black/90 text-white font-extrabold rounded-2xl px-12 h-20 text-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 group"
              )}
            >
              Join the Waitlist
              <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="mt-8 text-black/40 text-sm font-bold uppercase tracking-widest">
              Free wash for the first 100 members
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
