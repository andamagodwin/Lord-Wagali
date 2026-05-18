import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TipsProvider } from '@/context/TipsContext';
import { ToastHost } from '@/components/ToastHost';
import '../global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TipsProvider>
        <ToastHost />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: '#001f3f',
            headerTitleStyle: { fontWeight: 'bold' },
            headerShadowVisible: false,
          }}>
          <Stack.Screen name="index" options={{ title: 'ElitePicks', headerShown: false }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          <Stack.Screen name="history" options={{ title: 'History' }} />
          <Stack.Screen name="vip" options={{ title: 'ElitePicks VIP' }} />
          <Stack.Screen name="admin" options={{ title: 'Admin Portal' }} />
          <Stack.Screen name="manage-free" options={{ title: 'Manage Free Tips' }} />
          <Stack.Screen name="manage-vip-tips" options={{ title: 'Manage VIP Tips' }} />
          <Stack.Screen name="analysis/[id]" options={{ title: 'Analysis' }} />
        </Stack>
      </TipsProvider>
    </GestureHandlerRootView>
  );
}
