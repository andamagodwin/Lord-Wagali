import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { Container } from '@/components/Container';

export default function NotFoundScreen() {
  return (
    <Container className="bg-navy-950">
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center px-8">
        <Text className="mb-4 text-xl font-bold text-white">Page not found</Text>
        <Link href="/">
          <Text className="text-base text-coral">Go to home screen</Text>
        </Link>
      </View>
    </Container>
  );
}
