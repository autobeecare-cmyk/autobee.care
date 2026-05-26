"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerSurveySchema, type PartnerSurveyValues } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { RadioCard } from "@/components/survey/RadioCard";
import { CheckboxCard } from "@/components/survey/CheckboxCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Store, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = 8;

const STEP_TITLES = [
  "Business Information",
  "Operating Hours & Capacity",
  "Services & Duration",
  "Current Customer Acquisition",
  "Walk-in Buffer & Slot Strategy",
  "Technical Readiness",
  "Commitment & Payment",
  "Confirmation & Next Steps"
];

const STEP_SUBTITLES = [
  "Let's get to know your center",
  "When are you open and how much can you handle?",
  "What do you offer and how long does it take?",
  "How are customers finding you today?",
  "Managing your daily capacity",
  "Getting set up with the app",
  "Let's finalize the details",
  "Ready to go live"
];

const SERVICES_LIST = [
  { id: "exterior_wash", label: "Exterior wash (quick rinse)", defaultDuration: 30 },
  { id: "interior_exterior_wash", label: "Interior + Exterior wash (full wash)", defaultDuration: 60 },
  { id: "full_detailing", label: "Full detailing (wash + interior cleaning + polish)", defaultDuration: 120 },
  { id: "premium_detailing", label: "Premium detailing (wash + interior + coating + wax)", defaultDuration: 180 },
  { id: "ac_service", label: "AC service & maintenance", defaultDuration: 90 },
  { id: "mechanical_work", label: "Mechanical work (general repair)", defaultDuration: 150 }, // typical range midpoint
  { id: "tire_service", label: "Tire service", defaultDuration: 45 },
  { id: "battery_service", label: "Battery service", defaultDuration: 30 },
  { id: "other", label: "Other", defaultDuration: 60 },
];

