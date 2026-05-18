import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Stat {
  label: string;
  value: string;
}

export interface FormGuide {
  home: string[];
  away: string[];
}

export interface H2HRecord {
  date: string;
  score: string;
  result: string;
}

export interface Tip {
  id: string;
  home: string;
  away: string;
  homeLogo: string;
  awayLogo: string;
  tip: string;
  odds: string;
  prob: string;
  league: string;
  time: string;
  summary?: string;
  winProb?: {
    home: number;
    draw: number;
    away: number;
  };
  stats?: Stat[];
  form?: FormGuide;
  h2h?: H2HRecord[];
}

export interface HistoryTip extends Omit<Tip, 'time'> {
  status: 'won' | 'lost';
  date: string;
  settledAt: string;
}

interface TipsContextType {
  tips: Tip[];
  vipTips: Tip[];
  history: HistoryTip[];
  authorizedIds: string[];
  clientUserId: string;
  clientIsVip: boolean;
  isLoading: boolean;
  addFreeTip: (tip: Omit<Tip, 'id'>) => Promise<void>;
  removeFreeTip: (id: string) => Promise<void>;
  addVipTip: (tip: Omit<Tip, 'id'>) => Promise<void>;
  removeVipTip: (id: string) => Promise<void>;
  settleTip: (id: string, isVip: boolean, status: 'won' | 'lost') => Promise<void>;
  authorizeUserId: (userId: string) => Promise<void>;
  deauthorizeUserId: (userId: string) => Promise<void>;
  activateVipOnClient: (userIdInput: string) => Promise<boolean>;
  resetAllData: () => Promise<void>;
}

const TipsContext = createContext<TipsContextType | undefined>(undefined);

// Initial Mock Predictions
const INITIAL_FREE_TIPS: Tip[] = [
  {
    id: '1',
    home: 'Arsenal',
    away: 'Liverpool',
    homeLogo: '42',
    awayLogo: '40',
    tip: 'BTTS',
    odds: '1.65',
    prob: '85%',
    league: 'Premier League',
    time: '19:30',
    summary: 'Arsenal is currently the most consistent team in the league. At the Emirates Stadium, they have a 95% scoring record this season. Liverpool is suffering from a dip in midfield control due to key injuries. Statistically, Arsenal has a 65% chance of taking all three points today. Our algorithms favor a Home Win with both teams getting on the scoresheet.',
    winProb: { home: 65, draw: 15, away: 20 },
    stats: [
      { label: 'Attack Index', value: '92%' },
      { label: 'Defensive Unit', value: '88%' },
      { label: 'Home Factor', value: '95%' }
    ],
    form: {
      home: ['W', 'W', 'W', 'D', 'W'],
      away: ['W', 'D', 'W', 'L', 'W']
    },
    h2h: [
      { date: 'Feb 2024', score: '3-1', result: 'W' },
      { date: 'Dec 2023', score: '1-1', result: 'D' },
      { date: 'Apr 2023', score: '2-2', result: 'D' }
    ]
  },
  {
    id: '2',
    home: 'Real Madrid',
    away: 'Valencia',
    homeLogo: '541',
    awayLogo: '532',
    tip: 'Home Win',
    odds: '1.45',
    prob: '92%',
    league: 'La Liga',
    time: '21:00',
    summary: 'Real Madrid enters this match in spectacular home form, having won their last six games at the Bernabéu. Valencia is struggling defensively, conceding an average of 2.1 goals per away match. An aggressive start from Los Blancos is anticipated, rendering a straightforward home victory the most likely outcome.',
    winProb: { home: 75, draw: 15, away: 10 },
    stats: [
      { label: 'Attack Index', value: '95%' },
      { label: 'Defensive Unit', value: '90%' },
      { label: 'Home Factor', value: '98%' }
    ],
    form: {
      home: ['W', 'W', 'W', 'W', 'D'],
      away: ['L', 'D', 'L', 'W', 'L']
    },
    h2h: [
      { date: 'Nov 2023', score: '5-1', result: 'W' },
      { date: 'May 2023', score: '0-1', result: 'L' },
      { date: 'Feb 2023', score: '2-0', result: 'W' }
    ]
  }
];

