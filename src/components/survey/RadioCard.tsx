import { cn } from "@/lib/utils";

interface RadioCardProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  description?: string;
}

export const RadioCard = ({ selected, onClick, label, description }: RadioCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl px-5 py-4 cursor-pointer transition-all border-2 text-left",
        selected
          ? "bg-brand-amber text-black border-brand-amber shadow-lg shadow-brand-amber/20 scale-[1.02]"
          : "bg-[#0A0A0A] text-white border-[#1A1A1A] hover:border-brand-amber/50"
      )}
    >
      <div className="font-bold text-lg">{label}</div>
      {description && <div className={cn("text-sm mt-1", selected ? "text-black/60" : "text-white/40")}>{description}</div>}
    </div>
  );
};
