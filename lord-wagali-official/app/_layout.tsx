import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TipsProvider } from '@/context/TipsContext';
import { ToastHost } from '@/components/ToastHost';
import { useUpdateChecker } from '@/hooks/useUpdateChecker';
import '../global.css';

export default function RootLayout() {
  useUpdateChecker();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TipsProvider>
        <ToastHost />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#f8fafc' },
          }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="admin" />
          <Stack.Screen name="manage-free" />
          <Stack.Screen name="manage-vip-tips" />
          <Stack.Screen name="analysis/[id]" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </TipsProvider>
    </GestureHandlerRootView>
  );
}