const INITIAL_VIP_TIPS: Tip[] = [
  {
    id: 'vip-1',
    home: 'Real Madrid',
    away: 'Barcelona',
    homeLogo: '541',
    awayLogo: '529',
    tip: 'Home Win',
    odds: '2.10',
    prob: '95%',
    league: 'La Liga',
    time: '21:00',
    summary: 'The ultimate El Clásico under premium conditions. Real Madrid is currently leading by 8 points and holds a flawless record at home. Barcelona has defensive inconsistencies that Vinícius and Bellingham are set to exploit. Our analytics indicate a highly probable home win.',
    winProb: { home: 58, draw: 22, away: 20 },
    stats: [
      { label: 'Attack Index', value: '96%' },
      { label: 'Defensive Unit', value: '91%' },
      { label: 'Home Factor', value: '97%' }
    ],
    form: {
      home: ['W', 'W', 'W', 'D', 'W'],
      away: ['W', 'D', 'W', 'W', 'L']
    },
    h2h: [
      { date: 'Jan 2024', score: '4-1', result: 'W' },
      { date: 'Oct 2023', score: '2-1', result: 'W' },
      { date: 'Jul 2023', score: '0-3', result: 'L' }
    ]
  },
  {
    id: 'vip-2',
    home: 'Liverpool',
    away: 'Arsenal',
    homeLogo: '40',
    awayLogo: '42',
    tip: 'BTTS',
    odds: '1.65',
    prob: '91%',
    league: 'Premier League',
    time: '19:30',
    summary: 'Two powerhouse offenses collide at Anfield. Liverpool scores on average 2.4 goals at home, while Arsenal holds the best away scoring record. Midfield battles will be fluid and both teams are highly expected to find the net.',
    winProb: { home: 40, draw: 25, away: 35 },
    stats: [
      { label: 'Attack Index', value: '94%' },
      { label: 'Defensive Unit', value: '86%' },
      { label: 'Home Factor', value: '93%' }
    ],
    form: {
      home: ['W', 'D', 'W', 'L', 'W'],
      away: ['W', 'W', 'W', 'D', 'W']
    },
    h2h: [
      { date: 'Feb 2024', score: '1-3', result: 'L' },
      { date: 'Dec 2023', score: '1-1', result: 'D' },
      { date: 'Apr 2023', score: '2-2', result: 'D' }
    ]
  },
  {
    id: 'vip-3',
    home: 'Man City',
    away: 'Bayern',
    homeLogo: '50',
    awayLogo: '157',
    tip: 'Over 2.5 Goals',
    odds: '1.85',
    prob: '89%',
    league: 'Champions League',
    time: '22:00',
    summary: 'A legendary European night setup. Manchester City and Bayern Munich are the highest-scoring teams in the competition. Expect an open tactical affair with numerous chances. Our dynamic model heavily supports the Over 2.5 market.',
    winProb: { home: 55, draw: 20, away: 25 },
    stats: [
      { label: 'Attack Index', value: '98%' },
      { label: 'Defensive Unit', value: '85%' },
      { label: 'Home Factor', value: '96%' }
    ],
    form: {
      home: ['W', 'W', 'D', 'W', 'W'],
      away: ['W', 'L', 'W', 'W', 'D']
    },
    h2h: [
      { date: 'Jul 2023', score: '2-1', result: 'W' },
      { date: 'Apr 2023', score: '1-1', result: 'D' },
      { date: 'Apr 2023', score: '3-0', result: 'W' }
    ]
  }
];

