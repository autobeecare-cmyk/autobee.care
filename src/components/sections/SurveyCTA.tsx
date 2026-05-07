"use client";

import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const SurveyCTA = () => {
  return (
    <section className="py-20 bg-[#050505]">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-brand-amber/10 border border-brand-amber/20 rounded-[2.5rem] p-8 md:p-16"
        >
          <h2 className="font-outfit font-extrabold text-4xl md:text-6xl text-white mb-6">
            Help us build AutoBee.<br />
            <span className="text-brand-amber">Win 3 FREE washes.</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            We're launching soon in Trivandrum. Complete a quick 2-minute survey to shape our features, and selected participants will win 3 free premium car washes.
          </p>
          <Link
            href="/survey"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-brand-amber hover:bg-brand-amber/90 text-black font-extrabold rounded-full px-10 h-16 text-xl shadow-[0_0_40px_rgba(245,183,0,0.3)] hover:shadow-[0_0_60px_rgba(245,183,0,0.4)] transition-all group"
            )}
          >
            Take the Survey & Win 🎁
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
