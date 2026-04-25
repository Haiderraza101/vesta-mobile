import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator, View } from "react-native";
import { Text } from "./Text";
import { cn } from "../../utils/utils";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  textClassName,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    destructive: "bg-destructive",
    outline: "border border-border bg-transparent",
    ghost: "bg-transparent",
  };

  const textVariants = {
    primary: "text-primary-foreground",
    secondary: "text-secondary-foreground",
    destructive: "text-destructive-foreground",
    outline: "text-foreground",
    ghost: "text-primary",
  };

  const sizes = {
    sm: "px-3 py-1.5",
    md: "px-4 py-2.5",
    lg: "px-6 py-4",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || loading}
      className={cn(
        "flex-row items-center justify-center rounded-lg",
        variants[variant],
        sizes[size],
        (disabled || loading) && "opacity-50",
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" || variant === "ghost" ? "#007AFF" : "#FFFFFF"} />
      ) : (
        <Text
          variant="body"
          weight="semibold"
          className={cn(textVariants[variant], textClassName)}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
