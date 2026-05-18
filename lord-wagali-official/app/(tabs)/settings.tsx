import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share, Linking } from 'react-native';
import { Container } from '@/components/Container';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useTips } from '@/context/TipsContext';
import { DOWNLOAD_LINK, WHATSAPP_NUMBER } from '@/lib/constants';

export default function Settings() {
  const { clientUserId } = useTips();

  const shareApp = () =>
    Share.share({
      message: `Join ElitePicks for daily accurate games! Download the app here: ${DOWNLOAD_LINK}`,
    });

  return (
    <Container className="bg-slate-50">
      <ScrollView className="flex-1 px-6 pt-8">
        <Text className="mb-10 px-2 text-4xl font-black uppercase tracking-tighter text-navy-950">
          Settings
        </Text>

        {/* User Info */}
        <View className="mb-6 rounded-[44px] border border-slate-200 bg-white p-8 shadow-xl">
          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-3xl border border-slate-100 bg-navy-950">
              <Ionicons name="person" size={24} color="#fbbf24" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-black uppercase tracking-tighter text-navy-950">
                Device ID
              </Text>
              <Text className="text-sm font-bold text-gold-500">{clientUserId}</Text>
            </View>
          </View>
        </View>

        <View className="mb-4 mt-8 px-4">
          <Text className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
            Support & Community
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(`whatsapp://send?phone=256${WHATSAPP_NUMBER.slice(1)}`)
          }
          className="mb-6 flex-row items-center rounded-[44px] border border-slate-200 bg-white p-8 shadow-xl">
          <View className="mr-4 h-12 w-12 items-center justify-center rounded-3xl border border-green-500/10 bg-green-500/10">
            <FontAwesome name="whatsapp" size={24} color="#22c55e" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-black uppercase tracking-tighter text-navy-950">
              Contact Admin
            </Text>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Direct Support Line
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={shareApp}
          className="mb-6 flex-row items-center rounded-[44px] border border-slate-200 bg-white p-8 shadow-xl">
          <View className="mr-4 h-12 w-12 items-center justify-center rounded-3xl border border-blue-500/10 bg-blue-500/10">
            <Ionicons name="share-social" size={24} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-black uppercase tracking-tighter text-navy-950">
              Invite Friend
            </Text>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Share ElitePicks
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </TouchableOpacity>

        <View className="mt-20 items-center opacity-10">
          <Text className="text-[10px] font-black uppercase tracking-[5px] text-navy-950">
            VERSION 5.0.0
          </Text>
        </View>

        <View className="h-20" />
      </ScrollView>
    </Container>
  );
}
