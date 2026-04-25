import { Text as RNText, TextProps } from "react-native";
import { cn } from "../../utils/utils";

interface CustomTextProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "small";
  weight?: "normal" | "medium" | "semibold" | "bold";
  className?: string;
}

export function Text({
  variant = "body",
  weight = "normal",
  className,
  ...props
}: CustomTextProps) {
  const variants = {
    h1: "text-3xl",
    h2: "text-2xl",
    h3: "text-xl",
    body: "text-base",
    caption: "text-sm",
    small: "text-xs",
  };

  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  return (
    <RNText
      className={cn(variants[variant], weights[weight], "text-foreground", className)}
      {...props}
    />
  );
}
