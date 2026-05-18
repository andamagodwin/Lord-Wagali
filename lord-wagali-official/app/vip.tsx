import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useTips } from '@/context/TipsContext';
import { getTeamLogo } from './index';
import { KeyboardAwareScreen } from '@/components/KeyboardAwareScreen';

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
          Alert.alert('✅ VIP Unlocked', 'Welcome to the premium section.');
        }
      });
    }
  }, [params.activate, activateVipOnClient]);

  const handleManualUnlock = async () => {
    const code = manualCode.trim().toUpperCase();
    const success = await activateVipOnClient(code);
    if (success) {
      Alert.alert('✅ Access Granted', 'VIP section is now unlocked.');
    } else {
      Alert.alert(
        '❌ Access Denied',
        'This code is not authorized. Please ensure payment is made and admin has activated your ID.'
      );
    }
  };

  if (isLoading) {
    return (
      <Container className="items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#df8d38" />
        <Text className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Checking VIP System...
        </Text>
      </Container>
    );
  }

  if (clientIsVip) {
    return (
      <KeyboardAwareScreen className="bg-slate-50" contentClassName="px-4 pt-6">
        <View className="mb-8 flex-row items-center justify-between rounded-[44px] bg-navy-950 p-8 shadow-2xl">
          <View>
            <Text className="text-2xl font-black uppercase tracking-tighter text-gold-400">
              VIP Active
            </Text>
            <Text className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
              ID: {clientUserId}
            </Text>
          </View>
          <View className="rounded-3xl border border-green-500/10 bg-green-500/20 p-3">
            <Ionicons name="shield-checkmark" size={32} color="#4ade80" />
          </View>
        </View>

        <Text className="mb-6 px-2 text-3xl font-black uppercase tracking-tighter text-navy-950">
          Daily Accurate Games
        </Text>

        {vipTips.length === 0 ? (
          <View className="mb-8 items-center justify-center rounded-[44px] border border-slate-200 bg-white p-10 py-16 shadow-xl">
            <Ionicons name="shield-outline" size={36} color="#fbbf24" />
            <Text className="mt-4 text-lg font-black uppercase tracking-tighter text-navy-950">
              Analyzing VIP Fixtures
            </Text>
            <Text className="mt-1 text-center text-xs font-medium text-slate-400">
              Elite fixed games are being carefully computed. Check back shortly!
            </Text>
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
          <View className="mb-12 mt-4 items-center rounded-[48px] border border-slate-200 bg-white p-10 shadow-xl">
            <Text className="text-4xl font-black tracking-tighter text-gold-500">
              {vipTips.reduce((acc, curr) => acc * parseFloat(curr.odds || '1'), 1).toFixed(2)} Odds
            </Text>
            <Text className="mt-2 text-[11px] font-black uppercase italic tracking-widest text-slate-400">
              Premium Master Selection
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              `whatsapp://send?phone=256${WHATSAPP_NUMBER.slice(1)}&text=I have a question about today's VIP picks.`
            )
          }
          className="mb-20 flex-row items-center justify-center rounded-[48px] border border-green-200 bg-green-600/10 p-8 shadow-sm">
          <FontAwesome name="whatsapp" size={32} color="#16a34a" />
          <Text className="ml-4 text-xl font-black uppercase tracking-tight text-green-600">
            VIP Support
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScreen>
    );
  }

  return (
    <KeyboardAwareScreen className="bg-slate-50" contentClassName="px-5 pt-4">
      <View className="items-center py-12">
        <View className="mb-8 h-28 w-28 items-center justify-center rounded-[40px] bg-gold-500 shadow-2xl shadow-gold-500/50">
          <Ionicons name="lock-closed" size={56} color="#000" />
        </View>
        <Text className="text-center text-5xl font-black uppercase tracking-tighter text-navy-950">
          VIP Area
        </Text>
        <Text className="mt-2 text-center text-xl font-black uppercase italic tracking-tight text-gold-500">
          Accurate Games Only
        </Text>
      </View>

      {/* Step 1: Payment */}
      <View className="mb-8 rounded-[48px] border border-slate-200 bg-white p-10 shadow-2xl">
        <Text className="mb-8 text-3xl font-black uppercase tracking-tighter text-navy-950">
          1. Subscribe
        </Text>
        <View className="shadow-inner items-center rounded-[32px] border border-slate-200 bg-slate-50 p-8">
          <Text className="mb-2 text-[10px] font-black uppercase tracking-[4px] text-slate-400">
            Mobile Money
          </Text>
          <Text className="text-4xl font-black tracking-tighter text-navy-950">
            {PAYMENT_NUMBER}
          </Text>
          <View className="mt-4 rounded-full border border-gold-500/10 bg-gold-500/10 px-4 py-1">
            <Text className="text-[10px] font-black uppercase tracking-widest text-gold-600">
              WAVE OFFICIAL
            </Text>
          </View>
        </View>
      </View>

      {/* Step 2: Verification */}
      <View className="mb-10 rounded-[48px] border border-slate-200 bg-white p-10 shadow-2xl">
        <Text className="mb-8 text-3xl font-black uppercase tracking-tighter text-navy-950">
          2. Activate
        </Text>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Copied', clientUserId);
          }}
          className="shadow-inner items-center rounded-[32px] border border-slate-200 bg-slate-50 p-8">
          <Text className="text-5xl font-black tracking-tighter text-gold-500">{clientUserId}</Text>
          <Text className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Your Device ID (Tap to Copy)
          </Text>
        </TouchableOpacity>
        <View className="mt-10">
          <Button
            title="SEND PROOF ON WHATSAPP"
            variant="primary"
            onPress={() =>
              Linking.openURL(
                `whatsapp://send?phone=256${WHATSAPP_NUMBER.slice(1)}&text=I have paid for ElitePicks VIP. ID: ${clientUserId}`
              )
            }
          />
        </View>
      </View>

      {/* FAIL-SAFE: Manual Unlock for Link Issues */}
      {!showManualInput ? (
        <TouchableOpacity
          onPress={() => setShowManualInput(true)}
          className="mb-20 items-center py-6">
          <Text className="text-xs font-black uppercase tracking-[3px] text-navy-950/40 underline">
            I have an activation link/code
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="mb-20 items-center rounded-[48px] border border-white/5 bg-navy-950 p-10 shadow-2xl">
          <Ionicons name="key" size={40} color="#fbbf24" style={{ marginBottom: 20 }} />
          <Text className="mb-8 text-2xl font-black uppercase tracking-tighter text-white">
            Enter Link Code
          </Text>
          <TextInput
            className="mb-10 w-full rounded-3xl border border-white/10 bg-white/10 p-6 text-center text-3xl font-black tracking-widest text-gold-400"
            placeholder="AW-XXXX"
            placeholderTextColor="#334155"
            autoCapitalize="characters"
            value={manualCode}
            onChangeText={setManualCode}
          />
          <Button title="UNLOCK VIP NOW" variant="primary" onPress={handleManualUnlock} />
          <TouchableOpacity onPress={() => setShowManualInput(false)} className="mt-8">
            <Text className="text-xs font-black uppercase tracking-widest text-white/20">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAwareScreen>
  );
}

