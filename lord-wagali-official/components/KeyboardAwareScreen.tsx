import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  type ScrollViewProps,
  type RefreshControlProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useKeyboardAwareLayout } from '@/hooks/useKeyboardAwareLayout';

interface KeyboardAwareScreenProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  extraBottomPadding?: number;
  extraTopOffset?: number;
  scrollProps?: Partial<ScrollViewProps>;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export function KeyboardAwareScreen({
  children,
  className = 'bg-slate-50',
  contentClassName = '',
  extraBottomPadding = 40,
  extraTopOffset = 0,
  scrollProps,
  refreshControl,
}: KeyboardAwareScreenProps) {
  const { contentBottomPadding, keyboardVerticalOffset, dismissKeyboard } = useKeyboardAwareLayout(
    extraBottomPadding,
    extraTopOffset
  );

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
        <SafeAreaView className={`flex-1 ${className}`}>
          <LinearGradient
            colors={['rgba(15, 23, 42, 0.06)', 'rgba(251, 191, 36, 0.04)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: contentBottomPadding, flexGrow: 1 }}
            refreshControl={refreshControl}
            {...scrollProps}>
            <View className={`flex-1 ${contentClassName}`}>{children}</View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
