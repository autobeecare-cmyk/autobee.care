import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <span className={cn("font-outfit font-bold tracking-tight text-xl sm:text-2xl", className)}>
      <span className="text-white">auto</span>
      <span className="text-brand-amber">bee</span>
      <span className="text-white">.care</span>
    </span>
  );
};
