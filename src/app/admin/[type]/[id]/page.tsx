"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, Calendar, Phone, Mail, MapPin, 
  User, Store, ClipboardList, Clock, ArrowRight,
  Zap, AlertCircle, Sparkles, Database
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { type, id } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/detail?type=${type}&id=${id}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-amber animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <p>Entry not found</p>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  // Define which keys to hide in the dynamic sections
  const hiddenKeys = ["id", "created_at", "name", "owner_name", "center_name", "phone", "email"];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-instrument pb-20">
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-white/40 hover:text-white hover:bg-white/5"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <Logo />
          <div className="w-24 hidden md:block" />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header Card */}
          <Card className="bg-[#0A0A0A] border-white/5 p-8 rounded-[2.5rem] mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
              {type === "partners" ? <Store size={180} /> : <User size={180} />}
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
              <div className="w-24 h-24 bg-brand-amber/10 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(245,183,0,0.1)]">
                {type === "partners" ? <Store className="w-10 h-10 text-brand-amber" /> : <User className="w-10 h-10 text-brand-amber" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-brand-amber/10 text-brand-amber rounded-full text-[10px] font-bold uppercase tracking-widest border border-brand-amber/20">
                    {type}
                  </span>
                  <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Database className="w-3 h-3" /> ID: {id?.toString().slice(0, 8)}...
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-outfit font-bold">{data.name || data.center_name || "Anonymous"}</h1>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Phone className="w-4 h-4 text-brand-amber" /> {data.phone}
                  </div>
                  {data.email && (
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                      <Mail className="w-4 h-4 text-brand-amber" /> {data.email}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <MapPin className="w-4 h-4 text-brand-amber" /> {data.area}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                 <Button className="bg-brand-amber hover:bg-brand-amber/90 text-black font-bold h-12 rounded-xl px-8">
                   Contact via WhatsApp
                 </Button>
                 <p className="text-[10px] text-white/20 text-center uppercase tracking-tighter">Joined on {new Date(data.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dynamic Rendering of All Supabase Fields */}
            {Object.entries(data).map(([key, value]) => {
              if (hiddenKeys.includes(key)) return null;
              
              const isLongText = typeof value === 'string' && value.length > 50;
              const formattedKey = key.replace(/_/g, ' ');

              return (
                <Card 
                  key={key} 
                  className={cn(
                    "bg-[#0A0A0A] border-white/5 p-6 rounded-2xl flex flex-col gap-2 group hover:border-brand-amber/20 transition-all",
                    isLongText && "md:col-span-2 lg:col-span-3"
                  )}
                >
                  <div className="flex items-center gap-2 text-white/30">
                    {key.includes('wash') || key.includes('car') ? <Zap className="w-3 h-3" /> : 
                     key.includes('pain') ? <AlertCircle className="w-3 h-3" /> : 
                     key.includes('feedback') || key.includes('reason') ? <Sparkles className="w-3 h-3" /> : 
                     <ClipboardList className="w-3 h-3" />}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{formattedKey}</span>
                  </div>
                  <p className={cn(
                    "text-lg font-medium text-white/90 leading-relaxed",
                    isLongText ? "text-base italic text-white/60" : ""
                  )}>
                    {value?.toString() || "N/A"}
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 p-8 bg-white/5 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl font-bold">Admin Notes</h3>
              <p className="text-white/40 text-sm italic">Add private internal notes about this {type === 'partners' ? 'center' : 'user'}</p>
            </div>
            <div className="flex-1 w-full max-w-md relative">
               <textarea 
                 placeholder="Type a note..." 
                 className="w-full bg-black/40 border-white/10 rounded-2xl p-4 text-sm focus:border-brand-amber/50 focus:ring-0 transition-all min-h-[100px]"
               />
               <Button size="sm" className="absolute bottom-3 right-3 bg-white/10 hover:bg-white/20 text-white text-xs h-8 px-4 rounded-lg">Save Note</Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
