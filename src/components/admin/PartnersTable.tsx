"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Store, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState } from "./WaitlistTable";

interface PartnersTableProps {
  data: any[];
  search: string;
}

export const PartnersTable = ({ data, search }: PartnersTableProps) => {
  const router = useRouter();
  const filtered = (data || []).filter(u => 
    u.center_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.owner_name?.toLowerCase().includes(search.toLowerCase())
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
      <Card className="bg-[#0A0A0A] border-white/5 overflow-hidden rounded-3xl">
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
                      <p className="font-bold">{item.center_name}</p>
                      <p className="text-[10px] text-white/40">{item.area}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-sm font-medium">{item.owner_name}</div>
                  <div className="text-[10px] text-white/40">{item.phone}</div>
                </td>
                <td className="px-8 py-6 text-sm">
                  {item.cars_per_day} cars / day
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
    </motion.div>
  );
};
