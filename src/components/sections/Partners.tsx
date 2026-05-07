"use client";

import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Users, TrendingUp, Smartphone, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const benefits = [
  { icon: Users, text: "Pre-paid, verified customers sent to you daily" },
  { icon: Smartphone, text: "Manage all bookings from one dashboard" },
  { icon: TrendingUp, text: "Predictable weekly revenue you can count on" },
  { icon: Clock, text: "Fill your slow hours with scheduled bookings" },
];

export const Partners = () => {
  return (
    <section className="py-20 bg-[#050505] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-stretch rounded-[2rem] overflow-hidden border border-white/5">
          {/* Left — pitch */}
          <div className="flex-1 p-10 md:p-16 bg-[#0A0A0A] flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-brand-amber/10 border border-brand-amber/20 rounded-full px-3 py-1 mb-6 w-fit">
              <span className="text-brand-amber text-xs font-bold tracking-widest uppercase">For Centers</span>
            </div>
            <h2 className="font-outfit font-bold text-4xl md:text-5xl text-white mb-4">
              Grow your wash center revenue.
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-sm leading-relaxed">
              Zero marketing spend. Join the Autobee partner network and get a steady stream of pre-paid customers sent directly to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/survey/partner"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "bg-brand-amber hover:bg-brand-amber/90 text-black font-bold rounded-full w-fit px-8 h-14 text-lg"
                )}
              >
                Become a Partner
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/survey/partner"
                className="text-white/40 hover:text-white text-sm flex items-center gap-1 transition-colors self-center ml-2"
              >
                Takes 4 minutes →
              </Link>
            </div>
          </div>

          {/* Right — benefits */}
          <div className="flex-1 p-10 md:p-16 bg-gradient-to-br from-[#F5B700] via-[#F5B700] to-[#e5a800] flex flex-col justify-center">
            <h3 className="font-outfit font-bold text-2xl md:text-3xl text-black mb-8">
              Why wash centers choose Autobee
            </h3>
            <ul className="space-y-5">
              {benefits.map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black/15 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  <p className="text-black font-semibold text-base leading-snug pt-2">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
