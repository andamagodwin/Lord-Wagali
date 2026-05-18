import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Share,
  ActivityIndicator,
} from 'react-native';
import { Button } from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTips } from '@/context/TipsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DOWNLOAD_LINK } from '@/lib/constants';

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

    try {
      await authorizeUserId(cleanId);

      const magicLink = `exp://exp.host/@modu/wavetips/--/vip?activate=${cleanId}`;
      const shareMessage = `ElitePicks VIP ACTIVATED!\n\nYour account is now verified. Tap the link to unlock:\n\n${magicLink}`;

      Alert.alert('Authorized', `ID ${cleanId} is now active.`, [
        { text: 'Done', style: 'cancel' },
        { text: 'Share Link', onPress: () => Share.share({ message: shareMessage }) },
      ]);

      setUserIdInput('');
    } catch {
      return;
    }
  };

  const handleResetSystem = () => {
    Alert.alert('Reset Database', 'Clear all tips, history, and subscriptions?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset Everything',
        style: 'destructive',
        onPress: async () => {
          try {
            await resetAllData();
            setIsAdmin(false);
          } catch {
            return;
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#18152e" />
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View className="flex-1 bg-slate-50">
        <SafeAreaView edges={['top']} className="bg-[#18152e]">
          <View className="flex-row items-center px-5 pb-4 pt-3">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
            <Text className="text-lg font-black tracking-tight text-white">Admin</Text>
          </View>
        </SafeAreaView>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32 }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets>
          <View className="w-full items-center rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-navy-950">
              <Ionicons name="lock-closed" size={28} color="white" />
            </View>
            <Text className="mb-1 text-lg font-bold text-navy-950">Admin Access</Text>
            <Text className="mb-6 text-xs text-slate-400">Enter your PIN to continue</Text>

            <TextInput
              className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-2xl font-bold tracking-[8px] text-navy-950"
              placeholder="****"
              placeholderTextColor="#cbd5e1"
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              value={pass}
              onChangeText={setPass}
            />

            <Button title="UNLOCK" variant="primary" onPress={handleLogin} />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (view === 'vip-manage') {
    return (
      <View className="flex-1 bg-slate-50">
        <SafeAreaView edges={['top']} className="bg-[#18152e]">
          <View className="flex-row items-center px-5 pb-4 pt-3">
            <TouchableOpacity onPress={() => setView('main')} className="mr-3">
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
            <Text className="text-lg font-black tracking-tight text-white">Manage Access</Text>
          </View>
        </SafeAreaView>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets>
          <View className="px-5 pt-5">
            {/* Grant Access */}
            <View className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <Text className="mb-3 text-sm font-bold text-navy-950">Grant VIP Access</Text>
              <TextInput
                className="mb-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-base font-bold text-navy-950"
                placeholder="AW-XXXX"
                placeholderTextColor="#94a3b8"
                autoCapitalize="characters"
                value={userIdInput}
                onChangeText={setUserIdInput}
              />
              <Button title="GRANT & SHARE" variant="primary" onPress={grantVipAccess} />
            </View>

            {/* Subscriber List */}
            <Text className="mb-3 text-xs font-bold text-navy-950">
              Active Subscribers ({authorizedIds.length})
            </Text>
            {authorizedIds.length === 0 ? (
              <View className="items-center rounded-2xl border border-slate-100 bg-white p-6">
                <Text className="text-xs text-slate-400">No active subscribers</Text>
              </View>
            ) : (
              authorizedIds.map((id) => (
                <View
                  key={id}
                  className="mb-2 flex-row items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <View>
                    <Text className="text-sm font-bold text-navy-950">{id}</Text>
                    <Text className="text-[9px] font-medium text-green-600">Active</Text>
                  </View>
                  <View className="flex-row items-center gap-x-2">
                    <TouchableOpacity
                      onPress={() => deauthorizeUserId(id)}
                      className="rounded-lg bg-red-50 p-2">
                      <Ionicons name="trash-outline" size={16} color="#ef4444" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        Share.share({
                          message: `Your ElitePicks VIP Access:\n\nexp://exp.host/@modu/wavetips/--/vip?activate=${id}`,
                        })
                      }
                      className="rounded-lg bg-navy-950 p-2">
                      <Ionicons name="share-social" size={16} color="#fbbf24" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Main admin view
  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-[#18152e]">
        <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
          <View>
            <Text className="text-lg font-black tracking-tight text-white">Control Panel</Text>
            <Text className="text-[9px] font-medium uppercase tracking-widest text-gold-400">
              Admin Session
            </Text>
          </View>
          <TouchableOpacity onPress={() => setIsAdmin(false)} className="rounded-lg bg-red-500/20 p-2">
            <Ionicons name="power" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-5 pt-5">
          <View className="flex-row flex-wrap gap-3">
            <AdminCard
              title="Free Tips"
              icon="list"
              bg="bg-navy-950"
              onPress={() => router.push('/manage-free')}
            />
            <AdminCard
              title="VIP Tips"
              icon="star"
              bg="bg-gold-500"
              onPress={() => router.push('/manage-vip-tips')}
            />
            <AdminCard
              title="Access"
              icon="person-add"
              bg="bg-white"
              onPress={() => setView('vip-manage')}
            />
            <AdminCard
              title="Results"
              icon="time"
              bg="bg-white"
              onPress={() => router.push('/(tabs)/history')}
            />
          </View>

          {/* Download Link */}
          <View className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <Text className="mb-3 text-sm font-bold text-navy-950">Share Download Link</Text>
            <Button
              title="COPY & SHARE"
              variant="primary"
              onPress={() =>
                Share.share({
                  message: `Download ElitePicks: ${DOWNLOAD_LINK}`,
                })
              }
            />
          </View>

          {/* Reset */}
          <TouchableOpacity onPress={handleResetSystem} className="mt-8 items-center py-4">
            <Text className="text-xs font-bold text-red-500">Reset System Database</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function AdminCard({
  title,
  icon,
  bg,
  onPress,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  onPress: () => void;
}) {
  const isDark = bg === 'bg-navy-950' || bg === 'bg-gold-500';
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="w-[47%]">
      <View
        className={`${bg} h-32 items-center justify-center rounded-2xl ${isDark ? '' : 'border border-slate-100'} shadow-sm`}>
        <Ionicons
          name={icon}
          size={24}
          color={bg === 'bg-navy-950' ? 'white' : bg === 'bg-gold-500' ? '#18152e' : '#18152e'}
        />
        <Text
          className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${isDark ? (bg === 'bg-gold-500' ? 'text-navy-950' : 'text-white') : 'text-navy-950'}`}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
