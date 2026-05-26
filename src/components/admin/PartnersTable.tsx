"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Store, ShieldCheck, ChevronRight, MapPin, User, Car } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState } from "./WaitlistTable";

interface PartnersTableProps {
  data: any[];
  search: string;
}

export const PartnersTable = ({ data, search }: PartnersTableProps) => {
  const router = useRouter();
  const filtered = (data || []).filter(u => 
    (u.business_name || "").toLowerCase().includes(search.toLowerCase()) || 
    (u.owner_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (id: string) => {
    router.push(`/admin/partners/${id}`);
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
              <th className="px-8 py-5">Center Name</th>
              <th className="px-8 py-5">Owner Info</th>
              <th className="px-8 py-5">Daily Vol</th>
              <th className="px-8 py-5 text-right">Status</th>
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
                    <div className="w-10 h-10 rounded-full bg-brand-amber/20 flex items-center justify-center">
                      <Store className="w-5 h-5 text-brand-amber" />
                    </div>
                    <div>
                      <p className="font-bold">{item.business_name}</p>
                      <p className="text-[10px] text-white/40">{item.address}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-sm font-medium">{item.owner_name}</div>
                  <div className="text-[10px] text-white/40">{item.phone_number}</div>
                </td>
                <td className="px-8 py-6 text-sm">
                  {item.daily_vehicles} cars / day
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end gap-2 text-xs font-bold text-green-500">
                     <ShieldCheck className="w-4 h-4" /> Open to Partnership
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
                <div className="w-12 h-12 bg-brand-amber/10 rounded-2xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-brand-amber" />
                </div>
                <div>
                    <h4 className="font-bold text-white text-lg">{item.business_name}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.address}
                    </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                    <p className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">Owner</p>
                    <p className="text-sm text-white/70 flex items-center gap-2 truncate"><User className="w-3 h-3 text-brand-amber" /> {item.owner_name}</p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">Volume</p>
                    <p className="text-sm text-white/70 flex items-center gap-2 justify-end font-bold"><Car className="w-3 h-3 text-brand-amber" /> {item.daily_vehicles}/day</p>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-green-500 py-2 bg-green-500/5 rounded-xl border border-green-500/10">
                <ShieldCheck className="w-4 h-4" /> Ready to Partner
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <EmptyState />}
      </div>
    </motion.div>
  );
};
