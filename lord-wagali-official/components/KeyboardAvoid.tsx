import { Platform, KeyboardAvoidingView, type KeyboardAvoidingViewProps } from "react-native";

interface KeyboardAvoidProps extends Omit<KeyboardAvoidingViewProps, "behavior"> {
  children: React.ReactNode;
}

export function KeyboardAvoid({ children, style, ...props }: KeyboardAvoidProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={style}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
