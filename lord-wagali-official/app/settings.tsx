import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share, Linking, Switch } from 'react-native';
import { Container } from '@/components/Container';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DOWNLOAD_LINK = "https://www.mediafire.com/folder/lvoiimmjhifd9/AlphaWins";

export default function Settings() {
  const router = useRouter();

  const shareApp = () => Share.share({ 
    message: `Join AlphaWins for daily accurate games! 🏆⚽ Download the app here: ${DOWNLOAD_LINK}` 
  });

  return (
    <Container className="bg-slate-50">
      <ScrollView className="flex-1 px-6 pt-8">
        <Text className="text-4xl font-black mb-10 px-2 tracking-tighter text-navy-950 uppercase">Settings</Text>

        <View className="bg-white p-8 rounded-[44px] mb-6 border border-slate-200 shadow-xl">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-3xl items-center justify-center mr-4 bg-slate-50 border border-slate-100">
                <Ionicons name="notifications" size={24} color="#64748b" />
              </View>
              <View>
                <Text className="font-black text-lg text-navy-950 tracking-tighter uppercase">Push Alerts</Text>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Notifications active</Text>
              </View>
            </View>
            <Switch value={true} onValueChange={() => {}} trackColor={{ false: "#cbd5e1", true: "#16a34a" }} thumbColor="white" />
          </View>
        </View>

        <View className="px-4 mt-8 mb-4">
          <Text className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Support & Community</Text>
        </View>

        <TouchableOpacity 
          onPress={() => Linking.openURL('whatsapp://send?phone=256703354991')}
          className="bg-white p-8 rounded-[44px] mb-6 border border-slate-200 shadow-xl flex-row items-center"
        >
          <View className="w-12 h-12 rounded-3xl bg-green-500/10 items-center justify-center mr-4 border border-green-500/10">
             <FontAwesome name="whatsapp" size={24} color="#22c55e" />
          </View>
          <View className="flex-1">
            <Text className="font-black text-lg text-navy-950 tracking-tighter uppercase">Contact Admin</Text>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Direct Support Line</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={shareApp}
          className="bg-white p-8 rounded-[44px] mb-6 border border-slate-200 shadow-xl flex-row items-center"
        >
          <View className="w-12 h-12 rounded-3xl bg-blue-500/10 items-center justify-center mr-4 border border-blue-500/10">
             <Ionicons name="share-social" size={24} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <Text className="font-black text-lg text-navy-950 tracking-tighter uppercase">Invite Friend</Text>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Share AlphaWins</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </TouchableOpacity>

        <View className="mt-20 items-center opacity-10">
           <Text className="text-[10px] font-black tracking-[5px] text-navy-950 uppercase">
             VERSION 4.2.0
           </Text>
        </View>

        <View className="h-20" />
      </ScrollView>
    </Container>
  );
}
