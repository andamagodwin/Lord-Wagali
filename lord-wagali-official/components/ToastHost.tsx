import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useToastStore } from '@/stores/useToastStore';

export function ToastHost() {
  const toast = useToastStore();
  const translateY = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: toast.visible ? 0 : -20,
        useNativeDriver: true,
        damping: 18,
        stiffness: 180,
      }),
      Animated.timing(opacity, {
        toValue: toast.visible ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, toast.visible, translateY]);

  if (!toast.visible) {
    return null;
  }

  const gradientColors =
    toast.variant === 'success'
      ? ['#0f766e', '#134e4a']
      : toast.variant === 'error'
        ? ['#b91c1c', '#7f1d1d']
        : ['#0f172a', '#1e293b'];

  const iconName: keyof typeof Ionicons.glyphMap =
    toast.variant === 'success'
      ? 'checkmark-circle'
      : toast.variant === 'error'
        ? 'alert-circle'
        : 'information-circle';

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 z-50 px-4"
      style={{ top: 16 }}>
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <Pressable onPress={() => useToastStore.getState().hideToast()}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 14,
              shadowColor: '#000',
              shadowOpacity: 0.18,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 10 },
              elevation: 12,
            }}>
            <View className="flex-row items-start gap-x-3">
              <View className="mt-0.5 rounded-full bg-white/15 p-2">
                <Ionicons name={iconName} size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-black uppercase tracking-wide text-white">
                  {toast.title}
                </Text>
                <Text className="mt-1 text-[12px] leading-5 text-white/85">{toast.message}</Text>
              </View>
              <Ionicons name="close" size={18} color="#fff" style={{ marginTop: 4 }} />
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}
