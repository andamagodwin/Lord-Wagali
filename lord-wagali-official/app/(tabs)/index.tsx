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
import { Container } from '@/components/Container';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useTips } from '@/context/TipsContext';
import { StatusBar } from 'expo-status-bar';
import { DOWNLOAD_LINK, WHATSAPP_NUMBER } from '@/lib/constants';

export const getTeamLogo = (logo: string) => {
  if (!logo) return 'https://media.api-sports.io/football/teams/0.png';
  if (logo.startsWith('http')) return logo;
  if (isNaN(Number(logo))) return `https://media.api-sports.io/football/teams/0.png`;
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
    <Container className="bg-slate-50">
      <StatusBar style="light" backgroundColor="#18152e" />
      {/* Premium Header */}
      <View className="rounded-b-[48px] border-b border-navy-900 bg-navy-950 px-6 pb-10 pt-12 shadow-2xl">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              activeOpacity={1}
              onLongPress={() => router.push('/admin')}
              className="w-18 h-18 overflow-hidden rounded-[24px] border-2 border-gold-400 bg-zinc-800 shadow-2xl">
              <Image
                source={require('@/assets/img_1778617166715_015o.jpg')}
                className="h-full w-full"
                contentFit="cover"
              />
            </TouchableOpacity>
            <View className="ml-4">
              <Text className="text-3xl font-black uppercase tracking-tighter text-white">
                ElitePicks
              </Text>
              <View className="mt-1 self-start rounded-lg bg-gold-500 px-2 py-0.5">
                <Text className="text-[9px] font-black uppercase italic tracking-widest text-navy-950">
                  Official App
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row">
            <TouchableOpacity
              onPress={shareApp}
              className="mr-2 h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <Ionicons name="share-social-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
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
          onPress={() => router.push('/(tabs)/vip')}
          className="mx-6 mt-6 flex-row items-center justify-between rounded-[40px] border-4 border-white/20 bg-gold-500 p-8 shadow-2xl">
          <View className="flex-1">
            <Text className="text-2xl font-black uppercase tracking-tighter text-navy-950">
              VIP ACCURATE
            </Text>
            <Text className="mt-1 text-[10px] font-bold uppercase tracking-widest text-navy-900 opacity-80">
              Unlock Elite Winning Games
            </Text>
          </View>
          <View className="rounded-3xl bg-navy-950 p-4 shadow-lg">
            <Ionicons name="lock-open" size={28} color="#fbbf24" />
          </View>
        </TouchableOpacity>

        <View className="mt-10 px-6">
          <View className="mb-6 flex-row items-center justify-between px-1">
            <Text className="text-3xl font-black uppercase tracking-tighter text-navy-950">
              Free Tips
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
              <Text className="text-xs font-black tracking-widest text-coral-500">RESULTS</Text>
            </TouchableOpacity>
          </View>

          {isLoading && !refreshing ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#df8d38" />
              <Text className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                Updating Predictions...
              </Text>
            </View>
          ) : tips.length === 0 ? (
            <View className="mb-6 items-center justify-center rounded-[44px] border border-slate-200 bg-white p-10 py-16 shadow-xl">
              <Ionicons name="football-outline" size={48} color="#cbd5e1" />
              <Text className="mt-4 text-lg font-black uppercase tracking-tighter text-navy-950">
                No Active Tips
              </Text>
              <Text className="mt-1 text-center text-xs font-medium text-slate-400">
                We are analyzing today&apos;s fixtures. Check back shortly!
              </Text>
            </View>
          ) : (
            tips.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push({ pathname: '/analysis/[id]', params: { id: item.id } })}
                className="mb-6 rounded-[44px] border border-slate-200 bg-white p-6 shadow-xl">
                <View className="mb-6 flex-row items-center justify-between px-2">
                  <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {item.league || 'Today'} • {item.time || 'Football'}
                  </Text>
                  <View className="rounded-full border border-green-200 bg-green-100 px-3 py-1">
                    <Text className="text-[9px] font-black uppercase text-green-700">
                      {item.prob || '85%'} ACCURATE
                    </Text>
                  </View>
                </View>

                <View className="mb-6 flex-row items-center justify-between px-2">
                  <View className="flex-1 items-center">
                    <Image
                      source={getTeamLogo(item.homeLogo)}
                      className="mb-2 h-16 w-16"
                      contentFit="contain"
                    />
                    <Text
                      className="text-center text-[11px] font-black uppercase text-navy-950"
                      numberOfLines={1}>
                      {item.home}
                    </Text>
                  </View>

                  <View className="flex-1 items-center px-4">
                    <View className="w-full items-center rounded-3xl border border-white/20 bg-coral-500 py-3 shadow-xl shadow-coral-500/40">
                      <Text className="text-xs font-black uppercase tracking-tighter text-white">
                        {item.tip}
                      </Text>
                    </View>
                    <Text className="mt-2 text-[10px] font-black tracking-widest text-slate-400">
                      ODDS {item.odds}
                    </Text>
                  </View>

                  <View className="flex-1 items-center">
                    <Image
                      source={getTeamLogo(item.awayLogo)}
                      className="mb-2 h-16 w-16"
                      contentFit="contain"
                    />
                    <Text
                      className="text-center text-[11px] font-black uppercase text-navy-950"
                      numberOfLines={1}>
                      {item.away}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-center border-t border-slate-50 pt-6">
                  <Ionicons name="analytics" size={16} color="#fbbf24" />
                  <Text className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Full Match Analysis
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View className="mb-20 mt-12 px-6 pb-6">
          <TouchableOpacity
            onPress={() => Linking.openURL(`whatsapp://send?phone=256${WHATSAPP_NUMBER.slice(1)}`)}
            className="flex-row items-center justify-center rounded-[44px] bg-green-600 p-6 shadow-2xl shadow-green-600/30">
            <FontAwesome name="whatsapp" size={24} color="white" />
            <Text className="ml-4 text-xl font-black tracking-tighter text-white">
              Contact ElitePicks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onLongPress={() => router.push('/admin')}
            className="mt-10 items-center py-6 opacity-20">
            <Text className="text-[10px] font-black uppercase tracking-widest text-navy-950">
              ElitePicks Accurate Games • {new Date().getFullYear()}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}
