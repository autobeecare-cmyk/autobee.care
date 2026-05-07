"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ChevronRight, Zap, AlertCircle, MessageSquare } from "lucide-react";
import { EmptyState } from "./WaitlistTable";

interface OwnersTableProps {
  data: any[];
  search: string;
}

export const OwnersTable = ({ data, search }: OwnersTableProps) => {
  const router = useRouter();
  const filtered = (data || []).filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.vehicle_type.toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (id: string) => {
    router.push(`/admin/owners/${id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Desktop Table View */}
      <Card className="bg-[#0A0A0A] border-white/5 overflow-hidden rounded-3xl hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/30 border-b border-white/5">
            <tr>
              <th className="px-8 py-5">Customer</th>
              <th className="px-8 py-5">Vehicle Type</th>
              <th className="px-8 py-5">Pain Point</th>
              <th className="px-8 py-5 text-right">Intent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((item, i) => (
              <tr 
                key={i} 
                onClick={() => handleRowClick(item.id)}
                className="hover:bg-white/[0.02] transition-all group cursor-pointer"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold">
                      {item.name[0]}
                    </div>
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-[10px] text-white/40">{item.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <span className="px-3 py-1 bg-brand-amber/10 text-brand-amber rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                    {item.vehicle_type}
                   </span>
                </td>
                <td className="px-8 py-6 text-sm text-white/50 max-w-xs truncate">
                  {item.biggest_pain_point}
                </td>
                <td className="px-8 py-6 text-right">
                   <div className={cn(
                     "text-[10px] font-bold uppercase px-3 py-1 rounded-full inline-block",
                     item.would_book_via_app.includes("yes") ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/40"
                   )}>
                    {item.would_book_via_app}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState />}
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filtered.map((item, i) => (
          <Card 
            key={i} 
            onClick={() => handleRowClick(item.id)}
            className="bg-[#0A0A0A] border-white/5 p-6 rounded-3xl flex flex-col gap-5 active:scale-95 transition-transform"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white/40">
                    {item.name[0]}
                </div>
                <div>
                    <h4 className="font-bold text-white">{item.name}</h4>
                    <span className="px-2 py-0.5 bg-brand-amber/10 text-brand-amber rounded-full text-[9px] font-bold uppercase tracking-widest">
                        {item.vehicle_type}
                    </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                    <p className="text-sm text-white/60 leading-relaxed italic line-clamp-2">
                        "{item.biggest_pain_point}"
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        <Zap className="w-3 h-3" /> Booking Intent
                    </div>
                    <div className={cn(
                        "text-[10px] font-extrabold uppercase px-3 py-1 rounded-full",
                        item.would_book_via_app.includes("yes") ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/40"
                    )}>
                        {item.would_book_via_app}
                    </div>
                </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <EmptyState />}
      </div>
    </motion.div>
  );
};
