import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Share,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTips } from '@/context/TipsContext';

const DOWNLOAD_LINK = 'https://www.mediafire.com/folder/lvoiimmjhifd9/AlphaWins';

export default function AdminDashboard() {
  const router = useRouter();
  const { authorizedIds, authorizeUserId, deauthorizeUserId, resetAllData, isLoading } = useTips();
  const [isAdmin, setIsAdmin] = useState(false);
  const [pass, setPass] = useState('');
  const [userIdInput, setUserIdInput] = useState('');
  const [view, setView] = useState('main');

  const handleLogin = () => {
    if (pass === '9090') {
      setIsAdmin(true);
      setPass('');
    } else {
      Alert.alert('Restricted', 'Unauthorized access is strictly prohibited.');
    }
  };

  const grantVipAccess = async () => {
    const cleanId = userIdInput.trim().toUpperCase();
    if (!cleanId.startsWith('AW-')) {
      Alert.alert('Invalid Format', 'Codes must start with AW- (e.g. AW-1234)');
      return;
    }

    await authorizeUserId(cleanId);

    const magicLink = `exp://exp.host/@modu/wavetips/--/vip?activate=${cleanId}`;
    const shareMessage = `✅ ALPHAWINS VIP ACTIVATED!\n\nYour account is now verified. Tap the link below to unlock your premium section:\n\n${magicLink}\n\n🏆 Good Luck!`;

    Alert.alert('Authorized', `ID ${cleanId} is now active.`, [
      { text: 'Done', style: 'cancel' },
      { text: 'Share Link', onPress: () => Share.share({ message: shareMessage }) },
    ]);

    setUserIdInput('');
  };

  const handleResetSystem = () => {
    Alert.alert(
      'Reset Database',
      'Are you sure you want to clear all tips, history, subscriptions, and reset your client ID? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            setIsAdmin(false);
            Alert.alert('System Reset', 'All data has been reverted to original defaults.');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <Container className="items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#df8d38" />
        <Text className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Accessing Control Unit...
        </Text>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container keyboard className="justify-center bg-slate-50 px-8">
        <View className="items-center rounded-[48px] border border-slate-200 bg-white p-10 shadow-2xl">
          <View className="mb-8 h-24 w-24 items-center justify-center rounded-full bg-navy-950 shadow-xl">
            <Ionicons name="lock-closed" size={48} color="white" />
          </View>
          <Text className="text-center text-3xl font-black uppercase tracking-tighter text-navy-950">
            Admin Door
          </Text>
          <Text className="mb-10 mt-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
            ALPHAWINS SYSTEM CONTROL
          </Text>

          <TextInput
            className="shadow-inner mb-10 w-full rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-3xl font-black tracking-[12px] text-navy-950"
            placeholder="****"
            placeholderTextColor="#cbd5e1"
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
            value={pass}
            onChangeText={setPass}
          />

          <Button title="UNLOCK SYSTEM" variant="primary" onPress={handleLogin} />

          <TouchableOpacity onPress={() => router.back()} className="mt-8">
            <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Return to App
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  if (view === 'vip-manage') {
    return (
      <Container keyboard className="bg-slate-50">
        <View className="p-6">
          <TouchableOpacity onPress={() => setView('main')} className="mb-6 flex-row items-center">
            <Ionicons name="arrow-back" size={20} color="#001f3f" />
            <Text className="ml-2 text-xs font-black uppercase text-navy-950">Main Menu</Text>
          </TouchableOpacity>

          <Text className="mb-2 text-3xl font-black uppercase tracking-tighter text-navy-950">
            Manage Access
          </Text>
          <Text className="mb-8 font-medium text-slate-500">
            Add payment verified User IDs to the master list.
          </Text>

          <View className="mb-10 rounded-[44px] border border-slate-200 bg-white p-8 shadow-lg">
            <TextInput
              className="shadow-inner mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-2xl font-black text-navy-950"
              placeholder="AW-XXXX"
              autoCapitalize="characters"
              value={userIdInput}
              onChangeText={setUserIdInput}
            />
            <Button title="GRANT VIP & SHARE" variant="primary" onPress={grantVipAccess} />
          </View>

          <Text className="mb-4 px-4 text-lg font-black uppercase tracking-tighter text-navy-950">
            Live Subscribers
          </Text>
          <ScrollView className="max-h-60 px-2">
            {authorizedIds.length === 0 ? (
              <View className="items-center justify-center rounded-[32px] border border-slate-100 bg-white p-6">
                <Text className="text-center text-xs font-bold uppercase tracking-widest text-slate-400">
                  No Active Subscribers
                </Text>
              </View>
            ) : (
              authorizedIds.map((id) => (
                <View
                  key={id}
                  className="mb-3 flex-row items-center justify-between rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm">
                  <View className="mr-2 flex-1">
                    <Text className="font-mono text-base font-black text-navy-950">{id}</Text>
                    <Text className="text-[9px] font-bold uppercase tracking-widest text-green-600">
                      Active
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => deauthorizeUserId(id)}
                      className="mr-2 rounded-2xl border border-red-100 bg-red-50 p-3">
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        Share.share({
                          message: `Your AlphaWins VIP Access:\n\nexp://exp.host/@modu/wavetips/--/vip?activate=${id}`,
                        })
                      }
                      className="rounded-2xl bg-navy-950 p-3">
                      <Ionicons name="share-social" size={18} color="#fbbf24" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Container>
    );
  }

  return (
    <Container className="bg-slate-50">
      <ScrollView className="flex-1 px-4 pt-6">
        <View className="mb-10 flex-row items-center justify-between px-2">
          <View>
            <Text className="text-4xl font-black tracking-tighter text-navy-950">Control</Text>
            <Text className="text-[10px] font-bold uppercase italic tracking-widest text-gold-500">
              Encrypted Session
            </Text>
          </View>
          <TouchableOpacity onPress={() => setIsAdmin(false)} className="rounded-3xl bg-red-50 p-4">
            <Ionicons name="power" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View className="-mx-2 flex-row flex-wrap">
          <AdminCard
            title="Edit Free Tips"
            icon="list"
            color="bg-navy-950"
            onPress={() => router.push('/manage-free')}
          />
          <AdminCard
            title="Edit VIP Tips"
            icon="star"
            color="bg-gold-500"
            onPress={() => router.push('/manage-vip-tips')}
          />
          <AdminCard
            title="Grant Access"
            icon="person-add"
            color="bg-white"
            border="border-slate-200"
            shadow="shadow-md"
            onPress={() => setView('vip-manage')}
          />
          <AdminCard
            title="Past Results"
            icon="time"
            color="bg-white"
            border="border-slate-200"
            shadow="shadow-md"
            onPress={() => router.push('/history')}
          />
        </View>

        <View className="mt-10 items-center rounded-[48px] bg-navy-950 p-10 shadow-2xl">
          <View className="mb-4 rounded-[28px] bg-white/10 p-5">
            <Ionicons name="globe-outline" size={32} color="#fbbf24" />
          </View>
          <Text className="mb-2 text-2xl font-black uppercase tracking-tighter text-gold-400">
            Download Link
          </Text>
          <Text className="mb-10 px-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
            MediaFire Download Folder
          </Text>
          <Button
            title="COPY SITE URL"
            variant="primary"
            onPress={() =>
              Share.share({
                message: `Download AlphaWins (Professional Accurate Games): ${DOWNLOAD_LINK}`,
              })
            }
          />
        </View>

        <TouchableOpacity onPress={handleResetSystem} className="mb-20 mt-6 items-center py-4">
          <Text className="text-xs font-black uppercase tracking-[3px] text-red-500 underline">
            Reset System Database
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
}

function AdminCard({ title, icon, color, border, shadow, onPress }: any) {
  const isWhite = color === 'bg-white';
  return (
    <TouchableOpacity onPress={onPress} className="w-1/2 p-2">
      <View
        className={`${color} ${border} ${shadow} h-48 items-center justify-center rounded-[44px] border p-6 shadow-lg`}>
        <View className={`mb-4 rounded-[24px] p-4 ${isWhite ? 'bg-navy-50' : 'bg-white/10'}`}>
          <Ionicons
            name={icon}
            size={28}
            color={isWhite ? '#001f3f' : color === 'bg-gold-500' ? 'black' : 'white'}
          />
        </View>
        <Text
          className={`${isWhite ? 'text-navy-950' : color === 'bg-gold-500' ? 'text-black' : 'text-white'} text-center text-[10px] font-black uppercase tracking-widest`}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
