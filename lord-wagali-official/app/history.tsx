import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container } from '@/components/Container';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTips } from '@/context/TipsContext';

export default function History() {
  const router = useRouter();
  const { history, isLoading } = useTips();

  return (
    <Container className="bg-slate-50">
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <View className="mb-8 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 rounded-full border border-slate-200 bg-white p-2.5 shadow-sm">
            <Ionicons name="arrow-back" size={20} color="#001f3f" />
          </TouchableOpacity>
          <Text className="text-3xl font-black uppercase tracking-tight tracking-tighter text-navy-950">
            Match History
          </Text>
        </View>

        {isLoading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#df8d38" />
            <Text className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Accessing Archives...
            </Text>
          </View>
        ) : history.length === 0 ? (
          <View className="items-center justify-center rounded-[44px] border border-slate-200 bg-white p-10 py-16 shadow-md">
            <Ionicons name="time-outline" size={48} color="#cbd5e1" />
            <Text className="mt-4 text-lg font-black uppercase text-navy-950">
              No Settled Results
            </Text>
            <Text className="mt-1 text-center text-xs text-slate-400">
              Settled winning/losing matches will show up here.
            </Text>
          </View>
        ) : (
          history.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push({ pathname: '/analysis/[id]', params: { id: item.id } })}
              className="mb-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {item.date} • {item.league}
                </Text>
                <View
                  className={`${item.status === 'won' ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'} rounded-full border px-3 py-1`}>
                  <Text
                    className={`${item.status === 'won' ? 'text-green-700' : 'text-red-700'} text-[9px] font-black uppercase`}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="mr-2 flex-1">
                  <Text
                    className="text-lg font-black leading-tight text-navy-950"
                    numberOfLines={1}>
                    {item.home}
                  </Text>
                  <Text
                    className="text-lg font-black leading-tight text-navy-950"
                    numberOfLines={1}>
                    {item.away}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs font-black uppercase tracking-tighter text-gold-500">
                    {item.tip}
                  </Text>
                  <Text className="text-[10px] font-bold text-slate-400">Odds {item.odds}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View className="h-10" />
      </ScrollView>
    </Container>
  );
}
