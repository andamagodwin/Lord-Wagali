import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Button } from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTips } from '@/context/TipsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { TeamBadgePicker } from '@/components/TeamBadgePicker';
import { getTeamLogo } from './(tabs)/index';

export default function ManageVIPTips() {
  const router = useRouter();
  const { vipTips, addVipTip, removeVipTip, settleTip } = useTips();
  const [pickerTarget, setPickerTarget] = useState<'home' | 'away' | null>(null);

  const [form, setForm] = useState({
    home: '',
    away: '',
    homeLogo: '',
    awayLogo: '',
    tip: '',
    odds: '',
    prob: '',
    league: '',
    time: '',
  });

  const addTip = async () => {
    if (!form.home || !form.away || !form.tip || !form.odds) {
      Alert.alert('Missing Fields', 'Please fill in Home, Away, Tip, and Odds.');
      return;
    }

    const newTip = {
      id: `vip-${Date.now()}`,
      home: form.home.trim(),
      away: form.away.trim(),
      homeLogo: form.homeLogo.trim() || '0',
      awayLogo: form.awayLogo.trim() || '0',
      tip: form.tip.trim(),
      odds: form.odds.trim(),
      prob: form.prob.trim() || '90%',
      league: form.league.trim() || 'Football',
      time: form.time.trim() || 'Today',
    };

    try {
      await addVipTip(newTip);
      setForm({
        home: '',
        away: '',
        homeLogo: '',
        awayLogo: '',
        tip: '',
        odds: '',
        prob: '',
        league: '',
        time: '',
      });
    } catch {
      return;
    }
  };

  const handleSettle = (id: string, outcome: 'WON' | 'LOST') => {
    Alert.alert(`Settle as ${outcome}?`, 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: outcome,
        style: outcome === 'LOST' ? 'destructive' : 'default',
        onPress: async () => {
          const status = outcome.toLowerCase() as 'won' | 'lost';
          try {
            await settleTip(id, true, status);
          } catch {
            return;
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-[#18152e]">
        <View className="flex-row items-center px-5 pb-4 pt-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-black tracking-tight text-white">Manage VIP Tips</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled">
        <View className="px-5 pt-5">
          {/* Active VIP Tips */}
          {vipTips.length === 0 ? (
            <View className="mb-5 items-center rounded-2xl border border-slate-100 bg-white p-8">
              <Text className="text-xs font-medium text-slate-400">No active VIP tips</Text>
            </View>
          ) : (
            vipTips.map((item) => (
              <View
                key={item.id}
                className="mb-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <View className="mb-3 flex-row items-start justify-between">
                  <View className="mr-3 flex-1">
                    <Text className="text-sm font-bold text-navy-950">
                      {item.home} vs {item.away}
                    </Text>
                    <Text className="mt-0.5 text-[10px] text-slate-400">
                      {item.league} • {item.time} • {item.tip} @{item.odds}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeVipTip(item.id)}
                    className="rounded-lg bg-red-50 p-2">
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row gap-x-2 border-t border-slate-50 pt-3">
                  <TouchableOpacity
                    onPress={() => handleSettle(item.id, 'WON')}
                    className="flex-row items-center rounded-lg bg-green-50 px-3 py-2">
                    <Ionicons name="checkmark" size={14} color="#16a34a" />
                    <Text className="ml-1 text-[10px] font-bold text-green-700">Won</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSettle(item.id, 'LOST')}
                    className="flex-row items-center rounded-lg bg-red-50 px-3 py-2">
                    <Ionicons name="close" size={14} color="#dc2626" />
                    <Text className="ml-1 text-[10px] font-bold text-red-600">Lost</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {/* Add VIP Tip Form */}
          <View className="mt-4 rounded-2xl border border-gold-200 bg-white p-5 shadow-sm">
            <Text className="mb-4 text-base font-bold text-navy-950">Add VIP Tip</Text>

            <Text className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Home Team
            </Text>
            <View className="mb-3 flex-row items-center gap-x-2">
              <TextInput
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-navy-950"
                placeholder="Team name"
                placeholderTextColor="#94a3b8"
                value={form.home}
                onChangeText={(t) => setForm({ ...form, home: t })}
              />
              <TouchableOpacity
                onPress={() => setPickerTarget('home')}
                className="h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                {form.homeLogo && form.homeLogo !== '0' ? (
                  <Image
                    source={{ uri: getTeamLogo(form.homeLogo) }}
                    style={{ width: 28, height: 28 }}
                    contentFit="contain"
                  />
                ) : (
                  <Ionicons name="image-outline" size={20} color="#94a3b8" />
                )}
              </TouchableOpacity>
            </View>

            <Text className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Away Team
            </Text>
            <View className="mb-3 flex-row items-center gap-x-2">
              <TextInput
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-navy-950"
                placeholder="Team name"
                placeholderTextColor="#94a3b8"
                value={form.away}
                onChangeText={(t) => setForm({ ...form, away: t })}
              />
              <TouchableOpacity
                onPress={() => setPickerTarget('away')}
                className="h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                {form.awayLogo && form.awayLogo !== '0' ? (
                  <Image
                    source={{ uri: getTeamLogo(form.awayLogo) }}
                    style={{ width: 28, height: 28 }}
                    contentFit="contain"
                  />
                ) : (
                  <Ionicons name="image-outline" size={20} color="#94a3b8" />
                )}
              </TouchableOpacity>
            </View>

            <Text className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Match Info
            </Text>
            <View className="mb-3 flex-row gap-x-2">
              <TextInput
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-navy-950"
                placeholder="League"
                placeholderTextColor="#94a3b8"
                value={form.league}
                onChangeText={(t) => setForm({ ...form, league: t })}
              />
              <TextInput
                className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-navy-950"
                placeholder="Time"
                placeholderTextColor="#94a3b8"
                value={form.time}
                onChangeText={(t) => setForm({ ...form, time: t })}
              />
            </View>

            <Text className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Prediction
            </Text>
            <TextInput
              className="mb-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-navy-950"
              placeholder="Tip (e.g. CS 2-0, Home Win)"
              placeholderTextColor="#94a3b8"
              value={form.tip}
              onChangeText={(t) => setForm({ ...form, tip: t })}
            />
            <View className="mb-5 flex-row gap-x-2">
              <TextInput
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-navy-950"
                placeholder="Odds"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={form.odds}
                onChangeText={(t) => setForm({ ...form, odds: t })}
              />
              <TextInput
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-navy-950"
                placeholder="Prob %"
                placeholderTextColor="#94a3b8"
                value={form.prob}
                onChangeText={(t) => setForm({ ...form, prob: t })}
              />
            </View>

            <Button title="PUBLISH VIP TIP" variant="primary" onPress={addTip} />
          </View>
        </View>
      </ScrollView>

      <TeamBadgePicker
        visible={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        onSelect={(team) => {
          if (pickerTarget === 'home') {
            setForm({ ...form, homeLogo: team.id, home: form.home || team.name });
          } else {
            setForm({ ...form, awayLogo: team.id, away: form.away || team.name });
          }
        }}
      />
    </View>
  );
}