function VIPMatchCard({ home, away, tip, odds, homeId, awayId, time }: any) {
  return (
    <View className="mb-6 rounded-[48px] border border-slate-200 bg-white p-8 shadow-xl">
      <View className="mb-8 flex-row items-center justify-between px-2">
        <Text className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">
          {time} • ACCURATE GAME
        </Text>
        <View className="rounded-xl border border-green-200 bg-green-100 px-3 py-1 shadow-sm">
          <Text className="text-[9px] font-black uppercase tracking-widest text-green-700">
            FIXED
          </Text>
        </View>
      </View>
      <View className="mb-10 flex-row items-center justify-between px-4">
        <View className="flex-1 items-center">
          <Image source={getTeamLogo(homeId)} className="mb-4 h-20 w-20" contentFit="contain" />
          <Text className="text-center text-sm font-black uppercase tracking-tighter text-navy-950">
            {home}
          </Text>
        </View>
        <Text className="px-4 text-4xl font-black italic text-slate-100 opacity-50">VS</Text>
        <View className="flex-1 items-center">
          <Image source={getTeamLogo(awayId)} className="mb-4 h-20 w-20" contentFit="contain" />
          <Text className="text-center text-sm font-black uppercase tracking-tighter text-navy-950">
            {away}
          </Text>
        </View>
      </View>
      <View className="shadow-inner flex-row items-center justify-between rounded-[36px] border border-slate-200 bg-slate-50 p-6">
        <View>
          <Text className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
            ACCURATE PICK
          </Text>
          <Text className="text-2xl font-black uppercase tracking-tighter text-gold-500">
            {tip}
          </Text>
        </View>
        <View className="rounded-3xl border border-slate-100 bg-white px-6 py-3 shadow-md">
          <Text className="text-2xl font-black tracking-tighter text-navy-950">@{odds}</Text>
        </View>
      </View>
    </View>
  );
}
