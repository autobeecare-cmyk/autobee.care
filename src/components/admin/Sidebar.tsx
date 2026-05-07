"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { 
  LayoutDashboard, UserCheck, Users, Store, LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
  onLogout: () => void;
  user?: any;
}

export const Sidebar = ({ activeView, setActiveView, onLogout, user }: SidebarProps) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "waitlist", label: "Waitlist", icon: UserCheck },
    { id: "owners", label: "Car Owners", icon: Users },
    { id: "partners", label: "Partners", icon: Store },
  ];

  return (
    <aside className="w-72 border-r border-white/5 bg-black p-8 flex flex-col sticky top-0 h-screen hidden lg:flex">
      <Logo className="mb-12" />
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
              activeView === item.id 
                ? "bg-brand-amber text-black font-bold shadow-lg shadow-brand-amber/10" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {activeView === item.id && (
              <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 bg-black rounded-full" />
            )}
          </button>
        ))}
      </nav>

      <div className="pt-8 border-t border-white/5 mt-8 space-y-4">
        <div className="flex items-center gap-3 px-4">
          <div className="w-10 h-10 rounded-full bg-brand-amber flex items-center justify-center font-bold text-black text-sm uppercase">
            {user?.email?.[0] || "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{user?.email?.split('@')[0] || "Admin"}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold truncate">{user?.email || "Autobee HQ"}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
