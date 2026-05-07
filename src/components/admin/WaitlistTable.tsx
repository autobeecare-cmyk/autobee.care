"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Search, Calendar, User, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface WaitlistTableProps {
  data: any[];
  search: string;
}

export const WaitlistTable = ({ data, search }: WaitlistTableProps) => {
  const router = useRouter();
  const filtered = (data || []).filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.phone.includes(search)
  );

  const handleRowClick = (id: string) => {
    router.push(`/admin/waitlist/${id}`);
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
              <th className="px-8 py-5">Vehicle Owner</th>
              <th className="px-8 py-5">Contact Info</th>
              <th className="px-8 py-5">Location</th>
              <th className="px-8 py-5 text-right">Joined At</th>
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
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold group-hover:bg-brand-amber transition-all group-hover:text-black">
                      {item.name[0]}
                    </div>
                    <p className="font-bold">{item.name}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Phone className="w-3 h-3 text-brand-amber" /> {item.phone}
                    </div>
                    {item.email && (
                      <div className="flex items-center gap-2 text-xs text-white/30">
                        <Mail className="w-3 h-3" /> {item.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-brand-amber" />
                    <span className="capitalize">{item.area}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right text-xs text-white/20">
                  {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
            className="bg-[#0A0A0A] border-white/5 p-6 rounded-3xl flex flex-col gap-4 active:scale-95 transition-transform"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-amber/10 flex items-center justify-center font-bold text-brand-amber">
                    {item.name[0]}
                </div>
                <div>
                    <h4 className="font-bold text-white">{item.name}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Joined {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                    <p className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">Phone</p>
                    <p className="text-sm text-white/70 flex items-center gap-2"><Phone className="w-3 h-3 text-brand-amber" /> {item.phone}</p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">Area</p>
                    <p className="text-sm text-white/70 flex items-center gap-2 justify-end"><MapPin className="w-3 h-3 text-brand-amber" /> {item.area}</p>
                </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <EmptyState />}
      </div>
    </motion.div>
  );
};

export function EmptyState() {
  return (
    <div className="py-20 text-center space-y-4">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
        <Search className="w-8 h-8 text-white/10" />
      </div>
      <p className="text-white/20 font-medium">No results found matching your criteria</p>
    </div>
  );
}
