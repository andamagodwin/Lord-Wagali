import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { Container } from "@/components/Container";

export default function NotFoundScreen() {
  return (
    <Container className="bg-navy-950">
      <Stack.Screen options={{ title: "Not Found" }} />
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-white text-xl font-bold mb-4">Page not found</Text>
        <Link href="/">
          <Text className="text-coral text-base">Go to home screen</Text>
        </Link>
      </View>
    </Container>
  );
}
