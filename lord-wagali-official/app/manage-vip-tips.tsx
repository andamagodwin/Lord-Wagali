import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTips } from '@/context/TipsContext';

export default function ManageVIPTips() {
  const router = useRouter();
  const { vipTips, addVipTip, removeVipTip, settleTip } = useTips();

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
    Alert.alert('✅ VIP Tip Added', 'Premium lock is now active in the VIP room.');
  };

  const handleSettle = async (id: string, outcome: 'WON' | 'LOST') => {
    const status = outcome.toLowerCase() as 'won' | 'lost';
    await settleTip(id, true, status);
    Alert.alert('✅ VIP Match Settled', `Tip was successfully recorded as a ${outcome}.`);
  };

  return (
    <Container keyboard className="bg-slate-50">
      <ScrollView className="flex-1 px-4 pt-6">
        <View className="mb-6 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 rounded-full border border-slate-200 bg-white p-2.5 shadow-sm">
            <Ionicons name="arrow-back" size={20} color="#001f3f" />
          </TouchableOpacity>
          <Text className="text-3xl font-black uppercase tracking-tighter text-navy-950">
            Edit VIP Tips
          </Text>
        </View>

        {vipTips.length === 0 ? (
          <View className="mb-6 items-center justify-center rounded-[36px] border border-slate-200 bg-white p-8 py-12">
            <Text className="text-center text-xs font-bold uppercase tracking-widest text-slate-400">
              No Active VIP Tips
            </Text>
          </View>
        ) : (
          vipTips.map((item) => (
            <View
              key={item.id}
              className="mb-4 rounded-[36px] border border-slate-200 bg-white p-6 shadow-md">
              <View className="mb-4 flex-row items-start justify-between">
                <View className="mr-2 flex-1">
                  <Text className="text-lg font-black text-navy-950">
                    {item.home} vs {item.away}
                  </Text>
                  <Text className="mt-0.5 text-[10px] font-bold uppercase text-slate-400">
                    {item.league || 'Football'} • {item.time || 'Today'}
                  </Text>
                  <Text className="mt-2 text-xs font-bold uppercase text-gold-500">
                    {item.tip} • Odds {item.odds} • {item.prob || '90%'} Prob
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeVipTip(item.id)}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-2.5">
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-end gap-x-2 border-t border-slate-50 pt-4">
                <TouchableOpacity
                  onPress={() => handleSettle(item.id, 'WON')}
                  className="flex-row items-center rounded-2xl border border-green-100 bg-green-50 px-4 py-2">
                  <Ionicons name="checkmark-circle-outline" size={14} color="#16a34a" />
                  <Text className="ml-1.5 text-[10px] font-black uppercase text-green-700">
                    Settle Won
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSettle(item.id, 'LOST')}
                  className="flex-row items-center rounded-2xl border border-red-100 bg-red-50 px-4 py-2">
                  <Ionicons name="close-circle-outline" size={14} color="#dc2626" />
                  <Text className="ml-1.5 text-[10px] font-black uppercase text-red-700">
                    Settle Lost
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View className="mb-20 mt-4 rounded-[40px] border border-white/5 bg-navy-950 p-8 shadow-xl">
          <Text className="mb-6 text-xl font-black uppercase tracking-tighter text-gold-400">
            Add VIP Tip
          </Text>

          <Text className="mb-1.5 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Teams Info
          </Text>
          <TextInput
            className="mb-4 rounded-2xl border border-white/10 bg-white/10 p-5 font-bold text-white"
            placeholder="Home Team Name"
            placeholderTextColor="#64748b"
            value={form.home}
            onChangeText={(t) => setForm({ ...form, home: t })}
          />
          <TextInput
            className="mb-4 rounded-2xl border border-white/10 bg-white/10 p-5 font-bold text-white"
            placeholder="Away Team Name"
            placeholderTextColor="#64748b"
            value={form.away}
            onChangeText={(t) => setForm({ ...form, away: t })}
          />

          <Text className="mb-1.5 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Badge Image IDs (Optional)
          </Text>
          <View className="mb-4 flex-row gap-x-3">
            <TextInput
              className="flex-1 rounded-2xl border border-white/10 bg-white/10 p-5 text-center font-bold text-white"
              placeholder="Home ID"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={form.homeLogo}
              onChangeText={(t) => setForm({ ...form, homeLogo: t })}
            />
            <TextInput
              className="flex-1 rounded-2xl border border-white/10 bg-white/10 p-5 text-center font-bold text-white"
              placeholder="Away ID"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={form.awayLogo}
              onChangeText={(t) => setForm({ ...form, awayLogo: t })}
            />
          </View>

          <Text className="mb-1.5 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Match Details
          </Text>
          <TextInput
            className="mb-4 rounded-2xl border border-white/10 bg-white/10 p-5 font-bold text-white"
            placeholder="League (e.g. Champions League)"
            placeholderTextColor="#64748b"
            value={form.league}
            onChangeText={(t) => setForm({ ...form, league: t })}
          />
          <TextInput
            className="mb-4 rounded-2xl border border-white/10 bg-white/10 p-5 font-bold text-white"
            placeholder="Time (e.g. 21:00)"
            placeholderTextColor="#64748b"
            value={form.time}
            onChangeText={(t) => setForm({ ...form, time: t })}
          />

          <Text className="mb-1.5 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Prediction details
          </Text>
          <TextInput
            className="mb-4 rounded-2xl border border-white/10 bg-white/10 p-5 font-bold text-white"
            placeholder="Tip (e.g. CS 2-0 or Home Win)"
            placeholderTextColor="#64748b"
            value={form.tip}
            onChangeText={(t) => setForm({ ...form, tip: t })}
          />
          <View className="mb-6 flex-row gap-x-3">
            <TextInput
              className="flex-1 rounded-2xl border border-white/10 bg-white/10 p-5 text-center font-bold text-white"
              placeholder="Odds (e.g. 2.10)"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={form.odds}
              onChangeText={(t) => setForm({ ...form, odds: t })}
            />
            <TextInput
              className="flex-1 rounded-2xl border border-white/10 bg-white/10 p-5 text-center font-bold text-white"
              placeholder="Prob % (e.g. 95%)"
              placeholderTextColor="#64748b"
              value={form.prob}
              onChangeText={(t) => setForm({ ...form, prob: t })}
            />
          </View>

          <Button title="PUBLISH VIP TIP" variant="primary" onPress={addTip} />
        </View>
      </ScrollView>
    </Container>
  );
}
