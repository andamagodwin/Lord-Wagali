import { Platform, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ContainerProps {
  children: React.ReactNode;
  keyboard?: boolean;
  className?: string;
}

export function Container({ children, keyboard = false, className = "" }: ContainerProps) {
  const content = (
    <SafeAreaView className={`flex-1 ${className}`}>
      {children}
    </SafeAreaView>
  );

  if (keyboard) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
}
