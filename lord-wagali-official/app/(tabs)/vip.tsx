import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Button } from '@/components/Button';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useTips } from '@/context/TipsContext';
import { getTeamLogo } from './index';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WHATSAPP_NUMBER, PAYMENT_NUMBER } from '@/lib/constants';

export default function VIP() {
  const params = useLocalSearchParams();

  const { vipTips, clientUserId, clientIsVip, activateVipOnClient, isLoading, hydrate } =
    useTips();
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await hydrate();
    setRefreshing(false);
  }, [hydrate]);

  useEffect(() => {
    const activeId = params.activate as string;
    if (activeId) {
      activateVipOnClient(activeId).then((success) => {
        if (success) {
          Alert.alert('VIP Unlocked', 'Welcome to the premium section.');
        }
      });
    }
  }, [params.activate, activateVipOnClient]);

  const handleManualUnlock = async () => {
    const code = manualCode.trim().toUpperCase();
    const success = await activateVipOnClient(code);
    if (success) {
      Alert.alert('Access Granted', 'VIP section is now unlocked.');
    } else {
      Alert.alert(
        'Access Denied',
        'This code is not authorized. Please ensure payment is made and admin has activated your ID.'
      );
    }
  };

  if (isLoading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#18152e" />
        <Text className="mt-3 text-xs font-medium text-slate-400">Checking VIP status...</Text>
      </View>
    );
  }

  if (clientIsVip) {
    return (
      <View className="flex-1 bg-slate-50">
        <SafeAreaView edges={['top']} className="bg-[#18152e]">
          <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
            <View>
              <Text className="text-lg font-black tracking-tight text-white">VIP Room</Text>
              <Text className="text-[9px] font-medium uppercase tracking-widest text-green-400">
                Active • {clientUserId}
              </Text>
            </View>
            <View className="rounded-xl bg-green-500/20 p-2">
              <Ionicons name="shield-checkmark" size={22} color="#4ade80" />
            </View>
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
            {vipTips.length === 0 ? (
              <View className="items-center justify-center rounded-2xl border border-slate-100 bg-white p-10 shadow-sm">
                <Ionicons name="shield-outline" size={36} color="#fbbf24" />
                <Text className="mt-4 text-base font-bold text-navy-950">
                  Analyzing VIP Fixtures
                </Text>
                <Text className="mt-1 text-center text-xs text-slate-400">
                  Elite picks are being computed. Check back shortly.
                </Text>
              </View>
            ) : (
              <>
                {vipTips.map((item) => (
                  <VIPMatchCard
                    key={item.id}
                    home={item.home}
                    away={item.away}
                    tip={item.tip}
                    odds={item.odds}
                    homeId={item.homeLogo}
                    awayId={item.awayLogo}
                    time={item.time}
                    league={item.league}
                  />
                ))}

                <View className="mt-2 items-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <Text className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Combined Odds
                  </Text>
                  <Text className="mt-1 text-3xl font-black tracking-tight text-gold-500">
                    {vipTips
                      .reduce((acc, curr) => acc * parseFloat(curr.odds || '1'), 1)
                      .toFixed(2)}
                  </Text>
                </View>
              </>
            )}

            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `whatsapp://send?phone=256${WHATSAPP_NUMBER.slice(1)}&text=I have a question about today's VIP picks.`
                )
              }
              activeOpacity={0.8}
              className="mt-6 flex-row items-center justify-center rounded-2xl border border-green-100 bg-green-50 p-4">
              <FontAwesome name="whatsapp" size={18} color="#16a34a" />
              <Text className="ml-3 text-sm font-bold text-green-700">VIP Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Non-VIP: Payment & Activation flow
  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-[#18152e]">
        <View className="items-center px-5 pb-5 pt-3">
          <Text className="text-lg font-black tracking-tight text-white">VIP Access</Text>
          <Text className="mt-0.5 text-[10px] font-medium text-gold-400">
            Premium Predictions
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled">
        <View className="px-5 pt-6">
          {/* Step 1: Payment */}
          <View className="mb-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-navy-950">
                <Text className="text-xs font-black text-white">1</Text>
              </View>
              <Text className="text-base font-bold text-navy-950">Make Payment</Text>
            </View>
            <View className="items-center rounded-xl bg-slate-50 p-5">
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Mobile Money
              </Text>
              <Text className="mt-1 text-2xl font-black tracking-tight text-navy-950">
                {PAYMENT_NUMBER}
              </Text>
              <Text className="mt-2 text-[10px] font-medium text-gold-600">WAVE OFFICIAL</Text>
            </View>
          </View>

          {/* Step 2: Verification */}
          <View className="mb-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-navy-950">
                <Text className="text-xs font-black text-white">2</Text>
              </View>
              <Text className="text-base font-bold text-navy-950">Send Proof</Text>
            </View>
            <TouchableOpacity
              onPress={() => Alert.alert('Your Device ID', clientUserId)}
              className="items-center rounded-xl bg-slate-50 p-5">
              <Text className="text-2xl font-black tracking-tight text-gold-500">
                {clientUserId}
              </Text>
              <Text className="mt-2 text-[10px] font-medium text-slate-400">
                Tap to copy your Device ID
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `whatsapp://send?phone=256${WHATSAPP_NUMBER.slice(1)}&text=I have paid for ElitePicks VIP. ID: ${clientUserId}`
                )
              }
              activeOpacity={0.8}
              className="mt-4 flex-row items-center justify-center rounded-xl bg-green-600 p-4">
              <FontAwesome name="whatsapp" size={18} color="white" />
              <Text className="ml-2 text-sm font-bold text-white">Send Proof on WhatsApp</Text>
            </TouchableOpacity>
          </View>

          {/* Step 3: Activate */}
          <View className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-navy-950">
                <Text className="text-xs font-black text-white">3</Text>
              </View>
              <Text className="text-base font-bold text-navy-950">Enter Code</Text>
            </View>

            {!showManualInput ? (
              <TouchableOpacity
                onPress={() => setShowManualInput(true)}
                className="items-center rounded-xl bg-slate-50 p-5">
                <Ionicons name="key-outline" size={24} color="#64748b" />
                <Text className="mt-2 text-xs font-medium text-slate-500">
                  I have an activation code
                </Text>
              </TouchableOpacity>
            ) : (
              <View>
                <TextInput
                  className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-lg font-bold text-navy-950"
                  placeholder="AW-XXXX"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="characters"
                  value={manualCode}
                  onChangeText={setManualCode}
                />
                <Button title="UNLOCK VIP" variant="primary" onPress={handleManualUnlock} />
                <TouchableOpacity
                  onPress={() => setShowManualInput(false)}
                  className="mt-3 items-center py-2">
                  <Text className="text-xs font-medium text-slate-400">Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function VIPMatchCard({
  home,
  away,
  tip,
  odds,
  homeId,
  awayId,
  time,
  league,
}: {
  home: string;
  away: string;
  tip: string;
  odds: string;
  homeId: string;
  awayId: string;
  time: string;
  league?: string;
}) {
  return (
    <View className="mb-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {league ? `${league} • ` : ''}{time}
        </Text>
        <View className="rounded-md bg-green-50 px-2 py-0.5">
          <Text className="text-[9px] font-bold uppercase text-green-700">VIP Pick</Text>
        </View>
      </View>

      <View className="mb-4 flex-row items-center">
        <View className="flex-1 flex-row items-center">
          <Image source={getTeamLogo(homeId)} className="mr-2 h-10 w-10" contentFit="contain" />
          <Text className="flex-1 text-sm font-bold text-navy-950" numberOfLines={1}>
            {home}
          </Text>
        </View>
        <Text className="mx-3 text-xs font-bold text-slate-300">VS</Text>
        <View className="flex-1 flex-row-reverse items-center">
          <Image source={getTeamLogo(awayId)} className="ml-2 h-10 w-10" contentFit="contain" />
          <Text className="flex-1 text-right text-sm font-bold text-navy-950" numberOfLines={1}>
            {away}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between rounded-xl bg-slate-50 p-4">
        <View>
          <Text className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Prediction
          </Text>
          <Text className="text-base font-black uppercase text-gold-500">{tip}</Text>
        </View>
        <View className="rounded-lg bg-white px-4 py-2 shadow-sm">
          <Text className="text-base font-black text-navy-950">@{odds}</Text>
        </View>
      </View>
    </View>
  );
}
