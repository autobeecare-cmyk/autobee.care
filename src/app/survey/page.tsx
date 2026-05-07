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
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = 6;

const STEP_TITLES = [
  "About You",
  "Your Vehicle",
  "Your Wash Habits",
  "AutoBee Concept",
  "Beyond Wash",
  "Final Thoughts",
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
      case 1: return ["name", "phone", "age_group", "area"];
      case 2: return ["vehicle_type", "vehicle_make_model", "vehicle_age"];
      case 3: return ["wash_frequency", "current_wash_location", "current_spend", "biggest_pain_point"];
      case 4: return ["used_wash_app_before", "would_book_via_app", "pay_for_subscription", "willingness_to_pay", "on_time_guarantee_value", "fixed_pricing_preference"];
      case 5: return ["want_vehicle_management", "insurance_reminder_useful", "service_history_useful", "prepurchase_inspection"];
      case 6: return ["refer_to_friends", "early_access_interest"];
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
                      <Label className="text-white/70 mb-2 block">Full Name</Label>
                      <Input {...register("name")} placeholder="Your full name" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                      {fieldError("name")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Phone Number</Label>
                      <Input {...register("phone")} placeholder="+91 98765 43210" type="tel" inputMode="numeric" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                      {fieldError("phone")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Email (Optional)</Label>
                      <Input {...register("email")} placeholder="your@email.com" type="email" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Age Group</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["18-25", "26-35", "36-45", "46-55", "55+"].map((age) => radio("age_group", age))}
                      </div>
                      {fieldError("age_group")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Your Area in Trivandrum</Label>
                      <AreaPicker value={watch("area") || ""} onChange={(v) => setValue("area", v, { shouldValidate: true })} />
                      {fieldError("area")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Occupation (Optional)</Label>
                      <Input {...register("occupation")} placeholder="e.g. Software Engineer" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                    </div>
                  </div>
                )}

                {/* ── STEP 2 ── */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white/70 mb-3 block">Vehicle Type</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Car only", "Bike only", "Both", "Multiple cars"].map((t) => radio("vehicle_type", t))}
                      </div>
                      {fieldError("vehicle_type")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Make & Model</Label>
                      <Input {...register("vehicle_make_model")} placeholder="e.g. Hyundai Creta" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                      {fieldError("vehicle_make_model")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Vehicle Age</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {["<1 year", "1-3 yrs", "3-5 yrs", "5-10 yrs", "10+ yrs"].map((a) => radio("vehicle_age", a))}
                      </div>
                      {fieldError("vehicle_age")}
                    </div>
                  </div>
                )}

                {/* ── STEP 3 ── */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white/70 mb-3 block">How often do you wash?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Daily", "2-3x/week", "Weekly", "Bi-weekly", "Monthly", "Rarely"].map((f) => radio("wash_frequency", f))}
                      </div>
                      {fieldError("wash_frequency")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Where do you wash currently?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {["At home myself", "Local wash center", "Apartment service", "Petrol pump", "Mix"].map((l) => radio("current_wash_location", l))}
                      </div>
                      {fieldError("current_wash_location")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">How much do you spend per wash?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["<₹100", "₹100-200", "₹200-400", "₹400-600", "₹600+"].map((s) => radio("current_spend", s))}
                      </div>
                      {fieldError("current_spend")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Biggest pain point with current wash?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          "Long waiting time",
                          "Inconsistent quality",
                          "Price uncertainty",
                          "No fixed slots",
                          "Distance/travel",
                          "No major issues",
                        ].map((p) => radio("biggest_pain_point", p))}
                      </div>
                      {fieldError("biggest_pain_point")}
                    </div>
                  </div>
                )}

                {/* ── STEP 4 ── */}
                {step === 4 && (
                  <div className="space-y-6">
                    {/* Concept card */}
                    <div className="bg-brand-amber/10 border border-brand-amber/20 rounded-2xl p-5">
                      <p className="font-semibold text-brand-amber mb-2 flex items-center gap-2">
                        <Check className="w-4 h-4" /> The AutoBee Concept
                      </p>
                      <p className="text-sm text-white/60 leading-relaxed">
                        📱 An app where you browse wash centers with fixed prices, book an exact time slot (no waiting),
                        get ₹50 cashback if delayed beyond 10 mins, and subscribe monthly for guaranteed weekly washes.
                      </p>
                    </div>

                    <div>
                      <Label className="text-white/70 mb-3 block">Have you used a wash app before?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Yes", "No"].map((o) => radio("used_wash_app_before", o))}
                      </div>
                      {fieldError("used_wash_app_before")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Would you book a car wash via this app?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {["Definitely yes", "Probably yes", "Maybe", "Probably no", "Definitely no"].map((o) => radio("would_book_via_app", o))}
                      </div>
                      {fieldError("would_book_via_app")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Would you pay for a monthly subscription?</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Yes", "Maybe", "No"].map((o) => radio("pay_for_subscription", o))}
                      </div>
                      {fieldError("pay_for_subscription")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Monthly subscription budget?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["<₹300", "₹300-500", "₹500-800", "₹800+", "Wouldn't pay"].map((o) => radio("willingness_to_pay", o))}
                      </div>
                      {fieldError("willingness_to_pay")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">How valuable is the on-time guarantee?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {["Very valuable", "Somewhat valuable", "Not important"].map((o) => radio("on_time_guarantee_value", o))}
                      </div>
                      {fieldError("on_time_guarantee_value")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">How much do you like fixed pricing?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Strongly like", "Like", "Neutral", "Don't care"].map((o) => radio("fixed_pricing_preference", o))}
                      </div>
                      {fieldError("fixed_pricing_preference")}
                    </div>
                  </div>
                )}

                {/* ── STEP 5 ── */}
                {step === 5 && (
                  <div className="space-y-6">
                    <p className="text-white/40 text-sm">AutoBee plans to grow into a full vehicle care platform — not just car wash.</p>
                    <div>
                      <Label className="text-white/70 mb-3 block">Want a vehicle management feature?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {["Yes — important", "Nice to have", "Don't need"].map((o) => radio("want_vehicle_management", o))}
                      </div>
                      {fieldError("want_vehicle_management")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Are insurance reminders useful?</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Yes", "Maybe", "No"].map((o) => radio("insurance_reminder_useful", o))}
                      </div>
                      {fieldError("insurance_reminder_useful")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Is service history tracking useful?</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Yes", "Maybe", "No"].map((o) => radio("service_history_useful", o))}
                      </div>
                      {fieldError("service_history_useful")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Would you use a pre-purchase inspection service?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {["Yes — would pay", "Maybe", "No need"].map((o) => radio("prepurchase_inspection", o))}
                      </div>
                      {fieldError("prepurchase_inspection")}
                    </div>
                  </div>
                )}

                {/* ── STEP 6 ── */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white/70 mb-3 block">Would you refer AutoBee to friends?</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Definitely", "Maybe", "No"].map((o) => radio("refer_to_friends", o))}
                      </div>
                      {fieldError("refer_to_friends")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Any feedback or features you'd love?</Label>
                      <Textarea
                        {...register("open_feedback")}
                        placeholder="Tell us anything..."
                        className="bg-[#0A0A0A] border-white/10 min-h-[120px] rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Interested in early access?</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Yes", "Maybe", "No"].map((o) => radio("early_access_interest", o))}
                      </div>
                      {fieldError("early_access_interest")}
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
                  Next <ChevronRight className="w-5 h-5 ml-1" />
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
                  {isSubmitting ? "Submitting..." : "Submit & Win 🐝"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
