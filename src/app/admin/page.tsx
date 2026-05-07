"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Filter, Download, Loader2, Lock 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Refactored Components
import { Sidebar } from "@/components/admin/Sidebar";
import { Overview } from "@/components/admin/Overview";
import { WaitlistTable } from "@/components/admin/WaitlistTable";
import { OwnersTable } from "@/components/admin/OwnersTable";
import { PartnersTable } from "@/components/admin/PartnersTable";

type View = "overview" | "waitlist" | "owners" | "partners";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeView, setActiveView] = useState<View>("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchStats();
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      setUser(data.user);
      toast.success("Welcome back, Admin!");
      fetchStats();
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveView("overview");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-amber animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="flex flex-col items-center mb-12">
            <Logo className="scale-125 mb-4" />
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-amber/10 border border-brand-amber/20 rounded-full">
              <Lock className="w-3 h-3 text-brand-amber" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-amber">Secure Admin Terminal</span>
            </div>
          </div>
          
          <Card className="bg-[#0A0A0A] border-white/5 p-8 rounded-[2rem] shadow-2xl">
            <h1 className="text-2xl font-outfit font-bold text-white mb-2 text-center">Authentication</h1>
            <p className="text-white/40 text-sm text-center mb-8">Sign in with your Supabase account</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                <Input 
                  type="email" 
                  placeholder="admin@autobee.care" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 h-14 rounded-xl text-white px-6 focus:border-brand-amber/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 h-14 rounded-xl text-white px-6 focus:border-brand-amber/50"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 bg-brand-amber hover:bg-brand-amber/90 text-black font-extrabold rounded-xl text-lg shadow-[0_0_30px_rgba(245,183,0,0.2)] mt-4"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In to Dashboard"}
              </Button>
            </form>
          </Card>
          
          <p className="text-center text-white/20 text-xs mt-8">
            Only authorized team members can access this area.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-instrument flex">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={handleLogout} 
        user={user}
      />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-outfit font-bold capitalize">{activeView}</h1>
            <p className="text-white/40 mt-1">Manage and track Autobee growth metrics</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border-white/10 pl-11 h-12 rounded-xl text-sm focus:ring-1 focus:ring-brand-amber/50" 
              />
            </div>
            <Button variant="outline" className="h-12 border-white/10 hover:bg-white/5 rounded-xl px-4 text-white/60">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
            <Button className="h-12 bg-brand-amber hover:bg-brand-amber/90 text-black font-bold rounded-xl px-4">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeView === "overview" && <Overview data={data} />}
          {activeView === "waitlist" && <WaitlistTable data={data?.waitlist} search={searchTerm} />}
          {activeView === "owners" && <OwnersTable data={data?.owners?.raw} search={searchTerm} />}
          {activeView === "partners" && <PartnersTable data={data?.partners} search={searchTerm} />}
        </AnimatePresence>
      </main>
    </div>
  );
}
