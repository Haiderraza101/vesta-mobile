import "lucide-react-native";
import { ReactNode } from "react";
import { SvgProps } from "react-native-svg";

declare module "lucide-react-native" {
  export interface LucideProps extends SvgProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    children?: ReactNode;
  }
}
