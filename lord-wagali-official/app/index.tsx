import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share, Linking, ActivityIndicator } from 'react-native';
import { Container } from '@/components/Container';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useTips } from '@/context/TipsContext';

const DOWNLOAD_LINK = "https://www.mediafire.com/folder/lvoiimmjhifd9/AlphaWins";

export const getTeamLogo = (logo: string) => {
  if (!logo) return "https://media.api-sports.io/football/teams/0.png";
  if (logo.startsWith('http')) return logo;
  // If it's just team name or non-numeric, try to fallback safely
  if (isNaN(Number(logo))) return `https://media.api-sports.io/football/teams/0.png`;
  return `https://media.api-sports.io/football/teams/${logo}.png`;
};

export default function Home() {
  const router = useRouter();
  const { tips, isLoading } = useTips();
  const WHATSAPP_NUMBER = '0703354991';

  const shareApp = () => Share.share({ 
    message: `Join AlphaWins for daily accurate games! 🏆⚽ Download the app here: ${DOWNLOAD_LINK}` 
  });

  return (
    <Container className="bg-slate-50">
      {/* Premium Header */}
      <View className="bg-navy-950 pt-12 pb-10 px-6 rounded-b-[48px] shadow-2xl border-b border-navy-900">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity 
              activeOpacity={1}
              onLongPress={() => router.push('/admin')}
              className="w-18 h-18 rounded-[24px] border-2 border-gold-400 bg-zinc-800 overflow-hidden shadow-2xl"
            >
               <Image 
                 source={require("@/assets/img_1778617166715_015o.jpg")} 
                 className="w-full h-full"
                 contentFit="cover"
               />
            </TouchableOpacity>
            <View className="ml-4">
              <Text className="text-white text-3xl font-black tracking-tighter uppercase">AlphaWins</Text>
              <View className="bg-gold-500 self-start px-2 py-0.5 rounded-lg mt-1">
                <Text className="text-navy-950 text-[9px] font-black uppercase tracking-widest italic">Official App</Text>
              </View>
            </View>
          </View>

          <View className="flex-row">
            <TouchableOpacity 
              onPress={shareApp} 
              className="w-11 h-11 bg-white/10 rounded-2xl items-center justify-center mr-2 border border-white/10"
            >
              <Ionicons name="share-social-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.push('/settings')} 
              className="w-11 h-11 bg-white/10 rounded-2xl items-center justify-center border border-white/10"
            >
              <Ionicons name="options-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* VIP Access Banner */}
        <TouchableOpacity 
          onPress={() => router.push('/vip')}
          className="mx-6 mt-6 bg-gold-500 p-8 rounded-[40px] shadow-2xl flex-row items-center justify-between border-4 border-white/20"
        >
          <View className="flex-1">
            <Text className="text-navy-950 font-black text-2xl uppercase tracking-tighter">VIP ACCURATE</Text>
            <Text className="text-navy-900 text-[11px] font-bold opacity-80 uppercase tracking-widest mt-1">Unlock Elite Winning Games</Text>
          </View>
          <View className="bg-navy-950 p-4 rounded-3xl shadow-lg">
            <Ionicons name="lock-open" size={28} color="#fbbf24" />
          </View>
        </TouchableOpacity>

        <View className="px-6 mt-10">
          <View className="flex-row justify-between items-center mb-6 px-1">
            <Text className="text-3xl font-black tracking-tighter text-navy-950 uppercase">Free Tips</Text>
            <Link href="/history" asChild><TouchableOpacity><Text className="text-coral-500 font-black text-xs tracking-widest">RESULTS →</Text></TouchableOpacity></Link>
          </View>

          {isLoading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#df8d38" />
              <Text className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-widest">Updating Predictions...</Text>
            </View>
          ) : tips.length === 0 ? (
            <View className="bg-white p-10 rounded-[44px] mb-6 border border-slate-200 shadow-xl items-center justify-center py-16">
              <Ionicons name="football-outline" size={48} color="#cbd5e1" />
              <Text className="text-navy-950 font-black text-lg mt-4 uppercase tracking-tighter">No Active Tips</Text>
              <Text className="text-slate-400 text-xs font-medium mt-1 text-center">We are analyzing today's fixtures. Check back shortly!</Text>
            </View>
          ) : (
            tips.map((item) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => router.push({ pathname: "/analysis/[id]", params: { id: item.id } })}
                className="bg-white p-6 rounded-[44px] mb-6 border border-slate-200 shadow-xl"
              >
                <View className="flex-row justify-between items-center mb-6 px-2">
                  <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.league || 'Today'} • {item.time || 'Football'}</Text>
                  <View className="bg-green-100 px-3 py-1 rounded-full border border-green-200">
                    <Text className="text-green-700 text-[9px] font-black uppercase">{item.prob || '85%'} ACCURATE</Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between items-center px-2 mb-6">
                  <View className="items-center flex-1">
                    <Image source={getTeamLogo(item.homeLogo)} className="w-16 h-16 mb-2" contentFit="contain" />
                    <Text className="text-center text-[11px] font-black text-navy-950 uppercase" numberOfLines={1}>{item.home}</Text>
                  </View>
                  
                  <View className="flex-1 items-center px-4">
                    <View className="bg-coral-500 w-full py-3 rounded-3xl shadow-xl shadow-coral-500/40 items-center border border-white/20">
                      <Text className="text-white font-black text-xs uppercase tracking-tighter">{item.tip}</Text>
                    </View>
                    <Text className="text-slate-400 text-[10px] mt-2 font-black tracking-widest">ODDS {item.odds}</Text>
                  </View>
  
                  <View className="items-center flex-1">
                    <Image source={getTeamLogo(item.awayLogo)} className="w-16 h-16 mb-2" contentFit="contain" />
                    <Text className="text-center text-[11px] font-black text-navy-950 uppercase" numberOfLines={1}>{item.away}</Text>
                  </View>
                </View>
                
                <View className="pt-6 border-t border-slate-50 flex-row items-center justify-center">
                   <Ionicons name="analytics" size={16} color="#fbbf24" />
                   <Text className="text-slate-500 text-[10px] font-black ml-2 uppercase tracking-widest">Full Match Analysis</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View className="mt-12 mb-20 px-6 pb-20">
          <TouchableOpacity 
            onPress={() => Linking.openURL(`whatsapp://send?phone=256${WHATSAPP_NUMBER.slice(1)}`)}
            className="bg-green-600 p-6 rounded-[44px] flex-row items-center justify-center shadow-2xl shadow-green-600/30"
          >
            <FontAwesome name="whatsapp" size={24} color="white" />
            <Text className="text-white font-black ml-4 text-xl tracking-tighter">Contact AlphaWins</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onLongPress={() => router.push('/admin')}
            className="mt-10 items-center py-6 opacity-20"
          >
            <Text className="text-navy-950 text-[10px] font-black tracking-widest uppercase">
              © AlphaWins Accurate Games • {new Date().getFullYear()}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}
