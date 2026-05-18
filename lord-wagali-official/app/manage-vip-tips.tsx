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
    time: ''
  });

  const addTip = async () => {
    if (!form.home || !form.away || !form.tip || !form.odds) {
      Alert.alert("Missing Fields", "Please fill in Home, Away, Tip, and Odds.");
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
      time: form.time.trim() || 'Today'
    };

    await addVipTip(newTip);
    setForm({ home: '', away: '', homeLogo: '', awayLogo: '', tip: '', odds: '', prob: '', league: '', time: '' });
    Alert.alert("✅ VIP Tip Added", "Premium lock is now active in the VIP room.");
  };

  const handleSettle = async (id: string, outcome: 'WON' | 'LOST') => {
    const status = outcome.toLowerCase() as 'won' | 'lost';
    await settleTip(id, true, status);
    Alert.alert("✅ VIP Match Settled", `Tip was successfully recorded as a ${outcome}.`);
  };

  return (
    <Container keyboard className="bg-slate-50">
      <ScrollView className="flex-1 px-4 pt-6">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 bg-white p-2.5 rounded-full border border-slate-200 shadow-sm">
            <Ionicons name="arrow-back" size={20} color="#001f3f" />
          </TouchableOpacity>
          <Text className="text-3xl font-black text-navy-950 uppercase tracking-tighter">Edit VIP Tips</Text>
        </View>
        
        {vipTips.length === 0 ? (
          <View className="bg-white p-8 rounded-[36px] border border-slate-200 items-center justify-center py-12 mb-6">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center">No Active VIP Tips</Text>
          </View>
        ) : (
          vipTips.map((item) => (
            <View key={item.id} className="bg-white p-6 rounded-[36px] mb-4 border border-slate-200 shadow-md">
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-navy-950 font-black text-lg">{item.home} vs {item.away}</Text>
                  <Text className="text-slate-400 text-[10px] font-bold uppercase mt-0.5">{item.league || 'Football'} • {item.time || 'Today'}</Text>
                  <Text className="text-gold-500 font-bold text-xs uppercase mt-2">{item.tip} • Odds {item.odds} • {item.prob || '90%'} Prob</Text>
                </View>
                <TouchableOpacity onPress={() => removeVipTip(item.id)} className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
              <View className="flex-row border-t border-slate-50 pt-4 justify-end gap-x-2">
                <TouchableOpacity 
                  onPress={() => handleSettle(item.id, 'WON')}
                  className="bg-green-50 px-4 py-2 rounded-2xl border border-green-100 flex-row items-center"
                >
                  <Ionicons name="checkmark-circle-outline" size={14} color="#16a34a" />
                  <Text className="text-green-700 font-black text-[10px] uppercase ml-1.5">Settle Won</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleSettle(item.id, 'LOST')}
                  className="bg-red-50 px-4 py-2 rounded-2xl border border-red-100 flex-row items-center"
                >
                  <Ionicons name="close-circle-outline" size={14} color="#dc2626" />
                  <Text className="text-red-700 font-black text-[10px] uppercase ml-1.5">Settle Lost</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View className="bg-navy-950 p-8 rounded-[40px] mt-4 mb-20 shadow-xl border border-white/5">
           <Text className="text-xl font-black text-gold-400 mb-6 uppercase tracking-tighter">Add VIP Tip</Text>
           
           <Text className="text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest px-1">Teams Info</Text>
           <TextInput className="bg-white/10 p-5 rounded-2xl mb-4 border border-white/10 text-white font-bold" placeholder="Home Team Name" placeholderTextColor="#64748b" value={form.home} onChangeText={t => setForm({...form, home: t})} />
           <TextInput className="bg-white/10 p-5 rounded-2xl mb-4 border border-white/10 text-white font-bold" placeholder="Away Team Name" placeholderTextColor="#64748b" value={form.away} onChangeText={t => setForm({...form, away: t})} />
           
           <Text className="text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest px-1">Badge Image IDs (Optional)</Text>
           <View className="flex-row gap-x-3 mb-4">
             <TextInput className="bg-white/10 p-5 rounded-2xl border border-white/10 text-white flex-1 font-bold text-center" placeholder="Home ID" placeholderTextColor="#64748b" keyboardType="numeric" value={form.homeLogo} onChangeText={t => setForm({...form, homeLogo: t})} />
             <TextInput className="bg-white/10 p-5 rounded-2xl border border-white/10 text-white flex-1 font-bold text-center" placeholder="Away ID" placeholderTextColor="#64748b" keyboardType="numeric" value={form.awayLogo} onChangeText={t => setForm({...form, awayLogo: t})} />
           </View>

           <Text className="text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest px-1">Match Details</Text>
           <TextInput className="bg-white/10 p-5 rounded-2xl mb-4 border border-white/10 text-white font-bold" placeholder="League (e.g. Champions League)" placeholderTextColor="#64748b" value={form.league} onChangeText={t => setForm({...form, league: t})} />
           <TextInput className="bg-white/10 p-5 rounded-2xl mb-4 border border-white/10 text-white font-bold" placeholder="Time (e.g. 21:00)" placeholderTextColor="#64748b" value={form.time} onChangeText={t => setForm({...form, time: t})} />

           <Text className="text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest px-1">Prediction details</Text>
           <TextInput className="bg-white/10 p-5 rounded-2xl mb-4 border border-white/10 text-white font-bold" placeholder="Tip (e.g. CS 2-0 or Home Win)" placeholderTextColor="#64748b" value={form.tip} onChangeText={t => setForm({...form, tip: t})} />
           <View className="flex-row gap-x-3 mb-6">
             <TextInput className="bg-white/10 p-5 rounded-2xl border border-white/10 text-white flex-1 font-bold text-center" placeholder="Odds (e.g. 2.10)" placeholderTextColor="#64748b" keyboardType="numeric" value={form.odds} onChangeText={t => setForm({...form, odds: t})} />
             <TextInput className="bg-white/10 p-5 rounded-2xl border border-white/10 text-white flex-1 font-bold text-center" placeholder="Prob % (e.g. 95%)" placeholderTextColor="#64748b" value={form.prob} onChangeText={t => setForm({...form, prob: t})} />
           </View>

           <Button title="PUBLISH VIP TIP" variant="primary" onPress={addTip} />
        </View>
      </ScrollView>
    </Container>
  );
}
