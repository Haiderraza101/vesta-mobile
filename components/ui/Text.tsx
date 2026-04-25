import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { cn } from "../../utils/utils";

type TextVariant = "h1" | "h2" | "h3" | "h4" | "body" | "small" | "caption";
type TextWeight = "normal" | "medium" | "semibold" | "bold";

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  className?: string;
}

const variants = {
  h1: "text-3xl",
  h2: "text-2xl",
  h3: "text-xl",
  h4: "text-lg",
  body: "text-base",
  small: "text-sm",
  caption: "text-xs",
};

const weights = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export function Text({
  variant = "body",
  weight = "normal",
  className,
  ...props
}: TextProps) {
  return (
    <RNText
      className={cn(
        "text-foreground font-poppins",
        variants[variant],
        weights[weight],
        className
      )}
      {...props}
    />
  );
}
