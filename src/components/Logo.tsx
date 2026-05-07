import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className, width = 32, height = 32 }: LogoProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      <span className="font-outfit font-bold tracking-tight text-xl sm:text-2xl">
        <span className="text-white">auto</span>
        <span className="text-brand-amber">bee</span>
        <span className="text-white">.care</span>
      </span>
    </div>
  );
};
