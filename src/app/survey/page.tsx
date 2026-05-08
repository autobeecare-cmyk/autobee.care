"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ownerSurveySchema, type OwnerSurveyValues } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { RadioCard } from "@/components/survey/RadioCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, Smartphone, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = 3;

const STEP_TITLES = [
  "The Basics",
  "Your Wash Habits",
  "Autobee Feedback",
];

const AREAS = ["Pattom", "Kowdiar", "Kazhakoottam", "Technopark", "Vellayambalam", "Thampanoor", "Other"];

function AreaPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {AREAS.map((area) => (
        <button
          key={area}
          type="button"
          onClick={() => onChange(area.toLowerCase())}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all",
            value === area.toLowerCase()
              ? "bg-brand-amber text-black border-brand-amber shadow-md scale-105"
              : "bg-[#111] text-white border-[#222] hover:border-brand-amber/50"
          )}
        >
          {area}
        </button>
      ))}
    </div>
  );
}

export default function SurveyPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OwnerSurveyValues>({
    resolver: zodResolver(ownerSurveySchema),
    mode: "onTouched",
  });

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = form;

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("autobee_survey_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      } catch {}
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    const sub = watch((value) => {
      localStorage.setItem("autobee_survey_draft", JSON.stringify(value));
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const getFieldsForStep = (s: number): (keyof OwnerSurveyValues)[] => {
    switch (s) {
      case 1: return ["name", "phone", "area", "vehicle_type"];
      case 2: return ["wash_frequency", "current_spend", "biggest_pain_point"];
      case 3: return ["would_book_via_app", "pay_for_subscription"];
      default: return [];
    }
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(step);
    const valid = await trigger(fields);
    if (valid) {
      setStep((s) => Math.min(s + 1, STEPS));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: OwnerSurveyValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/survey/owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      localStorage.removeItem("autobee_survey_draft");
      router.push("/survey/thank-you");
    } catch {
      toast.error("Failed to submit survey", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const radio = (name: keyof OwnerSurveyValues, option: string) => (
    <RadioCard
      key={option}
      label={option}
      selected={watch(name) === option}
      onClick={() => setValue(name as any, option, { shouldValidate: true })}
    />
  );

  const fieldError = (name: keyof OwnerSurveyValues) =>
    errors[name] ? (
      <p className="text-red-500 text-sm mt-1">{errors[name]?.message as string}</p>
    ) : null;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <Logo />
          <div className="text-sm font-medium text-white/40 font-outfit">
            Step {step} of {STEPS}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-white/5 w-full">
          <motion.div
            className="h-full bg-brand-amber"
            initial={{ width: 0 }}
            animate={{ width: `${(step / STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </header>

      <main className="flex-1 flex justify-center py-10 px-6">
        <div className="w-full max-w-xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* Step title */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-brand-amber font-outfit font-bold text-lg">
                      {String(step).padStart(2, "0")}
                    </span>
                    <span className="text-white/20 text-sm">/ {STEPS}</span>
                  </div>
                  <h2 className="font-outfit font-bold text-3xl md:text-4xl text-white">
                    {STEP_TITLES[step - 1]}
                  </h2>
                </div>

                {/* ── STEP 1 ── */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white/70 mb-2 block font-medium">What's your name?</Label>
                      <Input {...register("name")} placeholder="Full name" className="bg-[#0A0A0A] border-white/10 h-14 text-white rounded-xl focus:border-brand-amber/50 transition-all" />
                      {fieldError("name")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block font-medium">Phone Number (to win 3 free washes)</Label>
                      <Input {...register("phone")} placeholder="+91 98765 43210" type="tel" inputMode="numeric" className="bg-[#0A0A0A] border-white/10 h-14 text-white rounded-xl" />
                      {fieldError("phone")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block font-medium">Email (Optional)</Label>
                      <Input {...register("email")} placeholder="your@email.com" type="email" className="bg-[#0A0A0A] border-white/10 h-14 text-white rounded-xl" />
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block font-medium">Your Area in Trivandrum</Label>
                      <AreaPicker value={watch("area") || ""} onChange={(v) => setValue("area", v, { shouldValidate: true })} />
                      {fieldError("area")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block font-medium">What do you drive?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Car only", "Bike only", "Both", "Multiple cars"].map((t) => radio("vehicle_type", t))}
                      </div>
                      {fieldError("vehicle_type")}
                    </div>
                  </div>
                )}

                {/* ── STEP 2 ── */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white/70 mb-3 block font-medium">How often do you wash your vehicle?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Weekly", "Bi-weekly", "Monthly", "Daily", "Rarely"].map((f) => radio("wash_frequency", f))}
                      </div>
                      {fieldError("wash_frequency")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block font-medium">Average spend per wash?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["<₹200", "₹200-400", "₹400-600", "₹600+"].map((s) => radio("current_spend", s))}
                      </div>
                      {fieldError("current_spend")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block font-medium">Biggest pain point with car washing today?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          "Long waiting time at centers",
                          "Inconsistent wash quality",
                          "Price changes every time",
                          "No way to book exact slots",
                          "Driving/Traffic to the center",
                          "Something else",
                        ].map((p) => radio("biggest_pain_point", p))}
                      </div>
                      {fieldError("biggest_pain_point")}
                    </div>
                  </div>
                )}

                {/* ── STEP 3 ── */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-brand-amber/10 border border-brand-amber/20 rounded-2xl p-5 mb-8">
                      <p className="font-semibold text-brand-amber mb-2 flex items-center gap-2">
                        <Check className="w-4 h-4" /> The Autobee Concept
                      </p>
                      <p className="text-sm text-white/60 leading-relaxed flex items-start gap-3">
                        <Smartphone className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
                        <span>One app to browse centers, book exact time slots (no waiting), and get ₹50 cashback if delayed beyond 10 mins.</span>
                      </p>
                    </div>

                    <div>
                      <Label className="text-white/70 mb-3 block font-medium">Would you book washes via this app?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {["Definitely yes", "Probably", "Maybe", "No"].map((o) => radio("would_book_via_app", o))}
                      </div>
                      {fieldError("would_book_via_app")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block font-medium">Interested in a monthly subscription?</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Yes", "Maybe", "No"].map((o) => radio("pay_for_subscription", o))}
                      </div>
                      {fieldError("pay_for_subscription")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block font-medium">Any features you'd love to see? (Optional)</Label>
                      <Textarea
                        {...register("open_feedback")}
                        placeholder="e.g. ceramic coating, interior deep clean..."
                        className="bg-[#0A0A0A] border-white/10 min-h-[120px] rounded-xl text-white focus:border-brand-amber/50"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-4 pt-10">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 h-14 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-white/60 font-semibold"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" /> Back
                </Button>
              )}
              {step < STEPS ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className={cn(
                    "h-14 bg-brand-amber hover:bg-brand-amber/90 text-black font-bold rounded-xl text-lg",
                    step > 1 ? "flex-[2]" : "flex-1"
                  )}
                >
                  Next Step <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "h-14 bg-brand-amber hover:bg-brand-amber/90 text-black font-extrabold rounded-xl text-lg",
                    step > 1 ? "flex-[2]" : "flex-1"
                  )}
                >
                  {isSubmitting ? "Submitting..." : (
                    <span className="flex items-center gap-2">
                      Submit & Enter Giveaway <Sparkles className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
