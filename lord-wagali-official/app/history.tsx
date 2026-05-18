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
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 bg-white p-2.5 rounded-full border border-slate-200 shadow-sm">
            <Ionicons name="arrow-back" size={20} color="#001f3f" />
          </TouchableOpacity>
          <Text className="text-3xl font-black tracking-tight text-navy-950 uppercase tracking-tighter">Match History</Text>
        </View>

        {isLoading ? (
          <View className="py-20 justify-center items-center">
            <ActivityIndicator size="large" color="#df8d38" />
            <Text className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-widest">Accessing Archives...</Text>
          </View>
        ) : history.length === 0 ? (
          <View className="bg-white p-10 rounded-[44px] border border-slate-200 shadow-md items-center justify-center py-16">
            <Ionicons name="time-outline" size={48} color="#cbd5e1" />
            <Text className="text-navy-950 font-black text-lg mt-4 uppercase">No Settled Results</Text>
            <Text className="text-slate-400 text-xs mt-1 text-center">Settled winning/losing matches will show up here.</Text>
          </View>
        ) : (
          history.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => router.push({ pathname: "/analysis/[id]", params: { id: item.id } })}
              className="bg-white p-6 rounded-[32px] mb-4 border border-slate-200 shadow-sm"
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.date} • {item.league}</Text>
                <View className={`${item.status === 'won' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} px-3 py-1 rounded-full border`}>
                  <Text className={`${item.status === 'won' ? 'text-green-700' : 'text-red-700'} text-[9px] font-black uppercase`}>{item.status}</Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center">
                <View className="flex-1 mr-2">
                  <Text className="text-lg font-black leading-tight text-navy-950" numberOfLines={1}>{item.home}</Text>
                  <Text className="text-lg font-black leading-tight text-navy-950" numberOfLines={1}>{item.away}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-gold-500 font-black text-xs uppercase tracking-tighter">{item.tip}</Text>
                  <Text className="text-slate-400 text-[10px] font-bold">Odds {item.odds}</Text>
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
