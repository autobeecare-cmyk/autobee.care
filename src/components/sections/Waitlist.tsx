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

export const Waitlist = () => {
  const [loading, setLoading] = useState(false);

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

      toast.success("You're on the list! 🐝", {
        description: "We'll text you when we launch. Welcome to the hive!",
      });
      reset();
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="py-24 bg-black">
        <div className="w-full bg-[#F5B700] p-8 md:p-16 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto">

          <div className="relative z-10 text-center mb-10">
            <h2 className="font-outfit font-extrabold text-4xl md:text-6xl text-black mb-4">
              Be the first to experience AutoBee.
            </h2>
            <p className="text-black/70 text-lg md:text-xl font-medium">
              Join the waitlist for early access and a free wash on launch week.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <Input
                  {...register("name")}
                  placeholder="Your Name"
                  className="bg-white/90 border-none h-14 rounded-xl text-black placeholder:text-black/50 text-base px-5 focus:bg-white transition-all"
                />
                {errors.name && (
                  <p className="mt-1 text-sm font-semibold text-red-800">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Input
                  {...register("phone")}
                  placeholder="Phone (+91 98765 43210)"
                  type="tel"
                  inputMode="numeric"
                  className="bg-white/90 border-none h-14 rounded-xl text-black placeholder:text-black/50 text-base px-5 focus:bg-white transition-all"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm font-semibold text-red-800">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <Input
              {...register("email")}
              placeholder="Email (Optional)"
              type="email"
              inputMode="email"
              className="bg-white/90 border-none h-14 rounded-xl text-black placeholder:text-black/50 text-base px-5 focus:bg-white transition-all"
            />

            {/* Area selector — button pills */}
            <div>
              <p className="text-sm font-semibold text-black/60 mb-2 ml-1">Your Area</p>
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setValue("area", area, { shouldValidate: true })}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all",
                      selectedArea === area
                        ? "bg-black text-white border-black shadow-md scale-105"
                        : "bg-white/60 text-black border-white/80 hover:bg-white"
                    )}
                  >
                    {area}
                  </button>
                ))}
              </div>
              {errors.area && (
                <p className="mt-2 text-sm font-semibold text-red-800">{errors.area.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-black hover:bg-black/80 text-white font-extrabold text-xl rounded-xl shadow-2xl transition-all active:scale-[0.98]"
              >
                {loading ? "Joining..." : "Join the Hive 🐝"}
              </Button>
            </div>
          </form>
          </div>
        </div>

    </section>
  );
};
