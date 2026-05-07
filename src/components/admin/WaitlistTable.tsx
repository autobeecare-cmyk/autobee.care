"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";

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
      <Card className="bg-[#0A0A0A] border-white/5 overflow-hidden rounded-3xl">
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
