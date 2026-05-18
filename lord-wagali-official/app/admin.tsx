import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Share, Linking, ActivityIndicator } from 'react-native';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTips } from '@/context/TipsContext';

const DOWNLOAD_LINK = "https://www.mediafire.com/folder/lvoiimmjhifd9/AlphaWins";

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
      Alert.alert("Restricted", "Unauthorized access is strictly prohibited.");
    }
  };

  const grantVipAccess = async () => {
    const cleanId = userIdInput.trim().toUpperCase();
    if (!cleanId.startsWith('AW-')) {
      Alert.alert("Invalid Format", "Codes must start with AW- (e.g. AW-1234)");
      return;
    }

    await authorizeUserId(cleanId);

    const magicLink = `exp://exp.host/@modu/wavetips/--/vip?activate=${cleanId}`;
    const shareMessage = `✅ ALPHAWINS VIP ACTIVATED!\n\nYour account is now verified. Tap the link below to unlock your premium section:\n\n${magicLink}\n\n🏆 Good Luck!`;

    Alert.alert("Authorized", `ID ${cleanId} is now active.`, [
      { text: "Done", style: "cancel" },
      { text: "Share Link", onPress: () => Share.share({ message: shareMessage }) }
    ]);

    setUserIdInput('');
  };

  const handleResetSystem = () => {
    Alert.alert(
      "Reset Database",
      "Are you sure you want to clear all tips, history, subscriptions, and reset your client ID? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset Everything", 
          style: "destructive", 
          onPress: async () => {
            await resetAllData();
            setIsAdmin(false);
            Alert.alert("System Reset", "All data has been reverted to original defaults.");
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <Container className="bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#df8d38" />
        <Text className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-widest">Accessing Control Unit...</Text>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container keyboard className="bg-slate-50 justify-center px-8">
        <View className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-2xl items-center">
          <View className="bg-navy-950 w-24 h-24 rounded-full items-center justify-center mb-8 shadow-xl">
            <Ionicons name="lock-closed" size={48} color="white" />
          </View>
          <Text className="text-3xl font-black text-navy-950 tracking-tighter uppercase text-center">Admin Door</Text>
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 mb-10 text-center">ALPHAWINS SYSTEM CONTROL</Text>
          
          <TextInput 
            className="bg-slate-50 w-full p-6 rounded-3xl mb-10 text-center font-black text-3xl tracking-[12px] text-navy-950 border border-slate-200 shadow-inner"
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
             <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Return to App</Text>
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
            <Text className="ml-2 font-black text-navy-950 uppercase text-xs">Main Menu</Text>
          </TouchableOpacity>
          
          <Text className="text-3xl font-black text-navy-950 mb-2 tracking-tighter uppercase">Manage Access</Text>
          <Text className="text-slate-500 mb-8 font-medium">Add payment verified User IDs to the master list.</Text>
          
          <View className="bg-white p-8 rounded-[44px] border border-slate-200 shadow-lg mb-10">
            <TextInput 
              className="bg-slate-50 p-6 rounded-3xl mb-8 font-black text-navy-950 border border-slate-200 text-2xl text-center shadow-inner"
              placeholder="AW-XXXX"
              autoCapitalize="characters"
              value={userIdInput}
              onChangeText={setUserIdInput}
            />
            <Button title="GRANT VIP & SHARE" variant="primary" onPress={grantVipAccess} />
          </View>

          <Text className="text-navy-950 font-black mb-4 px-4 text-lg uppercase tracking-tighter">Live Subscribers</Text>
          <ScrollView className="max-h-60 px-2">
            {authorizedIds.length === 0 ? (
              <View className="bg-white p-6 rounded-[32px] border border-slate-100 items-center justify-center">
                <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center">No Active Subscribers</Text>
              </View>
            ) : (
              authorizedIds.map(id => (
                <View key={id} className="bg-white p-5 rounded-[32px] mb-3 flex-row justify-between items-center border border-slate-100 shadow-sm">
                  <View className="flex-1 mr-2">
                    <Text className="font-mono text-navy-950 font-black text-base">{id}</Text>
                    <Text className="text-[9px] text-green-600 font-bold uppercase tracking-widest">Active</Text>
                  </View>
                  <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => deauthorizeUserId(id)} className="bg-red-50 p-3 rounded-2xl mr-2 border border-red-100">
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => Share.share({ 
                        message: `Your AlphaWins VIP Access:\n\nexp://exp.host/@modu/wavetips/--/vip?activate=${id}` 
                      })}
                      className="bg-navy-950 p-3 rounded-2xl"
                    >
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
        <View className="flex-row justify-between items-center mb-10 px-2">
          <View>
            <Text className="text-4xl font-black text-navy-950 tracking-tighter">Control</Text>
            <Text className="text-gold-500 font-bold uppercase text-[10px] tracking-widest italic">Encrypted Session</Text>
          </View>
           <TouchableOpacity onPress={() => setIsAdmin(false)} className="bg-red-50 p-4 rounded-3xl">
              <Ionicons name="power" size={24} color="#ef4444" />
           </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap -mx-2">
          <AdminCard title="Edit Free Tips" icon="list" color="bg-navy-950" onPress={() => router.push('/manage-free')} />
          <AdminCard title="Edit VIP Tips" icon="star" color="bg-gold-500" onPress={() => router.push('/manage-vip-tips')} />
          <AdminCard title="Grant Access" icon="person-add" color="bg-white" border="border-slate-200" shadow="shadow-md" onPress={() => setView('vip-manage')} />
          <AdminCard title="Past Results" icon="time" color="bg-white" border="border-slate-200" shadow="shadow-md" onPress={() => router.push('/history')} />
        </View>
        
        <View className="mt-10 bg-navy-950 p-10 rounded-[48px] items-center shadow-2xl">
           <View className="bg-white/10 p-5 rounded-[28px] mb-4">
              <Ionicons name="globe-outline" size={32} color="#fbbf24" />
           </View>
           <Text className="text-gold-400 font-black text-2xl mb-2 tracking-tighter uppercase">Download Link</Text>
           <Text className="text-white/40 text-[10px] font-bold uppercase mb-10 px-4 tracking-widest">MediaFire Download Folder</Text>
           <Button title="COPY SITE URL" variant="primary" onPress={() => Share.share({ message: `Download AlphaWins (Professional Accurate Games): ${DOWNLOAD_LINK}` })} />
        </View>
        
        <TouchableOpacity onPress={handleResetSystem} className="mt-6 items-center py-4 mb-20">
          <Text className="text-red-500 font-black text-xs uppercase tracking-[3px] underline">Reset System Database</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
}

function AdminCard({ title, icon, color, border, shadow, onPress }: any) {
  const isWhite = color === 'bg-white';
  return (
    <TouchableOpacity onPress={onPress} className="w-1/2 p-2">
      <View className={`${color} ${border} ${shadow} p-6 rounded-[44px] items-center border h-48 justify-center shadow-lg`}>
        <View className={`p-4 rounded-[24px] mb-4 ${isWhite ? 'bg-navy-50' : 'bg-white/10'}`}>
          <Ionicons name={icon} size={28} color={isWhite ? "#001f3f" : color === 'bg-gold-500' ? 'black' : 'white'} />
        </View>
        <Text className={`${isWhite ? 'text-navy-950' : color === 'bg-gold-500' ? 'text-black' : 'text-white'} font-black text-center text-[10px] uppercase tracking-widest`}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
