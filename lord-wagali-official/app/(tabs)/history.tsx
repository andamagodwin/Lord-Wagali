import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTips } from '@/context/TipsContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function History() {
  const router = useRouter();
  const { history, isLoading, hydrate } = useTips();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await hydrate();
    setRefreshing(false);
  }, [hydrate]);

  const wins = history.filter((h) => h.status === 'won').length;
  const losses = history.filter((h) => h.status === 'lost').length;
  const total = history.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-[#18152e]">
        <View className="px-5 pb-4 pt-3">
          <Text className="text-lg font-black tracking-tight text-white">Results</Text>
          <Text className="text-[9px] font-medium uppercase tracking-widest text-slate-400">
            Match History
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fbbf24"
            colors={['#fbbf24']}
          />
        }>
        <View className="px-5 pt-5">
          {/* Win Rate Stats */}
          {total > 0 && (
            <View className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-xs font-bold text-navy-950">Accuracy Rate</Text>
                <Text className="text-xl font-black text-gold-500">{winRate}%</Text>
              </View>
              <View className="mb-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <View
                  style={{ width: `${winRate}%` }}
                  className="h-full rounded-full bg-green-500"
                />
              </View>
              <View className="flex-row justify-between">
                <Text className="text-[10px] font-semibold text-green-600">{wins} Won</Text>
                <Text className="text-[10px] font-semibold text-red-500">{losses} Lost</Text>
                <Text className="text-[10px] font-semibold text-slate-400">{total} Total</Text>
              </View>
            </View>
          )}

          {isLoading && !refreshing ? (
            <View className="items-center justify-center py-16">
              <ActivityIndicator size="large" color="#18152e" />
              <Text className="mt-3 text-xs font-medium text-slate-400">Loading history...</Text>
            </View>
          ) : history.length === 0 ? (
            <View className="items-center justify-center rounded-2xl border border-slate-100 bg-white p-10 shadow-sm">
              <Ionicons name="time-outline" size={40} color="#cbd5e1" />
              <Text className="mt-4 text-base font-bold text-navy-950">No Results Yet</Text>
              <Text className="mt-1 text-center text-xs text-slate-400">
                Settled matches will appear here.
              </Text>
            </View>
          ) : (
            history.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({ pathname: '/analysis/[id]', params: { id: item.id } })
                }
                className="mb-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {item.date} • {item.league}
                  </Text>
                  <View
                    className={`rounded-md px-2 py-0.5 ${item.status === 'won' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <Text
                      className={`text-[9px] font-bold uppercase ${item.status === 'won' ? 'text-green-700' : 'text-red-600'}`}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="mr-3 flex-1">
                    <Text className="text-sm font-bold text-navy-950" numberOfLines={1}>
                      {item.home} vs {item.away}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs font-bold text-gold-500">{item.tip}</Text>
                    <Text className="text-[10px] text-slate-400">@{item.odds}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
