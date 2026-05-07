"use client";

import { motion } from "framer-motion";

import { CalendarCheck, IndianRupee, TimerReset, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: CalendarCheck,
    title: "Book Exact Time Slots",
    description: "Like Uber for your vehicle care. Book a slot and skip the line completely."
  },
  {
    icon: IndianRupee,
    title: "Transparent, Fixed Pricing",
    description: "Know exactly what you'll pay before leaving your house. No surprises, ever."
  },
  {
    icon: TimerReset,
    title: "On-Time Guarantee",
    description: "We respect your time. If your wash is delayed by 10+ minutes, you get ₹50 cashback instantly."
  },
  {
    icon: Smartphone,
    title: "Unified Vehicle Care",
    description: "From washes to insurance reminders and service history—manage it all in one app."
  }
];

export const Solution = () => {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-amber/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24 text-center"
        >
          <h2 className="font-outfit font-bold text-4xl md:text-7xl text-white tracking-tight">
            Autobee makes it <br />
            <span className="text-brand-amber">effortless.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group p-8 h-full bg-[#080808]/50 border-white/5 hover:border-brand-amber/30 hover:bg-brand-amber/[0.02] transition-all duration-500 rounded-3xl relative overflow-hidden">
                {/* Accent glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-amber/0 via-brand-amber/0 to-brand-amber/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-brand-amber/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-amber/20 group-hover:shadow-[0_0_30px_rgba(245,183,0,0.2)] transition-all duration-500">
                      <feature.icon className="w-8 h-8 text-brand-amber" />
                    </div>
                  </div>
                  
                  <h3 className="font-outfit font-bold text-2xl text-white mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/40 text-lg leading-relaxed max-w-sm">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
