"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerSurveySchema, type PartnerSurveyValues } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { RadioCard } from "@/components/survey/RadioCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Store, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = 4;

const STEP_TITLES = [
  "About Your Center",
  "Your Business",
  "Operations & Marketing",
  "Partnership Interest",
];

const STEP_SUBTITLES = [
  "Tell us about your wash center",
  "Help us understand your daily operations",
  "How you run your business today",
  "Let's talk about working together",
];

const AREAS = [
  "Pattom", "Kowdiar", "Kazhakoottam", "Technopark",
  "Vellayambalam", "Thampanoor", "Ambalamukku", "Peroorkada",
  "Statue", "Trivandrum Central", "Other"
];

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

export default function PartnerSurveyPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PartnerSurveyValues>({
    resolver: zodResolver(partnerSurveySchema),
    mode: "onTouched",
  });

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = form;

  // Load draft
  useEffect(() => {
    const saved = localStorage.getItem("autobee_partner_draft");
    if (saved) {
      try { form.reset(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Save draft
  useEffect(() => {
    const sub = watch((value) => {
      localStorage.setItem("autobee_partner_draft", JSON.stringify(value));
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const getFieldsForStep = (s: number): (keyof PartnerSurveyValues)[] => {
    switch (s) {
      case 1: return ["center_name", "owner_name", "phone", "area", "years_in_business"];
      case 2: return ["cars_per_day", "bikes_per_day", "peak_hours", "basic_wash_price", "staff_count"];
      case 3: return ["has_signage", "on_google_maps", "uses_digital_tool", "customer_acquisition", "daily_revenue_range", "slow_day_frequency"];
      case 4: return ["want_more_customers", "open_to_commission", "need_management_software", "open_to_partnership"];
      default: return [];
    }
  };

  const nextStep = async () => {
    const valid = await trigger(getFieldsForStep(step));
    if (valid) {
      setStep((s) => Math.min(s + 1, STEPS));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: PartnerSurveyValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/survey/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      localStorage.removeItem("autobee_partner_draft");
      router.push("/survey/partner/thank-you");
    } catch {
      toast.error("Failed to submit", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const radio = (name: keyof PartnerSurveyValues, option: string) => (
    <RadioCard
      key={option}
      label={option}
      selected={watch(name) === option}
      onClick={() => setValue(name as any, option, { shouldValidate: true })}
    />
  );

  const err = (name: keyof PartnerSurveyValues) =>
    errors[name] ? (
      <p className="text-red-500 text-sm mt-1">{errors[name]?.message as string}</p>
    ) : null;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-brand-amber/10 border border-brand-amber/20 rounded-full px-3 py-1">
              <Store className="w-4 h-4 text-brand-amber" />
              <span className="text-brand-amber text-xs font-bold tracking-wide uppercase">Partner Survey</span>
            </div>
            <span className="text-sm font-medium text-white/40 font-outfit">Step {step} / {STEPS}</span>
          </div>
        </div>
        {/* Progress */}
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
                {/* Step heading */}
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
                  <p className="text-white/40 mt-2 text-sm">{STEP_SUBTITLES[step - 1]}</p>
                </div>

                {/* ── STEP 1 — About Your Center ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <Label className="text-white/70 mb-2 block">Wash Center Name</Label>
                      <Input {...register("center_name")} placeholder="e.g. Shine Star Car Wash" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                      {err("center_name")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Owner Name</Label>
                      <Input {...register("owner_name")} placeholder="Your full name" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                      {err("owner_name")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Phone Number</Label>
                      <Input {...register("phone")} placeholder="+91 98765 43210" type="tel" inputMode="numeric" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                      {err("phone")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Center Location</Label>
                      <AreaPicker value={watch("area") || ""} onChange={(v) => setValue("area", v, { shouldValidate: true })} />
                      {err("area")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Years in Business</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {["<1 year", "1-2 yrs", "2-5 yrs", "5-10 yrs", "10+ yrs"].map((y) => radio("years_in_business", y))}
                      </div>
                      {err("years_in_business")}
                    </div>
                  </div>
                )}

                {/* ── STEP 2 — Your Business ── */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <Label className="text-white/70 mb-3 block">Cars washed per day (avg)</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {["1-10", "10-20", "20-30", "30-50", "50+"].map((c) => radio("cars_per_day", c))}
                      </div>
                      {err("cars_per_day")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Bikes washed per day (avg)</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {["0", "1-10", "10-20", "20-30", "30+"].map((b) => radio("bikes_per_day", b))}
                      </div>
                      {err("bikes_per_day")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Peak hours</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Morning (7-11am)", "Afternoon (11am-3pm)", "Evening (3-7pm)", "Late evening (7pm+)", "Spread through day"].map((h) => radio("peak_hours", h))}
                      </div>
                      {err("peak_hours")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Basic wash price (per car)</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {["<₹100", "₹100-150", "₹150-200", "₹200-300", "₹300+"].map((p) => radio("basic_wash_price", p))}
                      </div>
                      {err("basic_wash_price")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Premium wash price (optional)</Label>
                      <Input {...register("premium_wash_price")} placeholder="e.g. ₹400 for full wash + interior" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Add-ons offered (optional)</Label>
                      <Input {...register("add_ons_offered")} placeholder="e.g. waxing, vacuum, ceramic coat" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Total staff count</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {["1-2", "3-5", "6-10", "10-20", "20+"].map((s) => radio("staff_count", s))}
                      </div>
                      {err("staff_count")}
                    </div>
                  </div>
                )}

                {/* ── STEP 3 — Operations & Marketing ── */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <Label className="text-white/70 mb-3 block">Do you have a signboard / branding?</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Yes", "Partial", "No"].map((o) => radio("has_signage", o))}
                      </div>
                      {err("has_signage")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Listed on Google Maps?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Yes", "No"].map((o) => radio("on_google_maps", o))}
                      </div>
                      {err("on_google_maps")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Do you use any digital tools to manage bookings?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {["Yes — dedicated software", "Just WhatsApp", "Pen & paper only", "No — walk-ins only"].map((o) => radio("uses_digital_tool", o))}
                      </div>
                      {err("uses_digital_tool")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">How do most customers find you?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {["Walk-in", "Word of mouth", "Google Maps", "Instagram/Social", "Flyers/ads", "Mix of these"].map((o) => radio("customer_acquisition", o))}
                      </div>
                      {err("customer_acquisition")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">How do you keep repeat customers? (optional)</Label>
                      <Input {...register("retention_method")} placeholder="e.g. loyalty cards, WhatsApp reminders" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Typical daily revenue range</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["<₹1,000", "₹1-2K", "₹2-5K", "₹5-10K", "₹10K+"].map((r) => radio("daily_revenue_range", r))}
                      </div>
                      {err("daily_revenue_range")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">How often do you have slow days?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {["Rarely", "Once a week", "2-3 times a week", "More than half the time"].map((f) => radio("slow_day_frequency", f))}
                      </div>
                      {err("slow_day_frequency")}
                    </div>
                  </div>
                )}

                {/* ── STEP 4 — Partnership Interest ── */}
                {step === 4 && (
                  <div className="space-y-5">
                    {/* Partnership card */}
                    <div className="bg-brand-amber/10 border border-brand-amber/20 rounded-2xl p-5 mb-2">
                      <p className="font-bold text-brand-amber mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Autobee Partnership
                      </p>
                      <p className="text-sm text-white/60 leading-relaxed">
                        Autobee connects pre-verified customers to your center, handles scheduling, and guarantees timely payments — you just focus on washing. We take a small commission per booking.
                      </p>
                    </div>

                    <div>
                      <Label className="text-white/70 mb-3 block">Do you want more consistent customers?</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Yes", "Maybe", "No"].map((o) => radio("want_more_customers", o))}
                      </div>
                      {err("want_more_customers")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Open to paying a commission per booking?</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Yes", "Maybe", "No"].map((o) => radio("open_to_commission", o))}
                      </div>
                      {err("open_to_commission")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Acceptable commission rate</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["5-8%", "8-12%", "12-15%", "Depends on volume", "Not open to commission"].map((c) => radio("acceptable_commission" as keyof PartnerSurveyValues, c))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Would you use our booking & management software?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {["Yes — definitely", "Yes if it's easy to use", "Maybe", "I prefer pen & paper"].map((o) => radio("need_management_software", o))}
                      </div>
                      {err("need_management_software")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Where do you source your raw materials? (optional)</Label>
                      <Input {...register("raw_materials_source")} placeholder="e.g. local supplier, wholesale market" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Overall — would you like to partner with Autobee?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          "Yes — sign me up!",
                          "Yes — but tell me more first",
                          "Maybe — need more info",
                          "Not right now",
                        ].map((o) => radio("open_to_partnership", o))}
                      </div>
                      {err("open_to_partnership")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Any questions or comments? (optional)</Label>
                      <Textarea
                        {...register("notes")}
                        placeholder="Anything you'd like us to know..."
                        className="bg-[#0A0A0A] border-white/10 min-h-[100px] rounded-xl text-white"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-4 pt-10 pb-12">
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
                  {isSubmitting ? "Submitting..." : (
                    <span className="flex items-center gap-2">
                      Submit & Partner with Us <Sparkles className="w-5 h-5" />
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
