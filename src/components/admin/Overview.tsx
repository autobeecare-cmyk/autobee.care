"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { UserCheck, Users, Store, Zap, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#F5B700", "#FFD700", "#C8C8C8", "#6B6B6B", "#333333"];

interface OverviewProps {
  data: any;
}

export const Overview = ({ data }: OverviewProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatsCard label="Total Waitlist" value={data?.summary?.totalWaitlist} icon={UserCheck} trend="+12% this week" />
        <StatsCard label="Survey Responses" value={data?.summary?.totalOwners} icon={Users} trend="+5% this week" />
        <StatsCard label="Partner Leads" value={data?.summary?.totalPartners} icon={Store} trend="+2 this week" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-[#0A0A0A] border-white/5 p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold font-outfit">Vehicle Type Interest</h3>
            <div className="w-10 h-10 bg-brand-amber/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-amber" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.owners?.vehicleTypes || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {(data?.owners?.vehicleTypes || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {(data?.owners?.vehicleTypes || []).map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm font-medium text-white/60">{entry.name}</span>
                <span className="ml-auto font-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[#0A0A0A] border-white/5 p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold font-outfit">Subscription Willingness</h3>
            <div className="w-10 h-10 bg-brand-amber/10 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand-amber" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.owners?.subscription || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                <XAxis dataKey="name" stroke="#444" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="#444" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                   cursor={{ fill: 'rgba(245,183,0,0.05)' }}
                   contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '16px' }}
                />
                <Bar dataKey="value" fill="#F5B700" radius={[10, 10, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-8 text-center text-sm text-white/40">Market sentiment for recurring car care services</p>
        </Card>
      </div>
    </motion.div>
  );
};

function StatsCard({ label, value, icon: Icon, trend }: { label: string; value: number; icon: any; trend: string }) {
  return (
    <Card className="bg-[#0A0A0A] border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-brand-amber/30 transition-all">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Icon size={120} />
      </div>
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
      <h3 className="text-6xl font-outfit font-extrabold">{value || 0}</h3>
      <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
        <ArrowUpRight className="w-3 h-3" /> {trend}
      </div>
    </Card>
  );
}
