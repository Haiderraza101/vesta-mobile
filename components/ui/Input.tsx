import { TextInput, TextInputProps, View } from "react-native";
import { Text } from "./Text";
import { cn } from "../../utils/utils";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  className,
  containerClassName,
  ...props
}: InputProps) {
  return (
    <View className={cn("flex-col gap-1.5 w-full", containerClassName)}>
      {label && (
        <Text variant="small" weight="medium" className="text-muted-foreground ml-1">
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor="#8E8E93"
        className={cn(
          "h-12 w-full px-4 rounded-lg bg-secondary/50 border border-border text-foreground",
          error && "border-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <Text variant="small" className="text-destructive ml-1">
          {error}
        </Text>
      )}
    </View>
  );
}
