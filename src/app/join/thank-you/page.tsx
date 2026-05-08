"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { CheckCircle2, Share2, Home } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function WaitlistThankYouPage() {
  const share = () => {
    navigator.clipboard.writeText(window.location.origin + "/join");
    toast.success("Link copied!", {
      description: "Share it with your friends and help us grow!",
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
            You're on the list!<br />
            <span className="text-brand-amber">Welcome to the Hive.</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            We'll reach out as soon as Autobee launches in Trivandrum. The first 100 members get a free premium wash — you're ahead of the queue.
          </p>
        </div>

        <div className="bg-brand-amber/10 border border-brand-amber/20 rounded-2xl p-6 text-left space-y-3">
          <p className="text-brand-amber font-bold text-sm uppercase tracking-widest">What happens next?</p>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>• We'll SMS you when we go live in your area</li>
            <li>• First 100 members get a full free premium wash</li>
            <li>• Every member gets a ₹100 voucher for their first booking</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-brand-amber hover:bg-brand-amber/90 text-black font-bold rounded-xl h-14 text-lg"
            )}
          >
            <Home className="mr-2 w-5 h-5" /> Back to Home
          </Link>
          <button
            onClick={share}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-white/10 hover:bg-white/5 text-white font-semibold rounded-xl h-14 text-lg"
            )}
          >
            <Share2 className="mr-2 w-5 h-5" /> Share with Friends
          </button>
        </div>
      </motion.div>
    </div>
  );
}
