import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useTips } from '@/context/TipsContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DOWNLOAD_LINK, WHATSAPP_NUMBER } from '@/lib/constants';

export const getTeamLogo = (logo: string) => {
  if (!logo) return 'https://media.api-sports.io/football/teams/0.png';
  if (logo.startsWith('http')) return logo;
  if (isNaN(Number(logo))) return 'https://media.api-sports.io/football/teams/0.png';
  return `https://media.api-sports.io/football/teams/${logo}.png`;
};

export default function Home() {
  const router = useRouter();
  const { tips, isLoading, hydrate } = useTips();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await hydrate();
    setRefreshing(false);
  }, [hydrate]);

  const shareApp = () =>
    Share.share({
      message: `Join ElitePicks for daily accurate games! Download the app here: ${DOWNLOAD_LINK}`,
    });

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="light" backgroundColor="#18152e" />

      {/* Header */}
      <SafeAreaView edges={['top']} className="bg-[#18152e]">
        <View className="px-5 pb-5 pt-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity
                activeOpacity={1}
                onLongPress={() => router.push('/admin')}
                style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden' }}>
                <Image
                  source={require('@/assets/elitepicks-logo.png')}
                  style={{ width: 44, height: 44 }}
                  contentFit="cover"
                />
              </TouchableOpacity>
              <View className="ml-3">
                <Text className="text-lg font-black tracking-tight text-white">ElitePicks</Text>
                <Text className="text-[9px] font-semibold uppercase tracking-widest text-gold-400">
                  Accurate Predictions
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={shareApp}
              className="h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Ionicons name="share-social-outline" size={18} color="white" />
            </TouchableOpacity>
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
        {/* VIP Access Banner */}
        <TouchableOpacity
          onPress={() => router.push('/vip')}
          activeOpacity={0.85}
          className="mx-5 mt-5 flex-row items-center justify-between rounded-2xl bg-gold-500 p-5">
          <View className="flex-1">
            <Text className="text-base font-black uppercase tracking-tight text-navy-950">
              VIP Predictions
            </Text>
            <Text className="mt-0.5 text-[10px] font-medium text-navy-900/70">
              Unlock premium winning picks
            </Text>
          </View>
          <View className="rounded-xl bg-navy-950 p-3">
            <Ionicons name="lock-open" size={20} color="#fbbf24" />
          </View>
        </TouchableOpacity>

        {/* Free Tips Section */}
        <View className="mt-8 px-5">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-lg font-black text-navy-950">Today&apos;s Free Tips</Text>
            <TouchableOpacity onPress={() => router.push('/history')}>
              <Text className="text-xs font-bold text-coral-500">See Results</Text>
            </TouchableOpacity>
          </View>

          {isLoading && !refreshing ? (
            <View className="items-center justify-center py-16">
              <ActivityIndicator size="large" color="#18152e" />
              <Text className="mt-3 text-xs font-medium text-slate-400">
                Loading predictions...
              </Text>
            </View>
          ) : tips.length === 0 ? (
            <View className="items-center justify-center rounded-2xl border border-slate-100 bg-white p-10 shadow-sm">
              <Ionicons name="football-outline" size={40} color="#cbd5e1" />
              <Text className="mt-4 text-base font-bold text-navy-950">No Active Tips</Text>
              <Text className="mt-1 text-center text-xs text-slate-400">
                We&apos;re analyzing today&apos;s fixtures. Check back shortly.
              </Text>
            </View>
          ) : (
            tips.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: '/analysis/[id]', params: { id: item.id } })}
                className="mb-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {item.league || 'Football'} • {item.time || 'Today'}
                  </Text>
                  <View className="rounded-md bg-green-50 px-2 py-0.5">
                    <Text className="text-[9px] font-bold text-green-700">
                      {item.prob || '85%'}
                    </Text>
                  </View>
                </View>

                <View className="mb-4 flex-row items-center">
                  <View className="flex-1 flex-row items-center">
                    <Image
                      source={{ uri: getTeamLogo(item.homeLogo) }}
                      style={{ width: 36, height: 36 }}
                      contentFit="contain"
                    />
                    <Text className="ml-2 flex-1 text-sm font-bold text-navy-950" numberOfLines={1}>
                      {item.home}
                    </Text>
                  </View>

                  <View className="mx-3 rounded-lg bg-coral-500 px-3 py-1.5">
                    <Text className="text-[10px] font-black uppercase text-white">{item.tip}</Text>
                  </View>

                  <View className="flex-1 flex-row-reverse items-center">
                    <Image
                      source={{ uri: getTeamLogo(item.awayLogo) }}
                      style={{ width: 36, height: 36 }}
                      contentFit="contain"
                    />
                    <Text
                      className="mr-2 flex-1 text-right text-sm font-bold text-navy-950"
                      numberOfLines={1}>
                      {item.away}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between border-t border-slate-50 pt-3">
                  <Text className="text-[10px] font-semibold text-slate-400">
                    Odds: {item.odds}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="mr-1 text-[10px] font-semibold text-slate-400">Analysis</Text>
                    <Ionicons name="chevron-forward" size={12} color="#94a3b8" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* WhatsApp CTA */}
        <View className="mt-8 px-5">
          <TouchableOpacity
            onPress={() => Linking.openURL(`whatsapp://send?phone=256${WHATSAPP_NUMBER.slice(1)}`)}
            activeOpacity={0.8}
            className="flex-row items-center justify-center rounded-2xl bg-green-600 p-4">
            <FontAwesome name="whatsapp" size={20} color="white" />
            <Text className="ml-3 text-sm font-bold text-white">Contact Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onLongPress={() => router.push('/admin')}
          className="mt-8 items-center pb-4 opacity-20">
          <Text className="text-[9px] font-medium uppercase tracking-widest text-navy-950">
            ElitePicks • {new Date().getFullYear()}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
