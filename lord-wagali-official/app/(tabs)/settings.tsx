import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share, Linking } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useTips } from '@/context/TipsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DOWNLOAD_LINK, WHATSAPP_NUMBER } from '@/lib/constants';

export default function Settings() {
  const { clientUserId } = useTips();

  const shareApp = () =>
    Share.share({
      message: `Join ElitePicks for daily accurate games! Download the app here: ${DOWNLOAD_LINK}`,
    });

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-[#18152e]">
        <View className="px-5 pb-4 pt-3">
          <Text className="text-lg font-black tracking-tight text-white">Settings</Text>
          <Text className="text-[9px] font-medium uppercase tracking-widest text-slate-400">
            Account & Support
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-5 pt-5">
          {/* Device ID */}
          <View className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <View className="flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-navy-950">
                <Ionicons name="finger-print" size={20} color="#fbbf24" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Device ID
                </Text>
                <Text className="text-base font-bold text-navy-950">{clientUserId}</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <Text className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Support
          </Text>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`whatsapp://send?phone=256${WHATSAPP_NUMBER.slice(1)}`)
            }
            activeOpacity={0.7}
            className="mb-3 flex-row items-center rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <FontAwesome name="whatsapp" size={20} color="#22c55e" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-navy-950">Contact Admin</Text>
              <Text className="text-[10px] text-slate-400">WhatsApp support line</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={shareApp}
            activeOpacity={0.7}
            className="mb-3 flex-row items-center rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Ionicons name="share-social" size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-navy-950">Invite a Friend</Text>
              <Text className="text-[10px] text-slate-400">Share the app</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
          </TouchableOpacity>

          <View className="mt-16 items-center">
            <Text className="text-[9px] font-medium uppercase tracking-widest text-slate-300">
              ElitePicks v5.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