const INITIAL_HISTORY: HistoryTip[] = [
  {
    id: '101',
    home: 'Arsenal',
    away: 'Liverpool',
    homeLogo: '42',
    awayLogo: '40',
    tip: 'BTTS',
    odds: '1.65',
    prob: '85%',
    league: 'EPL',
    summary: 'Arsenal and Liverpool had a highly offensive fixture, ending in a solid 2-1 outcome which settled our BTTS tip successfully.',
    winProb: { home: 65, draw: 15, away: 20 },
    stats: [],
    form: { home: [], away: [] },
    h2h: [],
    status: 'won',
    date: 'Yesterday',
    settledAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '102',
    home: 'Real Madrid',
    away: 'Valencia',
    homeLogo: '541',
    awayLogo: '532',
    tip: 'Home Win',
    odds: '1.45',
    prob: '92%',
    league: 'La Liga',
    summary: 'Real Madrid fully dominated Valencia from the start, claiming a clear 3-0 home victory and confirming our recommendation.',
    winProb: { home: 75, draw: 15, away: 10 },
    stats: [],
    form: { home: [], away: [] },
    h2h: [],
    status: 'won',
    date: 'Yesterday',
    settledAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export function TipsProvider({ children }: { children: React.ReactNode }) {
  const [tips, setTips] = useState<Tip[]>(INITIAL_FREE_TIPS);
  const [vipTips, setVipTips] = useState<Tip[]>(INITIAL_VIP_TIPS);
  const [history, setHistory] = useState<HistoryTip[]>(INITIAL_HISTORY);
  const [authorizedIds, setAuthorizedIds] = useState<string[]>(['AW-9090']);
  const [clientUserId, setClientUserId] = useState<string>('');
  const [clientIsVip, setClientIsVip] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load persistent states on mount
  useEffect(() => {
    async function loadData() {
      try {
        const storedTips = await AsyncStorage.getItem('@AW_free_tips');
        if (storedTips) {
          setTips(JSON.parse(storedTips));
        } else {
          await AsyncStorage.setItem('@AW_free_tips', JSON.stringify(INITIAL_FREE_TIPS));
        }
      } catch (e) {
        console.warn("Failed to load/initialize @AW_free_tips storage", e);
      }

      try {
        const storedVipTips = await AsyncStorage.getItem('@AW_vip_tips');
        if (storedVipTips) {
          setVipTips(JSON.parse(storedVipTips));
        } else {
          await AsyncStorage.setItem('@AW_vip_tips', JSON.stringify(INITIAL_VIP_TIPS));
        }
      } catch (e) {
        console.warn("Failed to load/initialize @AW_vip_tips storage", e);
      }

      try {
        const storedHistory = await AsyncStorage.getItem('@AW_history');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        } else {
          await AsyncStorage.setItem('@AW_history', JSON.stringify(INITIAL_HISTORY));
        }
      } catch (e) {
        console.warn("Failed to load/initialize @AW_history storage", e);
      }

      try {
        const storedAuthIds = await AsyncStorage.getItem('@AW_authorized_ids');
        if (storedAuthIds) {
          setAuthorizedIds(JSON.parse(storedAuthIds));
        } else {
          await AsyncStorage.setItem('@AW_authorized_ids', JSON.stringify(['AW-9090']));
        }
      } catch (e) {
        console.warn("Failed to load/initialize @AW_authorized_ids storage", e);
      }

      // Generate stable client ID if not exists
      let generatedId = '';
      try {
        const storedUserId = await AsyncStorage.getItem('@AW_client_user_id');
        if (storedUserId) {
          setClientUserId(storedUserId);
        } else {
          generatedId = `AW-${Math.floor(1000 + Math.random() * 9000)}`;
          setClientUserId(generatedId);
          await AsyncStorage.setItem('@AW_client_user_id', generatedId);
        }
      } catch (e) {
        console.warn("Failed to load/generate client user ID storage", e);
        if (!generatedId) {
          generatedId = `AW-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        setClientUserId(generatedId);
      }

      try {
        const storedIsVip = await AsyncStorage.getItem('@AW_client_is_vip');
        if (storedIsVip) {
          setClientIsVip(JSON.parse(storedIsVip));
        }
      } catch (e) {
        console.warn("Failed to load VIP membership status storage", e);
      }

      setIsLoading(false);
    }
    loadData();
  }, []);

  // Save utility wrappers
  const saveFreeTips = async (newTips: Tip[]) => {
    setTips(newTips);
    try {
      await AsyncStorage.setItem('@AW_free_tips', JSON.stringify(newTips));
    } catch (e) {
      console.warn("Failed to persist @AW_free_tips", e);
    }
  };

  const saveVipTips = async (newVipTips: Tip[]) => {
    setVipTips(newVipTips);
    try {
      await AsyncStorage.setItem('@AW_vip_tips', JSON.stringify(newVipTips));
    } catch (e) {
      console.warn("Failed to persist @AW_vip_tips", e);
    }
  };

  const saveHistory = async (newHistory: HistoryTip[]) => {
    setHistory(newHistory);
    try {
      await AsyncStorage.setItem('@AW_history', JSON.stringify(newHistory));
    } catch (e) {
      console.warn("Failed to persist @AW_history", e);
    }
  };

  const saveAuthorizedIds = async (newAuthIds: string[]) => {
    setAuthorizedIds(newAuthIds);
    try {
      await AsyncStorage.setItem('@AW_authorized_ids', JSON.stringify(newAuthIds));
    } catch (e) {
      console.warn("Failed to persist @AW_authorized_ids", e);
    }
  };

  const addFreeTip = async (tip: Omit<Tip, 'id'>) => {
    const newTip: Tip = {
      ...tip,
      id: Date.now().toString(),
      homeLogo: tip.homeLogo || '42',
      awayLogo: tip.awayLogo || '40',
      winProb: tip.winProb || { home: 45, draw: 30, away: 25 },
      stats: tip.stats || [
        { label: 'Attack Index', value: '75%' },
        { label: 'Defensive Unit', value: '70%' },
        { label: 'Home Factor', value: '78%' }
      ],
      form: tip.form || {
        home: ['W', 'D', 'W', 'L', 'W'],
        away: ['L', 'W', 'D', 'W', 'L']
      },
      h2h: tip.h2h || [
        { date: 'Recent', score: '1-0', result: 'W' }
      ]
    };
    const updated = [...tips, newTip];
    await saveFreeTips(updated);
  };

  const removeFreeTip = async (id: string) => {
    const updated = tips.filter(t => t.id !== id);
    await saveFreeTips(updated);
  };

  const addVipTip = async (tip: Omit<Tip, 'id'>) => {
    const newTip: Tip = {
      ...tip,
      id: `vip-${Date.now()}`,
      homeLogo: tip.homeLogo || '42',
      awayLogo: tip.awayLogo || '40',
      winProb: tip.winProb || { home: 55, draw: 25, away: 20 },
      stats: tip.stats || [
        { label: 'Attack Index', value: '88%' },
        { label: 'Defensive Unit', value: '85%' },
        { label: 'Home Factor', value: '90%' }
      ],
      form: tip.form || {
        home: ['W', 'W', 'W', 'D', 'W'],
        away: ['W', 'D', 'W', 'L', 'W']
      },
      h2h: tip.h2h || [
        { date: 'Recent', score: '2-1', result: 'W' }
      ]
    };
    const updated = [...vipTips, newTip];
    await saveVipTips(updated);
  };

  const removeVipTip = async (id: string) => {
    const updated = vipTips.filter(t => t.id !== id);
    await saveVipTips(updated);
  };

  const settleTip = async (id: string, isVip: boolean, status: 'won' | 'lost') => {
    const targetTip = isVip
      ? vipTips.find(t => t.id === id)
      : tips.find(t => t.id === id);

    if (!targetTip) return;

    // Remove from active list
    if (isVip) {
      await saveVipTips(vipTips.filter(t => t.id !== id));
    } else {
      await saveFreeTips(tips.filter(t => t.id !== id));
    }

    // Append to history list
    const historyItem: HistoryTip = {
      ...targetTip,
      status,
      date: 'Today',
      settledAt: new Date().toISOString()
    };

    const updatedHistory = [historyItem, ...history];
    await saveHistory(updatedHistory);
  };

  const authorizeUserId = async (userId: string) => {
    const cleanId = userId.trim().toUpperCase();
    if (!authorizedIds.includes(cleanId)) {
      const updated = [...authorizedIds, cleanId];
      await saveAuthorizedIds(updated);
      
      // If this client generates this exact ID, unlock VIP immediately
      if (clientUserId.toUpperCase() === cleanId) {
        setClientIsVip(true);
        await AsyncStorage.setItem('@AW_client_is_vip', JSON.stringify(true));
      }
    }
  };

  const deauthorizeUserId = async (userId: string) => {
    const cleanId = userId.trim().toUpperCase();
    const updated = authorizedIds.filter(id => id !== cleanId);
    await saveAuthorizedIds(updated);

    if (clientUserId.toUpperCase() === cleanId) {
      setClientIsVip(false);
      await AsyncStorage.setItem('@AW_client_is_vip', JSON.stringify(false));
    }
  };

  const activateVipOnClient = async (userIdInput: string) => {
    const cleanId = userIdInput.trim().toUpperCase();
    if (authorizedIds.includes(cleanId)) {
      setClientIsVip(true);
      await AsyncStorage.setItem('@AW_client_is_vip', JSON.stringify(true));
      return true;
    }
    return false;
  };

  const resetAllData = async () => {
    await AsyncStorage.clear();
    setTips(INITIAL_FREE_TIPS);
    setVipTips(INITIAL_VIP_TIPS);
    setHistory(INITIAL_HISTORY);
    setAuthorizedIds(['AW-9090']);
    const newId = `AW-${Math.floor(1000 + Math.random() * 9000)}`;
    setClientUserId(newId);
    setClientIsVip(false);
    await AsyncStorage.setItem('@AW_free_tips', JSON.stringify(INITIAL_FREE_TIPS));
    await AsyncStorage.setItem('@AW_vip_tips', JSON.stringify(INITIAL_VIP_TIPS));
    await AsyncStorage.setItem('@AW_history', JSON.stringify(INITIAL_HISTORY));
    await AsyncStorage.setItem('@AW_authorized_ids', JSON.stringify(['AW-9090']));
    await AsyncStorage.setItem('@AW_client_user_id', newId);
    await AsyncStorage.setItem('@AW_client_is_vip', JSON.stringify(false));
  };

  return (
    <TipsContext.Provider
      value={{
        tips,
        vipTips,
        history,
        authorizedIds,
        clientUserId,
        clientIsVip,
        isLoading,
        addFreeTip,
        removeFreeTip,
        addVipTip,
        removeVipTip,
        settleTip,
        authorizeUserId,
        deauthorizeUserId,
        activateVipOnClient,
        resetAllData,
      }}
    >
      {children}
    </TipsContext.Provider>
  );
}

export function useTips() {
  const context = useContext(TipsContext);
  if (!context) {
    throw new Error('useTips must be used within a TipsProvider');
  }
  return context;
}
