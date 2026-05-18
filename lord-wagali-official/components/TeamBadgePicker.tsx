import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

interface Team {
  id: string;
  name: string;
}

const POPULAR_TEAMS: Team[] = [
  { id: '33', name: 'Manchester United' },
  { id: '40', name: 'Liverpool' },
  { id: '42', name: 'Arsenal' },
  { id: '49', name: 'Chelsea' },
  { id: '50', name: 'Manchester City' },
  { id: '47', name: 'Tottenham' },
  { id: '66', name: 'Aston Villa' },
  { id: '34', name: 'Newcastle' },
  { id: '48', name: 'West Ham' },
  { id: '45', name: 'Everton' },
  { id: '55', name: 'Brentford' },
  { id: '51', name: 'Brighton' },
  { id: '62', name: 'Sheffield United' },
  { id: '65', name: 'Nottingham Forest' },
  { id: '39', name: 'Wolves' },
  { id: '52', name: 'Crystal Palace' },
  { id: '63', name: 'Fulham' },
  { id: '35', name: 'Bournemouth' },
  { id: '44', name: 'Burnley' },
  { id: '46', name: 'Leicester City' },
  { id: '541', name: 'Real Madrid' },
  { id: '529', name: 'Barcelona' },
  { id: '530', name: 'Atletico Madrid' },
  { id: '536', name: 'Sevilla' },
  { id: '532', name: 'Valencia' },
  { id: '548', name: 'Real Sociedad' },
  { id: '543', name: 'Real Betis' },
  { id: '531', name: 'Athletic Bilbao' },
  { id: '533', name: 'Villarreal' },
  { id: '157', name: 'Bayern Munich' },
  { id: '165', name: 'Borussia Dortmund' },
  { id: '173', name: 'RB Leipzig' },
  { id: '168', name: 'Bayer Leverkusen' },
  { id: '169', name: 'Eintracht Frankfurt' },
  { id: '489', name: 'AC Milan' },
  { id: '505', name: 'Inter Milan' },
  { id: '496', name: 'Juventus' },
  { id: '497', name: 'AS Roma' },
  { id: '492', name: 'Napoli' },
  { id: '499', name: 'Atalanta' },
  { id: '500', name: 'Fiorentina' },
  { id: '85', name: 'Paris Saint-Germain' },
  { id: '81', name: 'Marseille' },
  { id: '80', name: 'Lyon' },
  { id: '91', name: 'Monaco' },
  { id: '79', name: 'Lille' },
  { id: '211', name: 'Benfica' },
  { id: '212', name: 'Porto' },
  { id: '228', name: 'Sporting CP' },
  { id: '194', name: 'Ajax' },
  { id: '197', name: 'PSV' },
  { id: '205', name: 'Galatasaray' },
  { id: '645', name: 'Fenerbahce' },
  { id: '192', name: 'Feyenoord' },
  { id: '573', name: 'Al-Hilal' },
  { id: '2278', name: 'Al-Nassr' },
  { id: '1', name: 'Belgium' },
  { id: '2', name: 'France' },
  { id: '10', name: 'England' },
  { id: '25', name: 'Germany' },
  { id: '27', name: 'Portugal' },
  { id: '9', name: 'Spain' },
  { id: '6', name: 'Brazil' },
  { id: '26', name: 'Argentina' },
];

interface TeamBadgePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (team: Team) => void;
}

export function TeamBadgePicker({ visible, onClose, onSelect }: TeamBadgePickerProps) {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? POPULAR_TEAMS.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      )
    : POPULAR_TEAMS;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-slate-50">
        <View className="flex-row items-center justify-between border-b border-slate-100 px-5 pb-4 pt-6">
          <Text className="text-lg font-bold text-navy-950">Select Team Badge</Text>
          <TouchableOpacity onPress={onClose} className="rounded-lg bg-slate-100 p-2">
            <Ionicons name="close" size={20} color="#334155" />
          </TouchableOpacity>
        </View>

        <View className="px-5 py-3">
          <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              className="ml-2 flex-1 py-3 text-sm text-navy-950"
              placeholder="Search team name..."
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color="#cbd5e1" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelect(item);
                onClose();
                setSearch('');
              }}
              activeOpacity={0.6}
              className="mb-2 flex-row items-center rounded-xl border border-slate-100 bg-white p-4">
              <Image
                source={`https://media.api-sports.io/football/teams/${item.id}.png`}
                className="mr-3 h-10 w-10"
                contentFit="contain"
              />
              <View className="flex-1">
                <Text className="text-sm font-bold text-navy-950">{item.name}</Text>
                <Text className="text-[10px] text-slate-400">ID: {item.id}</Text>
              </View>
              <Ionicons name="add-circle-outline" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="items-center py-10">
              <Text className="text-sm text-slate-400">No teams found</Text>
              <Text className="mt-1 text-xs text-slate-300">
                You can still type the ID manually
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
}
