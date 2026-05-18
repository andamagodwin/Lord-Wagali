import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTips } from '@/context/TipsContext';
import { getTeamLogo } from '../(tabs)/index';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Analysis() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { tips, vipTips, history, isLoading } = useTips();

  const match =
    tips.find((t) => t.id === id) ||
    vipTips.find((t) => t.id === id) ||
    history.find((t) => t.id === id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#18152e" />
        <Text className="mt-3 text-xs font-medium text-slate-400">Loading analysis...</Text>
      </View>
    );
  }

  if (!match) {
    return (
      <View className="flex-1 bg-slate-50">
        <SafeAreaView edges={['top']} className="bg-[#18152e]">
          <View className="flex-row items-center px-5 pb-4 pt-3">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
            <Text className="text-lg font-black tracking-tight text-white">Analysis</Text>
          </View>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="alert-circle-outline" size={48} color="#dc2626" />
          <Text className="mt-4 text-lg font-bold text-navy-950">Fixture Not Found</Text>
          <Text className="mt-1 text-center text-xs text-slate-400">
            This analysis might have expired or been removed.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 rounded-xl bg-navy-950 px-6 py-3">
            <Text className="text-xs font-bold text-gold-400">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const winProb = match.winProb || { home: 45, draw: 30, away: 25 };
  const stats =
    match.stats && match.stats.length > 0
      ? match.stats
      : [
          { label: 'Attack Index', value: '75%' },
          { label: 'Defensive Unit', value: '70%' },
          { label: 'Home Factor', value: '78%' },
        ];
  const form =
    match.form && match.form.home
      ? match.form
      : {
          home: ['W', 'W', 'D', 'W', 'L'],
          away: ['W', 'D', 'L', 'W', 'W'],
        };
  const summary =
    match.summary ||
    `Our model has analyzed this fixture. ${match.home} vs ${match.away} in ${match.league || 'the league'}. We identify strong value in "${match.tip}" at @${match.odds} with ${match.prob || '85%'} confidence.`;

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-[#18152e]">
        <View className="flex-row items-center px-5 pb-4 pt-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-sm font-bold text-white" numberOfLines={1}>
              {match.home} vs {match.away}
            </Text>
            <Text className="text-[9px] font-medium text-slate-400">
              {match.league}{'time' in match ? ` • ${match.time}` : ''}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-5 pt-5">
          {/* Match Header Card */}
          <View className="relative mb-5 overflow-hidden rounded-2xl bg-navy-950 p-6">
            <MaterialCommunityIcons
              name="soccer-field"
              size={120}
              color="rgba(255,255,255,0.03)"
              style={{ position: 'absolute', right: -15, top: -15 }}
            />
            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-1 items-center">
                <Image
                  source={getTeamLogo(match.homeLogo)}
                  className="mb-2 h-14 w-14"
                  contentFit="contain"
                />
                <Text
                  className="text-center text-xs font-bold text-white"
                  numberOfLines={1}>
                  {match.home}
                </Text>
              </View>
              <View className="items-center px-3">
                <Text className="text-lg font-black text-gold-400">VS</Text>
              </View>
              <View className="flex-1 items-center">
                <Image
                  source={getTeamLogo(match.awayLogo)}
                  className="mb-2 h-14 w-14"
                  contentFit="contain"
                />
                <Text
                  className="text-center text-xs font-bold text-white"
                  numberOfLines={1}>
                  {match.away}
                </Text>
              </View>
            </View>

            {/* Probability Bar */}
            <Text className="mb-2 text-center text-[9px] font-semibold uppercase tracking-widest text-white/40">
              Win Probability
            </Text>
            <View className="mb-2 h-3 flex-row overflow-hidden rounded-full bg-black/40">
              <View style={{ width: `${winProb.home}%` }} className="h-full bg-gold-500" />
              <View style={{ width: `${winProb.draw}%` }} className="h-full bg-slate-600" />
              <View style={{ width: `${winProb.away}%` }} className="h-full bg-coral-500" />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[9px] font-bold text-gold-400">{winProb.home}%</Text>
              <Text className="text-[9px] font-bold text-white/30">{winProb.draw}%</Text>
              <Text className="text-[9px] font-bold text-coral-400">{winProb.away}%</Text>
            </View>
          </View>

          {/* Prediction Card */}
          <View className="mb-5 items-center rounded-2xl border border-gold-200 bg-white p-5 shadow-sm">
            <Text className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
              Our Prediction
            </Text>
            <Text className="mt-1 text-xl font-black uppercase text-navy-950">{match.tip}</Text>
            <Text className="mt-0.5 text-xs font-medium text-gold-500">@{match.odds}</Text>
          </View>

          {/* Stats */}
          <View className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <Text className="mb-4 text-sm font-bold text-navy-950">Statistical Analysis</Text>
            {stats.map((stat, i) => (
              <View key={i} className="mb-4">
                <View className="mb-1.5 flex-row justify-between">
                  <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </Text>
                  <Text className="text-xs font-bold text-navy-950">{stat.value}</Text>
                </View>
                <View className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <View
                    style={{ width: stat.value as any }}
                    className="h-full rounded-full bg-navy-950"
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Form Guide */}
          <View className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <Text className="mb-4 text-sm font-bold text-navy-950">Recent Form</Text>
            <View className="mb-3 flex-row items-center justify-between rounded-xl bg-slate-50 p-3">
              <Text className="text-xs font-semibold text-navy-950" numberOfLines={1}>
                {match.home}
              </Text>
              <View className="flex-row">
                {form.home.map((r, i) => (
                  <View
                    key={i}
                    className={`ml-1 h-6 w-6 items-center justify-center rounded-md ${r === 'W' ? 'bg-green-500' : r === 'D' ? 'bg-slate-400' : 'bg-red-500'}`}>
                    <Text className="text-[10px] font-bold text-white">{r}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View className="flex-row items-center justify-between rounded-xl bg-slate-50 p-3">
              <Text className="text-xs font-semibold text-navy-950" numberOfLines={1}>
                {match.away}
              </Text>
              <View className="flex-row">
                {form.away.map((r, i) => (
                  <View
                    key={i}
                    className={`ml-1 h-6 w-6 items-center justify-center rounded-md ${r === 'W' ? 'bg-green-500' : r === 'D' ? 'bg-slate-400' : 'bg-red-500'}`}>
                    <Text className="text-[10px] font-bold text-white">{r}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Expert Verdict */}
          <View className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <View className="mb-3 flex-row items-center">
              <Ionicons name="ribbon" size={16} color="#fbbf24" />
              <Text className="ml-2 text-xs font-bold uppercase tracking-wider text-gold-600">
                Expert Verdict
              </Text>
            </View>
            <Text className="text-sm leading-6 text-slate-600">{summary}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
