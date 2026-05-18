import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, Share, TextInput, ActivityIndicator } from 'react-native';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useTips } from '@/context/TipsContext';
import { getTeamLogo } from './index';

export default function VIP() {
  const params = useLocalSearchParams();
  const WHATSAPP_NUMBER = '0703354991';
  const PAYMENT_NUMBER = '0793726930';
  
  const { vipTips, clientUserId, clientIsVip, activateVipOnClient, isLoading } = useTips();
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Robust Activation Logic from Deep Links
  useEffect(() => {
    const activeId = params.activate as string;
    if (activeId) {
      activateVipOnClient(activeId).then((success) => {
        if (success) {
          Alert.alert("✅ VIP Unlocked", "Welcome to the premium section.");
        }
      });
    }
  }, [params.activate]);

  const handleManualUnlock = async () => {
    const code = manualCode.trim().toUpperCase();
    const success = await activateVipOnClient(code);
    if (success) {
      Alert.alert("✅ Access Granted", "VIP section is now unlocked.");
    } else {
      Alert.alert("❌ Access Denied", "This code is not authorized. Please ensure payment is made and admin has activated your ID.");
    }
  };

  if (isLoading) {
    return (
      <Container className="bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#df8d38" />
        <Text className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-widest">Checking VIP System...</Text>
      </Container>
    );
  }

  if (clientIsVip) {
    return (
      <Container className="bg-slate-50">
        <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
          <View className="bg-navy-950 p-8 rounded-[44px] mb-8 flex-row justify-between items-center shadow-2xl">
            <View>
              <Text className="text-gold-400 font-black text-2xl uppercase tracking-tighter">VIP Active</Text>
              <Text className="text-white/40 text-[10px] mt-1 font-bold uppercase tracking-widest">ID: {clientUserId}</Text>
            </View>
            <View className="bg-green-500/20 p-3 rounded-3xl border border-green-500/10">
              <Ionicons name="shield-checkmark" size={32} color="#4ade80" />
            </View>
          </View>
 
          <Text className="text-navy-950 font-black text-3xl mb-6 px-2 tracking-tighter uppercase">Daily Accurate Games</Text>
          
          {vipTips.length === 0 ? (
            <View className="bg-white p-10 rounded-[44px] mb-8 border border-slate-200 shadow-xl items-center justify-center py-16">
              <Ionicons name="shield-outline" size={36} color="#fbbf24" />
              <Text className="text-navy-950 font-black text-lg mt-4 uppercase tracking-tighter">Analyzing VIP Fixtures</Text>
              <Text className="text-slate-400 text-xs font-medium mt-1 text-center">Elite fixed games are being carefully computed. Check back shortly!</Text>
            </View>
          ) : (
            vipTips.map((item) => (
              <VIPMatchCard 
                key={item.id}
                home={item.home} 
                away={item.away} 
                tip={item.tip} 
                odds={item.odds} 
                homeId={item.homeLogo} 
                awayId={item.awayLogo} 
                time={item.time} 
              />
            ))
          )}
          
          {vipTips.length > 0 && (
            <View className="bg-white p-10 rounded-[48px] mt-4 mb-12 items-center border border-slate-200 shadow-xl">
              <Text className="text-gold-500 font-black text-4xl tracking-tighter">
                {vipTips.reduce((acc, curr) => acc * parseFloat(curr.odds || '1'), 1).toFixed(2)} Odds
              </Text>
              <Text className="text-slate-400 text-[11px] mt-2 font-black uppercase tracking-widest italic">Premium Master Selection</Text>
            </View>
          )}

          <TouchableOpacity 
            onPress={() => Linking.openURL(`whatsapp://send?phone=256${WHATSAPP_NUMBER.slice(1)}&text=I have a question about today's VIP picks.`)}
            className="bg-green-600/10 border border-green-200 p-8 rounded-[48px] flex-row items-center justify-center mb-20 shadow-sm"
          >
            <FontAwesome name="whatsapp" size={32} color="#16a34a" />
            <Text className="text-green-600 font-black ml-4 text-xl tracking-tight uppercase">VIP Support</Text>
          </TouchableOpacity>
        </ScrollView>
      </Container>
    );
  }

  return (
    <Container className="bg-slate-50">
      <ScrollView className="flex-1 px-5 pt-4">
        <View className="items-center py-12">
          <View className="bg-gold-500 w-28 h-28 rounded-[40px] items-center justify-center mb-8 shadow-2xl shadow-gold-500/50">
            <Ionicons name="lock-closed" size={56} color="#000" />
          </View>
          <Text className="text-navy-950 text-5xl font-black text-center tracking-tighter uppercase">VIP Area</Text>
          <Text className="text-gold-500 text-center font-black mt-2 text-xl tracking-tight uppercase italic">Accurate Games Only</Text>
        </View>

        {/* Step 1: Payment */}
        <View className="bg-white p-10 rounded-[48px] mb-8 border border-slate-200 shadow-2xl">
           <Text className="text-navy-950 font-black text-3xl mb-8 tracking-tighter uppercase">1. Subscribe</Text>
           <View className="bg-slate-50 p-8 rounded-[32px] border border-slate-200 shadow-inner items-center">
              <Text className="text-slate-400 text-[10px] font-black mb-2 uppercase tracking-[4px]">Mobile Money</Text>
              <Text className="text-navy-950 text-4xl font-black tracking-tighter">{PAYMENT_NUMBER}</Text>
              <View className="bg-gold-500/10 px-4 py-1 rounded-full mt-4 border border-gold-500/10">
                 <Text className="text-gold-600 text-[10px] font-black uppercase tracking-widest">WAVE OFFICIAL</Text>
              </View>
           </View>
        </View>

        {/* Step 2: Verification */}
        <View className="bg-white p-10 rounded-[48px] mb-10 border border-slate-200 shadow-2xl">
           <Text className="text-navy-950 font-black text-3xl mb-8 tracking-tighter uppercase">2. Activate</Text>
           <TouchableOpacity onPress={() => { Alert.alert("Copied", clientUserId); }} className="bg-slate-50 p-8 rounded-[32px] border border-slate-200 items-center shadow-inner">
              <Text className="text-gold-500 text-5xl font-black tracking-tighter">{clientUserId}</Text>
              <Text className="text-slate-400 text-[10px] mt-4 font-black uppercase tracking-widest">Your Device ID (Tap to Copy)</Text>
           </TouchableOpacity>
           <View className="mt-10">
             <Button title="SEND PROOF ON WHATSAPP" variant="primary" onPress={() => Linking.openURL(`whatsapp://send?phone=256${WHATSAPP_NUMBER.slice(1)}&text=I have paid for AlphaWins VIP. ID: ${clientUserId}`)} />
           </View>
        </View>

        {/* FAIL-SAFE: Manual Unlock for Link Issues */}
        {!showManualInput ? (
          <TouchableOpacity onPress={() => setShowManualInput(true)} className="mb-20 items-center py-6">
            <Text className="text-navy-950/40 font-black text-xs uppercase tracking-[3px] underline">I have an activation link/code</Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-navy-950 p-10 rounded-[48px] mb-20 shadow-2xl items-center border border-white/5">
             <Ionicons name="key" size={40} color="#fbbf24" style={{ marginBottom: 20 }} />
             <Text className="text-white font-black text-2xl mb-8 tracking-tighter uppercase">Enter Link Code</Text>
             <TextInput 
               className="bg-white/10 w-full p-6 rounded-3xl mb-10 font-black text-gold-400 border border-white/10 text-center text-3xl tracking-widest"
               placeholder="AW-XXXX"
               placeholderTextColor="#334155"
               autoCapitalize="characters"
               value={manualCode}
               onChangeText={setManualCode}
             />
             <Button title="UNLOCK VIP NOW" variant="primary" onPress={handleManualUnlock} />
             <TouchableOpacity onPress={() => setShowManualInput(false)} className="mt-8">
                <Text className="text-white/20 font-black text-xs uppercase tracking-widest">Cancel</Text>
             </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </Container>
  );
}

function VIPMatchCard({ home, away, tip, odds, homeId, awayId, time }: any) {
  return (
    <View className="bg-white p-8 rounded-[48px] mb-6 border border-slate-200 shadow-xl">
      <View className="flex-row justify-between items-center mb-8 px-2">
        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">{time} • ACCURATE GAME</Text>
        <View className="bg-green-100 px-3 py-1 rounded-xl border border-green-200 shadow-sm">
           <Text className="text-green-700 text-[9px] font-black tracking-widest uppercase">FIXED</Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center mb-10 px-4">
        <View className="items-center flex-1">
          <Image source={getTeamLogo(homeId)} className="w-20 h-20 mb-4" contentFit="contain" />
          <Text className="text-navy-950 font-black text-sm text-center uppercase tracking-tighter">{home}</Text>
        </View>
        <Text className="text-slate-100 font-black text-4xl px-4 italic opacity-50">VS</Text>
        <View className="items-center flex-1">
          <Image source={getTeamLogo(awayId)} className="w-20 h-20 mb-4" contentFit="contain" />
          <Text className="text-navy-950 font-black text-sm text-center uppercase tracking-tighter">{away}</Text>
        </View>
      </View>
      <View className="bg-slate-50 p-6 rounded-[36px] flex-row justify-between items-center border border-slate-200 shadow-inner">
        <View>
          <Text className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">ACCURATE PICK</Text>
          <Text className="text-gold-500 font-black text-2xl tracking-tighter uppercase">{tip}</Text>
        </View>
        <View className="bg-white px-6 py-3 rounded-3xl shadow-md border border-slate-100">
           <Text className="text-navy-950 font-black text-2xl tracking-tighter">@{odds}</Text>
        </View>
      </View>
    </View>
  );
}
