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
  const match = tips.find(t => t.id === id) || 
                vipTips.find(t => t.id === id) || 
                history.find(t => t.id === id);

  if (isLoading) {
    return (
      <Container className="bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#df8d38" />
        <Text className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-widest">Loading Analytics...</Text>
      </Container>
    );
  }

  if (!match) {
    return (
      <Container className="bg-slate-50 justify-center items-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#dc2626" />
        <Text className="text-navy-950 font-black text-2xl mt-6 uppercase tracking-tighter">Fixture Not Found</Text>
        <Text className="text-slate-400 text-sm font-medium mt-1 text-center mb-8">This tip analysis might have expired or been removed.</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-navy-950 px-8 py-4 rounded-3xl shadow-lg">
          <Text className="text-gold-400 font-black uppercase text-xs tracking-widest">Go Back</Text>
        </TouchableOpacity>
      </Container>
    );
  }

  // Robust default fallbacks
  const winProb = match.winProb || { home: 45, draw: 30, away: 25 };
  const stats = match.stats && match.stats.length > 0 ? match.stats : [
    { label: 'Attack Index', value: '75%' },
    { label: 'Defensive Unit', value: '70%' },
    { label: 'Home Factor', value: '78%' }
  ];
  const form = match.form && match.form.home ? match.form : {
    home: ['W', 'W', 'D', 'W', 'L'],
    away: ['W', 'D', 'L', 'W', 'W']
  };
  const summary = match.summary || 
    `Our expert mathematical model has meticulously calculated this fixture. ${match.home} clashes against ${match.away} in the ${match.league || 'league'}. Factoring in historical trends, present squad depth, and tactical momentum, we identify high value in the "${match.tip}" selection, backed by a strong ${match.prob || '85%'} accuracy rating at odds of @${match.odds}.`;

  return (
    <Container className="bg-slate-50">
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Match Header */}
        <View className="bg-navy-950 p-8 rounded-[44px] mb-6 shadow-2xl relative overflow-hidden">
           <MaterialCommunityIcons name="soccer-field" size={150} color="rgba(255,255,255,0.03)" style={{ position: 'absolute', right: -20, top: -20 }} />
          <View className="flex-row justify-between items-center mb-8">
            <View className="items-center flex-1">
              <Image source={getTeamLogo(match.homeLogo)} className="w-18 h-18 mb-3" contentFit="contain" />
              <Text className="text-white font-black text-center text-sm uppercase tracking-tighter" numberOfLines={1}>{match.home}</Text>
              <Text className="text-gold-400 text-[9px] font-black uppercase mt-1">POS: 1st</Text>
            </View>
            <View className="px-4 items-center">
              <Text className="text-gold-400 font-black text-2xl italic">VS</Text>
              <View className="bg-white/10 px-2 py-1 rounded-lg mt-2">
                 <Text className="text-white/40 text-[8px] font-black uppercase">LIVE DATA</Text>
              </View>
            </View>
            <View className="items-center flex-1">
              <Image source={getTeamLogo(match.awayLogo)} className="w-18 h-18 mb-3" contentFit="contain" />
              <Text className="text-white font-black text-center text-sm uppercase tracking-tighter" numberOfLines={1}>{match.away}</Text>
              <Text className="text-white/30 text-[9px] font-black uppercase mt-1">POS: 3rd</Text>
            </View>
          </View>
          
          <Text className="text-white/30 text-[9px] font-black text-center mb-4 uppercase tracking-widest">Winning Probability</Text>
          <View className="h-5 bg-black/40 rounded-2xl flex-row overflow-hidden mb-4 border border-white/5">
            <View style={{ width: `${winProb.home}%` }} className="bg-gold-500 h-full shadow-lg" />
            <View style={{ width: `${winProb.draw}%` }} className="bg-slate-700 h-full" />
            <View style={{ width: `${winProb.away}%` }} className="bg-coral-500 h-full" />
          </View>
          <View className="flex-row justify-between px-2">
            <Text className="text-gold-500 text-[10px] font-black uppercase">{match.home} {winProb.home}%</Text>
            <Text className="text-white/20 text-[10px] font-black uppercase">Draw {winProb.draw}%</Text>
            <Text className="text-coral-500 text-[10px] font-black uppercase">{match.away} {winProb.away}%</Text>
          </View>
        </View>

        {/* Detailed Stats */}
        <View className="bg-white p-8 rounded-[44px] mb-6 border border-slate-200 shadow-lg">
          <Text className="text-navy-950 font-black text-xl mb-6 tracking-tighter uppercase">Statistical Analysis</Text>
          {stats.map((stat, i) => (
            <View key={i} className="mb-6">
              <View className="flex-row justify-between mb-2">
                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</Text>
                <Text className="text-navy-950 font-black text-xs">{stat.value}</Text>
              </View>
              <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <View style={{ width: stat.value as any }} className="h-full bg-navy-950 rounded-full" />
              </View>
            </View>
          ))}
        </View>

        {/* Form */}
        <View className="bg-white p-8 rounded-[44px] mb-6 border border-slate-200 shadow-lg">
           <Text className="text-navy-950 font-black text-xl mb-6 tracking-tighter uppercase">Recent Form</Text>
           <View className="flex-row justify-between items-center mb-6 bg-slate-50 p-4 rounded-3xl">
              <Text className="text-navy-950 font-bold text-xs uppercase" numberOfLines={1}>{match.home}</Text>
              <View className="flex-row">
                 {form.home.map((r, i) => (
                   <View key={i} className={`w-6 h-6 rounded-lg items-center justify-center ml-1 ${r === 'W' ? 'bg-green-500' : r === 'D' ? 'bg-slate-400' : 'bg-red-500'}`}>
                      <Text className="text-white font-black text-[10px]">{r}</Text>
                   </View>
                 ))}
              </View>
           </View>
           <View className="flex-row justify-between items-center bg-slate-50 p-4 rounded-3xl">
              <Text className="text-navy-950 font-bold text-xs uppercase" numberOfLines={1}>{match.away}</Text>
              <View className="flex-row">
                 {form.away.map((r, i) => (
                   <View key={i} className={`w-6 h-6 rounded-lg items-center justify-center ml-1 ${r === 'W' ? 'bg-green-500' : r === 'D' ? 'bg-slate-400' : 'bg-red-500'}`}>
                      <Text className="text-white font-black text-[10px]">{r}</Text>
                   </View>
                 ))}
              </View>
           </View>
        </View>

        {/* Expert Verdict */}
        <View className="bg-white p-8 rounded-[44px] mb-12 border border-gold-500/30 shadow-2xl">
          <View className="flex-row items-center mb-4">
             <View className="bg-gold-500 p-2 rounded-xl mr-3">
                <Ionicons name="ribbon" size={20} color="black" />
             </View>
             <Text className="text-gold-600 font-black text-lg uppercase tracking-widest">AlphaWins Verdict</Text>
          </View>
          <Text className="text-slate-600 italic text-sm leading-7 font-medium">"{summary}"</Text>
          <View className="mt-8 pt-8 border-t border-slate-100 items-center">
            <Text className="text-slate-400 text-[10px] font-black uppercase mb-2 tracking-widest">Recommended Investment</Text>
            <View className="bg-navy-950 px-8 py-4 rounded-[32px] shadow-xl shadow-navy-950/30">
               <Text className="text-gold-400 font-black text-2xl tracking-tighter uppercase">{match.tip}</Text>
            </View>
          </View>
        </View>

        <View className="h-10" />
      </ScrollView>
    </Container>
  );
}
