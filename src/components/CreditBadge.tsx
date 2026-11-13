import { Leaf } from "lucide-react";

export function CreditBadge({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-sm px-2.5 py-1 gap-1",
    md: "text-base px-3 py-1.5 gap-1.5",
    lg: "text-2xl px-4 py-2 gap-2",
  };
  const icon = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-6 h-6" };
  return (
    <span className={`inline-flex items-center font-semibold rounded-full bg-primary/10 text-primary ${sizes[size]}`}>
      <Leaf className={icon[size]} />
      {value}
    </span>
  );
}
