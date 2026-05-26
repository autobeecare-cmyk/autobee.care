import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxCardProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  description?: string;
}

export const CheckboxCard = ({ selected, onClick, label, description }: CheckboxCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl px-5 py-4 cursor-pointer transition-all border-2 text-left relative overflow-hidden",
        selected
          ? "bg-brand-amber text-black border-brand-amber shadow-lg shadow-brand-amber/20 scale-[1.02]"
          : "bg-[#0A0A0A] text-white border-[#1A1A1A] hover:border-brand-amber/50"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg pr-6">{label}</div>
        {selected && <Check className="w-5 h-5 text-black flex-shrink-0" />}
      </div>
      {description && <div className={cn("text-sm mt-1", selected ? "text-black/60" : "text-white/40")}>{description}</div>}
    </div>
  );
};