export default function PartnerSurveyPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(partnerSurveySchema),
    mode: "onTouched",
    defaultValues: {
      has_weekend_hours: false,
      has_lunch_break: false,
      services_offered: [],
      service_durations: {},
      service_prices: {},
      acquisition_channels: [],
      walk_in_buffer_percent: 25,
      trial_commitment: false,
      confirmed_ready: false,
    } as any
  });

  const { register, handleSubmit, watch, setValue, trigger, control, formState: { errors } } = form;

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
      case 1: return ["business_name", "owner_name", "phone_number", "address", "years_in_business"];
      case 2: return ["vehicle_capacity", "regular_open_time", "regular_close_time", "has_weekend_hours", "saturday_open_time", "saturday_close_time", "sunday_open_time", "sunday_close_time", "weekly_off_day", "has_lunch_break", "lunch_start_time", "lunch_end_time"];
      case 3: return ["services_offered", "service_durations", "service_prices"];
      case 4: return ["daily_vehicles", "repeat_customer_percentage", "acquisition_channels", "biggest_pain_point"];
      case 5: return ["walk_in_percentage", "walk_in_buffer_percent"];
      case 6: return ["has_smartphone", "app_comfort_level", "response_time"];
      case 7: return ["trial_commitment", "bank_account_name", "bank_name", "bank_account_number", "bank_account_type", "bank_ifsc_code", "upi_id", "contact_preference"];
      case 8: return ["confirmed_ready", "additional_comments"];
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

  const onSubmit = async (data: any) => {
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

  const radio = (name: keyof PartnerSurveyValues, option: string, description?: string) => (
    <RadioCard
      key={option}
      label={option}
      description={description}
      selected={watch(name) === option}
      onClick={() => setValue(name as any, option, { shouldValidate: true })}
    />
  );

  const booleanRadio = (name: keyof PartnerSurveyValues, labelYes: string, labelNo: string) => {
    const val = watch(name);
    return (
      <div className="contents">
        <RadioCard label={labelYes} selected={val === true} onClick={() => setValue(name as any, true, { shouldValidate: true })} />
        <RadioCard label={labelNo} selected={val === false} onClick={() => setValue(name as any, false, { shouldValidate: true })} />
      </div>
    );
  };

  const checkbox = (name: "services_offered" | "acquisition_channels", option: string) => {
    const current = watch(name) || [];
    const isSelected = current.includes(option);
    return (
      <CheckboxCard
        key={option}
        label={option}
        selected={isSelected}
        onClick={() => {
          if (isSelected) {
            setValue(name, current.filter((c: string) => c !== option), { shouldValidate: true });
          } else {
            setValue(name, [...current, option], { shouldValidate: true });
            
            // If selecting a service, set its default duration
            if (name === "services_offered") {
              const srv = SERVICES_LIST.find(s => s.label === option);
              if (srv) {
                const currentDurations = watch("service_durations") || {};
                setValue("service_durations", { ...currentDurations, [option]: srv.defaultDuration });
              }
            }
          }
        }}
      />
    );
  };

  const err = (name: string) =>
    errors[name] ? (
      <p className="text-red-500 text-sm mt-1">{(errors[name] as any)?.message as string}</p>
    ) : null;

  const errNested = (obj: any, key: string) =>
    obj && obj[key] ? (
      <p className="text-red-500 text-sm mt-1">{obj[key]?.message as string}</p>
    ) : null;

  // Render logic for Step 5 walk-in buffer
  const capacity = watch("vehicle_capacity") || 0;
  const bufferPercent = watch("walk_in_buffer_percent") || 0;
  // Approximating operating hours if available
  const openTimeStr = watch("regular_open_time") || "09:00";
  const closeTimeStr = watch("regular_close_time") || "18:00";
  
  let hours = 8; // fallback
  try {
    const [oH, oM] = openTimeStr.split(":").map(Number);
    const [cH, cM] = closeTimeStr.split(":").map(Number);
    if (!isNaN(oH) && !isNaN(cH)) {
      let diff = (cH * 60 + cM) - (oH * 60 + oM);
      if (watch("has_lunch_break")) {
         // rough 60 min subtract if they have lunch break for preview sake
         diff -= 60;
      }
      hours = diff > 0 ? diff / 60 : 8;
    }
  } catch(e) {}
  
  const estimatedTotalSlots = Math.max(1, Math.floor(capacity * hours));
  const reservedSlots = Math.floor(estimatedTotalSlots * (bufferPercent / 100));
  const bookableSlots = estimatedTotalSlots - reservedSlots;

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

                {/* ── STEP 1 — Business Info ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <Label className="text-white/70 mb-2 block">Business Name</Label>
                      <Input {...register("business_name")} placeholder="e.g. XYZ Car Wash Center" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                      {err("business_name")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Owner/Manager Name</Label>
                      <Input {...register("owner_name")} placeholder="Who should we contact for support?" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                      {err("owner_name")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Phone Number</Label>
                      <Input {...register("phone_number")} placeholder="+91 98765 43210" type="tel" inputMode="numeric" className="bg-[#0A0A0A] border-white/10 h-14 text-white" />
                      <p className="text-white/30 text-xs mt-2">We'll use this for booking updates and support</p>
                      {err("phone_number")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-2 block">Business Address / Location</Label>
                      <Textarea {...register("address")} placeholder="Full address in Trivandrum" className="bg-[#0A0A0A] border-white/10 min-h-[100px] text-white" />
                      {err("address")}
                    </div>
                    <div>
                      <Label className="text-white/70 mb-3 block">Years in Business</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Less than 1 year", "1-2 years", "2-5 years", "5+ years"].map((y) => radio("years_in_business", y))}
                      </div>
                      {err("years_in_business")}
                    </div>
                  </div>
                )}

                {/* ── STEP 2 — Operating Hours & Capacity ── */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                      <Label className="text-white/90 mb-2 block font-semibold text-lg">Total Vehicle Capacity</Label>
                      <p className="text-white/50 text-sm mb-4">How many vehicles can you service at the same time across all your bays/stations?</p>
                      <Input {...register("vehicle_capacity")} type="number" min="1" max="20" placeholder="e.g. 4" className="bg-[#0A0A0A] border-white/10 h-14 text-white text-lg w-32" />
                      {err("vehicle_capacity")}
                    </div>
                    
                    <div>
                      <Label className="text-white/70 mb-3 block">Regular Operating Hours</Label>
                      <div className="flex gap-4 items-center">
                        <div className="flex-1">
                          <Label className="text-white/40 text-xs mb-1 block">Open Time</Label>
                          <Input {...register("regular_open_time")} type="time" className="bg-[#0A0A0A] border-white/10 h-14 text-white" style={{ colorScheme: 'dark' }} />
                          {err("regular_open_time")}
                        </div>
                        <span className="text-white/40 mt-4">to</span>
                        <div className="flex-1">
                          <Label className="text-white/40 text-xs mb-1 block">Close Time</Label>
                          <Input {...register("regular_close_time")} type="time" className="bg-[#0A0A0A] border-white/10 h-14 text-white" style={{ colorScheme: 'dark' }} />
                          {err("regular_close_time")}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-white/70 mb-3 block">Do you have different hours on weekends?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {booleanRadio("has_weekend_hours", "Yes", "No")}
                      </div>
                      {watch("has_weekend_hours") && (
                        <div className="mt-4 space-y-4 p-4 border border-brand-amber/20 bg-brand-amber/5 rounded-xl">
                          <div>
                            <Label className="text-brand-amber/80 text-sm mb-2 block font-medium">Saturday Hours</Label>
                            <div className="flex gap-4 items-center">
                              <Input {...register("saturday_open_time")} type="time" className="bg-[#0A0A0A] border-white/10 h-12 text-white flex-1" style={{ colorScheme: 'dark' }} />
                              <span className="text-white/40">to</span>
                              <Input {...register("saturday_close_time")} type="time" className="bg-[#0A0A0A] border-white/10 h-12 text-white flex-1" style={{ colorScheme: 'dark' }} />
                            </div>
                          </div>
                          <div>
                            <Label className="text-brand-amber/80 text-sm mb-2 block font-medium">Sunday Hours</Label>
                            <div className="flex gap-4 items-center">
                              <Input {...register("sunday_open_time")} type="time" className="bg-[#0A0A0A] border-white/10 h-12 text-white flex-1" style={{ colorScheme: 'dark' }} />
                              <span className="text-white/40">to</span>
                              <Input {...register("sunday_close_time")} type="time" className="bg-[#0A0A0A] border-white/10 h-12 text-white flex-1" style={{ colorScheme: 'dark' }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-white/70 mb-3 block">Weekly Off Day</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["No off day", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => radio("weekly_off_day", d))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-white/70 mb-3 block">Do you take a standard lunch break?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {booleanRadio("has_lunch_break", "Yes", "No")}
                      </div>
                      {watch("has_lunch_break") && (
                         <div className="mt-4 flex gap-4 items-center p-4 border border-brand-amber/20 bg-brand-amber/5 rounded-xl">
                            <Input {...register("lunch_start_time")} type="time" className="bg-[#0A0A0A] border-white/10 h-12 text-white flex-1" style={{ colorScheme: 'dark' }} />
                            <span className="text-white/40">to</span>
                            <Input {...register("lunch_end_time")} type="time" className="bg-[#0A0A0A] border-white/10 h-12 text-white flex-1" style={{ colorScheme: 'dark' }} />
                         </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── STEP 3 — Services & Duration ── */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white/90 mb-2 block text-lg font-semibold">Services Offered</Label>
                      <p className="text-white/50 text-sm mb-4">Select all services you currently offer.</p>
                      <div className="grid grid-cols-1 gap-3">
                        {SERVICES_LIST.map((srv) => checkbox("services_offered", srv.label))}
                      </div>
                      {err("services_offered")}
                    </div>

                    {watch("services_offered")?.length > 0 && (
                      <div className="pt-6 border-t border-white/10 space-y-6">
                        <Label className="text-white/90 block text-lg font-semibold">Service Details</Label>
                        <p className="text-white/50 text-sm">How long does each service take and what is the typical price?</p>
                        
                        {watch("services_offered").map((srvLabel: string) => {
                           const srv = SERVICES_LIST.find(s => s.label === srvLabel);
                           return (
                             <div key={srvLabel} className="bg-white/5 p-4 rounded-xl border border-white/10">
                               <p className="font-bold text-white mb-4 text-sm">{srvLabel}</p>
                               <div className="grid grid-cols-2 gap-4">
                                 <div>
                                   <Label className="text-white/50 text-xs mb-1 block">Duration (mins)</Label>
                                   <Input 
                                      {...register(`service_durations.${srvLabel}` as any)} 
                                      type="number" 
                                      className="bg-[#0A0A0A] border-white/20 h-12 text-white" 
                                    />
                                   {errNested(errors.service_durations, srvLabel)}
                                 </div>
                                 <div>
                                   <Label className="text-white/50 text-xs mb-1 block">Current Price (₹)</Label>
                                   <Input 
                                      {...register(`service_prices.${srvLabel}` as any)} 
                                      type="number" 
                                      placeholder="e.g. 500"
                                      className="bg-[#0A0A0A] border-white/20 h-12 text-white" 
                                    />
                                 </div>
                               </div>
                             </div>
                           );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 4 — Current Customer Acquisition ── */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white/70 mb-2 block">Daily Average Vehicles</Label>
                      <Input {...register("daily_vehicles")} type="number" min="1" max="200" placeholder="On a regular day" className="bg-[#0A0A0A] border-white/10 h-14 text-white w-full sm:w-48" />
                      {err("daily_vehicles")}
                    </div>
                    
                    <div>
                      <Label className="text-white/70 mb-3 block">What % of your business is repeat customers?</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["Less than 10% (mostly one-time)", "10-30% (some repeats)", "30-50% (decent loyalty)", "50%+ (strong repeat customers)"].map((opt) => radio("repeat_customer_percentage", opt))}
                      </div>
                      {err("repeat_customer_percentage")}
                    </div>

                    <div>
                      <Label className="text-white/70 mb-3 block">How do customers currently find you?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {["Word of mouth / referral", "Signboard / roadside", "Google search", "Facebook / Instagram", "Other apps", "Direct walk-in"].map((opt) => checkbox("acquisition_channels", opt))}
                      </div>
                      {err("acquisition_channels")}
                    </div>

                    <div>
                      <Label className="text-white/70 mb-2 block">What's your biggest pain point right now? <span className="text-white/30">(optional)</span></Label>
                      <Textarea {...register("biggest_pain_point")} placeholder="e.g., reaching more customers, managing walk-ins, payment hassles, etc." className="bg-[#0A0A0A] border-white/10 min-h-[100px] text-white" />
                    </div>
                  </div>
                )}

                {/* ── STEP 5 — Walk-in Buffer & Slot Strategy ── */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white/70 mb-3 block">What % of your daily customers are walk-ins (unplanned)?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {["0-20% (mostly planned/call ahead)", "20-40% (significant walk-in traffic)", "40-60% (half walk-in, half planned)", "60%+ (mostly walk-in, unpredictable)"].map((opt) => radio("walk_in_percentage", opt))}
                      </div>
                      {err("walk_in_percentage")}
                    </div>

                    <div className="pt-4">
                      <Label className="text-white/90 mb-2 block text-lg font-semibold">Walk-in Buffer</Label>
                      <p className="text-white/50 text-sm mb-6">How much of your daily capacity should we reserve for walk-in customers? We'll keep these off the app so you can serve them without conflicts.</p>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <input 
                          type="range" 
                          min="0" 
                          max="50" 
                          step="5"
                          {...register("walk_in_buffer_percent")}
                          className="w-full accent-brand-amber cursor-pointer"
                        />
                        <span className="text-2xl font-bold text-brand-amber w-16 text-right">{bufferPercent}%</span>
                      </div>

                      <div className="bg-[#111] border border-[#222] rounded-xl p-5 mt-6 font-mono text-sm leading-relaxed text-white/70">
                        <p className="text-white/50 mb-2 text-xs font-bold tracking-wider">LIVE PREVIEW</p>
                        <p>Capacity per day: <span className="text-white">{capacity} vehicles (simultaneously)</span></p>
                        <p>Walk-in buffer: <span className="text-white">{bufferPercent}%</span></p>
                        <div className="h-px bg-white/10 my-3"></div>
                        <p className="text-brand-amber/80">➜ Reserved for walk-ins: <span className="font-bold text-brand-amber">{reservedSlots} slots/day</span></p>
                        <p className="text-green-400/80">➜ App bookings available: <span className="font-bold text-green-400">{bookableSlots} slots/day</span></p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 6 — Technical Readiness ── */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white/70 mb-3 block">Do you have a smartphone for the business?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {booleanRadio("has_smartphone", "Yes (Android/iPhone)", "No")}
                      </div>
                      {err("has_smartphone")}
                    </div>
                    
                    <div>
                      <Label className="text-white/70 mb-3 block">Are you comfortable using an app to manage bookings?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          "Very comfortable (use apps daily)",
                          "Somewhat comfortable (can learn quickly)",
                          "Not very comfortable (might need training)",
                          "Unsure / prefer manual"
                        ].map((opt) => radio("app_comfort_level", opt))}
                      </div>
                      {err("app_comfort_level")}
                    </div>

                    <div>
                      <Label className="text-white/70 mb-3 block">How quickly can you respond to new bookings?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          "Within 5 minutes (I'm always available)",
                          "Within 15 minutes (normal response time)",
                          "Within 30 minutes (reasonable for my business)",
                          "Within 1 hour (slower response)",
                          "Varies (depends on the day)"
                        ].map((opt) => radio("response_time", opt))}
                      </div>
                      {err("response_time")}
                    </div>
                  </div>
                )}

                {/* ── STEP 7 — Commitment & Payment ── */}
                {step === 7 && (
                  <div className="space-y-6">
                    <div className="bg-brand-amber/10 border border-brand-amber/20 rounded-2xl p-5 mb-2">
                      <p className="font-bold text-brand-amber mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Phase 1 Trial (6 Months)
                      </p>
                      <p className="text-sm text-white/70 leading-relaxed mb-4">
                        Phase 1 trial includes a ₹1,000 registration fee (split weekly) and 0% commission on bookings for 6 months. After 6 months, we move to a revenue sharing model (15-20% per booking).
                      </p>
                      <Label className="text-white font-bold block mb-3">Can you commit to 6 months on AutoBee as a trial period?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {booleanRadio("trial_commitment", "Yes, I commit", "No")}
                      </div>
                      {err("trial_commitment")}
                    </div>

                    {watch("trial_commitment") && (
                      <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Bank Account Details (For Weekly Settlement)</h3>
                        <p className="text-sm text-white/40">We'll settle your earnings weekly to this account. UPI is faster if available.</p>
                        
                        <div>
                          <Label className="text-white/70 mb-2 block">Account Holder Name</Label>
                          <Input {...register("bank_account_name")} placeholder="As per bank records" className="bg-[#0A0A0A] border-white/10 h-12 text-white" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white/70 mb-2 block">Bank Name</Label>
                            <Input {...register("bank_name")} placeholder="e.g. HDFC Bank" className="bg-[#0A0A0A] border-white/10 h-12 text-white" />
                          </div>
                          <div>
                            <Label className="text-white/70 mb-2 block">Account Type</Label>
                            <div className="flex gap-2">
                              <Button type="button" variant="outline" onClick={() => setValue("bank_account_type", "Saving")} className={cn("flex-1 bg-[#0A0A0A] border-white/10", watch("bank_account_type") === "Saving" && "border-brand-amber text-brand-amber")}>Saving</Button>
                              <Button type="button" variant="outline" onClick={() => setValue("bank_account_type", "Current")} className={cn("flex-1 bg-[#0A0A0A] border-white/10", watch("bank_account_type") === "Current" && "border-brand-amber text-brand-amber")}>Current</Button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label className="text-white/70 mb-2 block">Account Number</Label>
                          <Input {...register("bank_account_number")} className="bg-[#0A0A0A] border-white/10 h-12 text-white" />
                        </div>
                        <div>
                          <Label className="text-white/70 mb-2 block">IFSC Code</Label>
                          <Input {...register("bank_ifsc_code")} placeholder="e.g. HDFC0001234" className="bg-[#0A0A0A] border-white/10 h-12 text-white uppercase" />
                        </div>
                        <div>
                          <Label className="text-white/70 mb-2 block">UPI ID (Optional)</Label>
                          <Input {...register("upi_id")} placeholder="yourname@bank" className="bg-[#0A0A0A] border-white/10 h-12 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <Label className="text-white/70 mb-3 block">How do you prefer to be contacted for support?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["WhatsApp", "Phone call", "Email", "In-person visit"].map((opt) => radio("contact_preference", opt))}
                      </div>
                      {err("contact_preference")}
                    </div>
                  </div>
                )}

                {/* ── STEP 8 — Confirmation ── */}
                {step === 8 && (
                  <div className="space-y-6">
                    <div className="bg-[#111] border border-[#222] p-5 rounded-xl">
                      <h3 className="font-bold text-white mb-4 text-lg">Review & Confirmation</h3>
                      <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className={cn("w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors", watch("confirmed_ready") ? "bg-brand-amber border-brand-amber text-black" : "border-white/20 bg-black group-hover:border-white/40")}>
                            {watch("confirmed_ready") && <Check className="w-4 h-4" />}
                          </div>
                          <input type="checkbox" className="hidden" {...register("confirmed_ready")} />
                          <div className="text-sm text-white/80 leading-snug">
                            <p className="mb-2">I have reviewed all the information above and confirm it is accurate.</p>
                            <p className="mb-2">I am ready to start Phase 1 (6-month trial).</p>
                            <p>I understand the ₹1,000 registration will be charged weekly over 26 weeks.</p>
                          </div>
                        </label>
                      </div>
                      {err("confirmed_ready")}
                    </div>

                    <div>
                      <Label className="text-white/70 mb-2 block">Additional Comments <span className="text-white/30">(optional)</span></Label>
                      <Textarea
                        {...register("additional_comments")}
                        placeholder="Anything else you'd like us to know?"
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
                  disabled={isSubmitting || !watch("confirmed_ready")}
                  className={cn(
                    "h-14 bg-brand-amber hover:bg-brand-amber/90 text-black font-extrabold rounded-xl text-lg transition-all",
                    step > 1 ? "flex-[2]" : "flex-1",
                    (!watch("confirmed_ready")) && "opacity-50 cursor-not-allowed grayscale"
                  )}
                >
                  {isSubmitting ? "Submitting..." : (
                    <span className="flex items-center gap-2">
                      Submit Application <Sparkles className="w-5 h-5" />
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
