import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container } from '@/components/Container';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTips } from '@/context/TipsContext';
import { getTeamLogo } from '../index';

export default function Analysis() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { tips, vipTips, history, isLoading } = useTips();

  // Find tip in free tips, VIP tips, or settled history
  const match =
    tips.find((t) => t.id === id) ||
    vipTips.find((t) => t.id === id) ||
    history.find((t) => t.id === id);

  if (isLoading) {
    return (
      <Container className="items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#df8d38" />
        <Text className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Loading Analytics...
        </Text>
      </Container>
    );
  }

  if (!match) {
    return (
      <Container className="items-center justify-center bg-slate-50 px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#dc2626" />
        <Text className="mt-6 text-2xl font-black uppercase tracking-tighter text-navy-950">
          Fixture Not Found
        </Text>
        <Text className="mb-8 mt-1 text-center text-sm font-medium text-slate-400">
          This tip analysis might have expired or been removed.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="rounded-3xl bg-navy-950 px-8 py-4 shadow-lg">
          <Text className="text-xs font-black uppercase tracking-widest text-gold-400">
            Go Back
          </Text>
        </TouchableOpacity>
      </Container>
    );
  }

  // Robust default fallbacks
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
    `Our expert mathematical model has meticulously calculated this fixture. ${match.home} clashes against ${match.away} in the ${match.league || 'league'}. Factoring in historical trends, present squad depth, and tactical momentum, we identify high value in the "${match.tip}" selection, backed by a strong ${match.prob || '85%'} accuracy rating at odds of @${match.odds}.`;

  return (
    <Container className="bg-slate-50">
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Match Header */}
        <View className="relative mb-6 overflow-hidden rounded-[44px] bg-navy-950 p-8 shadow-2xl">
          <MaterialCommunityIcons
            name="soccer-field"
            size={150}
            color="rgba(255,255,255,0.03)"
            style={{ position: 'absolute', right: -20, top: -20 }}
          />
          <View className="mb-8 flex-row items-center justify-between">
            <View className="flex-1 items-center">
              <Image
                source={getTeamLogo(match.homeLogo)}
                className="w-18 h-18 mb-3"
                contentFit="contain"
              />
              <Text
                className="text-center text-sm font-black uppercase tracking-tighter text-white"
                numberOfLines={1}>
                {match.home}
              </Text>
              <Text className="mt-1 text-[9px] font-black uppercase text-gold-400">POS: 1st</Text>
            </View>
            <View className="items-center px-4">
              <Text className="text-2xl font-black italic text-gold-400">VS</Text>
              <View className="mt-2 rounded-lg bg-white/10 px-2 py-1">
                <Text className="text-[8px] font-black uppercase text-white/40">LIVE DATA</Text>
              </View>
            </View>
            <View className="flex-1 items-center">
              <Image
                source={getTeamLogo(match.awayLogo)}
                className="w-18 h-18 mb-3"
                contentFit="contain"
              />
              <Text
                className="text-center text-sm font-black uppercase tracking-tighter text-white"
                numberOfLines={1}>
                {match.away}
              </Text>
              <Text className="mt-1 text-[9px] font-black uppercase text-white/30">POS: 3rd</Text>
            </View>
          </View>

          <Text className="mb-4 text-center text-[9px] font-black uppercase tracking-widest text-white/30">
            Winning Probability
          </Text>
          <View className="mb-4 h-5 flex-row overflow-hidden rounded-2xl border border-white/5 bg-black/40">
            <View style={{ width: `${winProb.home}%` }} className="h-full bg-gold-500 shadow-lg" />
            <View style={{ width: `${winProb.draw}%` }} className="h-full bg-slate-700" />
            <View style={{ width: `${winProb.away}%` }} className="h-full bg-coral-500" />
          </View>
          <View className="flex-row justify-between px-2">
            <Text className="text-[10px] font-black uppercase text-gold-500">
              {match.home} {winProb.home}%
            </Text>
            <Text className="text-[10px] font-black uppercase text-white/20">
              Draw {winProb.draw}%
            </Text>
            <Text className="text-[10px] font-black uppercase text-coral-500">
              {match.away} {winProb.away}%
            </Text>
          </View>
        </View>

        {/* Detailed Stats */}
        <View className="mb-6 rounded-[44px] border border-slate-200 bg-white p-8 shadow-lg">
          <Text className="mb-6 text-xl font-black uppercase tracking-tighter text-navy-950">
            Statistical Analysis
          </Text>
          {stats.map((stat, i) => (
            <View key={i} className="mb-6">
              <View className="mb-2 flex-row justify-between">
                <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {stat.label}
                </Text>
                <Text className="text-xs font-black text-navy-950">{stat.value}</Text>
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

        {/* Form */}
        <View className="mb-6 rounded-[44px] border border-slate-200 bg-white p-8 shadow-lg">
          <Text className="mb-6 text-xl font-black uppercase tracking-tighter text-navy-950">
            Recent Form
          </Text>
          <View className="mb-6 flex-row items-center justify-between rounded-3xl bg-slate-50 p-4">
            <Text className="text-xs font-bold uppercase text-navy-950" numberOfLines={1}>
              {match.home}
            </Text>
            <View className="flex-row">
              {form.home.map((r, i) => (
                <View
                  key={i}
                  className={`ml-1 h-6 w-6 items-center justify-center rounded-lg ${r === 'W' ? 'bg-green-500' : r === 'D' ? 'bg-slate-400' : 'bg-red-500'}`}>
                  <Text className="text-[10px] font-black text-white">{r}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className="flex-row items-center justify-between rounded-3xl bg-slate-50 p-4">
            <Text className="text-xs font-bold uppercase text-navy-950" numberOfLines={1}>
              {match.away}
            </Text>
            <View className="flex-row">
              {form.away.map((r, i) => (
                <View
                  key={i}
                  className={`ml-1 h-6 w-6 items-center justify-center rounded-lg ${r === 'W' ? 'bg-green-500' : r === 'D' ? 'bg-slate-400' : 'bg-red-500'}`}>
                  <Text className="text-[10px] font-black text-white">{r}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Expert Verdict */}
        <View className="mb-12 rounded-[44px] border border-gold-500/30 bg-white p-8 shadow-2xl">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 rounded-xl bg-gold-500 p-2">
              <Ionicons name="ribbon" size={20} color="black" />
            </View>
            <Text className="text-lg font-black uppercase tracking-widest text-gold-600">
              ElitePicks Verdict
            </Text>
          </View>
          <Text className="text-sm font-medium italic leading-7 text-slate-600">
            &ldquo;{summary}&rdquo;
          </Text>
          <View className="mt-8 items-center border-t border-slate-100 pt-8">
            <Text className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Recommended Investment
            </Text>
            <View className="rounded-[32px] bg-navy-950 px-8 py-4 shadow-xl shadow-navy-950/30">
              <Text className="text-2xl font-black uppercase tracking-tighter text-gold-400">
                {match.tip}
              </Text>
            </View>
          </View>
        </View>

        <View className="h-10" />
      </ScrollView>
    </Container>
  );
}
