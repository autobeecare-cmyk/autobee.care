"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Hourglass, ShieldAlert, AlertTriangle } from "lucide-react";

const problems = [
  {
    icon: <Hourglass className="w-8 h-8 text-red-500" />,
    title: "Endless Waiting",
    description: "Walk in, wait 45+ minutes, and ruin your weekend plans. Your time is worth more."
  },
  {
    icon: <ShieldAlert className="w-8 h-8 text-red-500" />,
    title: "Risk of Damage",
    description: "Untrained staff and dirty equipment often leave scratches and swirl marks on your car's paintwork."
  },
  {
    icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
    title: "Inconsistent Results",
    description: "Different results every time, with zero accountability for your expensive vehicle."
  }
];

export const Problem = () => {
  return (
    <section className="py-20 bg-[#050505]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-outfit font-bold text-4xl md:text-6xl text-white">
            Car care shouldn't be this <span className="text-white/30 italic">difficult.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-8 h-full bg-[#0A0A0A] border-white/5 hover:border-brand-amber/20 transition-all group text-center flex flex-col items-center">
                <div className="mb-6 bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
                  {item.icon}
                </div>
                <h3 className="font-outfit font-bold text-2xl text-white mb-4 flex items-center justify-center gap-2">
                  {item.title}
                </h3>
                <p className="text-white/50 leading-relaxed text-center">
                  {item.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
