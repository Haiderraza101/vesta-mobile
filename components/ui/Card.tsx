import { View, ViewProps } from "react-native";
import { cn } from "../../utils/utils";

interface CardProps extends ViewProps {
  className?: string;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "bg-background rounded-2xl p-4 shadow-sm border border-border/50",
        className
      )}
      {...props}
    />
  );
}
