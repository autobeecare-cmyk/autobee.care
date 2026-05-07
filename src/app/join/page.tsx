"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowLeft, ChevronRight, CheckCircle2, ShieldCheck, Zap, Clock } from "lucide-react";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";

const waitlistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^(?:\+91)?[6-9]\d{9}$/, "Please enter a valid Indian phone number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  area: z.string().min(1, "Please select your area"),
});

type WaitlistValues = z.infer<typeof waitlistSchema>;

const areas = [
  "Pattom", "Kowdiar", "Kazhakoottam", "Technopark", "Vellayambalam",
  "Thampanoor", "Ambalamukku", "Peroorkada", "Statue", "Other"
];

const benefits = [
  {
    icon: Zap,
    title: "100% Free Premium Wash",
    desc: "First 100 members get a full premium wash on launch week."
  },
  {
    icon: Clock,
    title: "Skip the Waiting Room",
    desc: "Get priority access to book exact time slots before anyone else."
  },
  {
    icon: ShieldCheck,
    title: "Guaranteed Launch Gift",
    desc: "Every waitlist member gets a ₹100 voucher for their first book."
  },
  {
    icon: Sparkles,
    title: "On-Time or Cashback",
    desc: "Get ₹50 back if your service is delayed by more than 10 mins."
  }
];

export default function JoinWaitlistPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WaitlistValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { name: "", phone: "", email: "", area: "" },
  });

  const selectedArea = watch("area");

  const onSubmit = async (data: WaitlistValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Submission failed");

      toast.success("Welcome to the Hive!", {
        description: "You're officially on the list for early access.",
      });
      reset();
      router.push("/survey/thank-you");
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-outfit selection:bg-brand-amber selection:text-black overflow-x-hidden">
      {/* Navbar */}
      <nav className="p-6 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <Logo />
          <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">542 joined in Trivandrum</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 p-6 py-12 lg:py-24 items-center">
        {/* Left Column: Value Prop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-amber/10 border border-brand-amber/20 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-brand-amber" />
              <span className="text-brand-amber text-xs font-bold tracking-widest uppercase">Early Access Open</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
              Care for your vehicle<br />
              <span className="text-brand-amber underline decoration-brand-amber/30 underline-offset-8">without the wait.</span>
            </h1>
            <p className="text-white/50 text-xl md:text-2xl font-light leading-relaxed max-w-xl">
              Tired of long queues and inconsistent quality? Join Autobee to book guaranteed slots at top-rated centers.
            </p>
          </div>

          <div className="space-y-8">
            {benefits.map((b, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-6 h-6 text-brand-amber" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">{b.title}</h3>
                  <p className="text-white/40 text-base leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-neutral-800 flex items-center justify-center text-[10px] font-bold">
                    User
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/40 font-medium">
                <span className="text-white font-bold">500+ vehicle owners</span> have already secured their spot.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: The Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Background Glow - Constrained */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-amber/10 rounded-full blur-[100px] pointer-events-none hidden lg:block" />
          
          <div className="bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Join the Waitlist</h2>
              <p className="text-white/40 mb-10">Takes less than 30 seconds.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white/60 ml-1 text-sm">Full Name</Label>
                    <Input
                      {...register("name")}
                      placeholder="e.g. Rahul Nair"
                      className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-white/20 px-6 focus:bg-white/10 focus:border-brand-amber transition-all"
                    />
                    {errors.name && <p className="text-red-400 text-xs ml-1">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/60 ml-1 text-sm">Phone Number</Label>
                    <Input
                      {...register("phone")}
                      placeholder="+91 98765 43210"
                      className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-white/20 px-6 focus:bg-white/10 focus:border-brand-amber transition-all"
                    />
                    {errors.phone && <p className="text-red-400 text-xs ml-1">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/60 ml-1 text-sm">Your Area in Trivandrum</Label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {areas.map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => setValue("area", area, { shouldValidate: true })}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all",
                            selectedArea === area
                              ? "bg-brand-amber text-black border-brand-amber shadow-lg"
                              : "bg-white/5 text-white/40 border-transparent hover:bg-white/10"
                          )}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                    {errors.area && <p className="text-red-400 text-xs ml-1">{errors.area.message}</p>}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-brand-amber hover:bg-brand-amber/90 text-black font-extrabold text-xl rounded-2xl shadow-[0_0_40px_rgba(245,183,0,0.2)] transition-all active:scale-[0.98] group"
                >
                  {loading ? "Securing spot..." : (
                    <span className="flex items-center gap-2">
                      Secure My Spot <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-white/20 text-xs flex items-center justify-center gap-2 mt-4">
                  <ShieldCheck className="w-3 h-3" /> No spam. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </main>
      
      <footer className="max-w-7xl mx-auto p-12 text-center border-t border-white/5">
        <p className="text-white/20 text-sm">© 2026 Autobee. Transforming car care in Kerala.</p>
      </footer>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={cn("block font-medium", className)}>{children}</label>;
}
