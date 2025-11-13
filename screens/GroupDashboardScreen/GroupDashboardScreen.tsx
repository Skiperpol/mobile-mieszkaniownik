import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { useAppStore } from '@/hooks/useAppStore';
import { useRouter } from 'expo-router';
import { styles } from './GroupDashboardScreen.style';

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  backgroundColor: string;
  onPress: () => void;
  statusDotColor?: string;
}

export default function GroupDashboardScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);
  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const expenses = useAppStore((state) => state.expenses);
  const shoppingList = useAppStore((state) => state.shoppingList);
  const tasks = useAppStore((state) => state.tasks);
  const dishwasherStatus = useAppStore((state) => state.dishwasherStatus);
  const bathroomReservations = useAppStore((state) => state.bathroomReservations);

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  const activeShoppingItems = useMemo(() => shoppingList.filter((item) => !item.purchased).length, [shoppingList]);
  const pendingTasks = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);

  const quickActions: QuickAction[] = useMemo(() => {
    const dishwasherStatusValue = dishwasherStatus?.status ?? 'empty';
    let dishwasherBackgroundColor = '#fef3c7';
    let dishwasherIconColor = '#d97706';
    let dishwasherStatusDotColor: string | undefined;
    
    switch (dishwasherStatusValue) {
      case 'empty':
      case 'clean':
        // Zielony - gdy jest pusta
        dishwasherBackgroundColor = '#dcfce7';
        dishwasherIconColor = '#047857';
        dishwasherStatusDotColor = '#16a34a';
        break;
      case 'loading':
        // Pomarańczowy - gdy są w niej naczynia
        dishwasherBackgroundColor = '#fed7aa';
        dishwasherIconColor = '#ea580c';
        dishwasherStatusDotColor = '#f97316';
        break;
      case 'running':
        // Czerwony - gdy się myje
        dishwasherBackgroundColor = '#fee2e2';
        dishwasherIconColor = '#dc2626';
        dishwasherStatusDotColor = '#dc2626';
        break;
    }

    // Get bathroom status
    const isBathroomOccupied = bathroomReservations.some((res) => {
      const start = new Date(res.startTime);
      const end = new Date(res.endTime);
      return res.occupied && start <= currentTime && end >= currentTime;
    });
    const bathroomStatusDotColor = isBathroomOccupied ? '#dc2626' : '#16a34a';

    return [
      {
        id: 'expenses',
        title: 'Skarbonka',
        subtitle: `${totalExpenses.toFixed(2)} zł wydano`,
        backgroundColor: '#dcfce7',
        icon: <Ionicons name="wallet" size={24} color="#047857" />,
        onPress: () => router.push('/(group)/expenses'),
      },
      {
        id: 'shopping',
        title: 'Lista zakupów',
        subtitle: `${activeShoppingItems} produktów`,
        backgroundColor: '#dbeafe',
        icon: <Ionicons name="cart" size={24} color="#1d4ed8" />,
        onPress: () => router.push('/(group)/shopping-list'),
      },
      {
        id: 'tasks',
        title: 'Zadania',
        subtitle: `${pendingTasks} do zrobienia`,
        backgroundColor: '#ede9fe',
        icon: <Ionicons name="checkmark-done" size={24} color="#6d28d9" />,
        onPress: () => router.push('/(group)/tasks'),
      },
      {
        id: 'calendar',
        title: 'Kalendarz',
        subtitle: 'Wydarzenia',
        backgroundColor: '#fee2e2',
        icon: <Ionicons name="calendar" size={24} color="#b91c1c" />,
        onPress: () => router.push('/(group)/calendar'),
      },
      {
        id: 'board',
        title: 'Tablica',
        subtitle: 'Ogłoszenia grupy',
        backgroundColor: '#ffe4e6',
        icon: <MaterialCommunityIcons name="bullhorn" size={24} color="#db2777" />,
        onPress: () => router.push('/(group)/board'),
      },
      {
        id: 'bathroom',
        title: 'Łazienka',
        subtitle: 'Rezerwacje',
        backgroundColor: '#cffafe',
        icon: <Ionicons name="water" size={24} color="#0f766e" />,
        onPress: () => router.push('/(group)/bathroom'),
        statusDotColor: bathroomStatusDotColor,
      },
      {
        id: 'dishwasher',
        title: 'Zmywarka',
        subtitle: 'Status',
        backgroundColor: dishwasherBackgroundColor,
        icon: <MaterialCommunityIcons name="dishwasher" size={24} color={dishwasherIconColor} />,
        onPress: () => router.push('/(group)/dishwasher'),
        statusDotColor: dishwasherStatusDotColor,
      },
      {
        id: 'members',
        title: 'Mieszkańcy',
        subtitle: `${currentGroup?.members.length || 0} osób`,
        backgroundColor: '#e0e7ff',
        icon: <Ionicons name="people" size={24} color="#4338ca" />,
        onPress: () => router.push('/(group)/members'),
      },
    ];
  }, [activeShoppingItems, currentGroup?.members.length, router, pendingTasks, totalExpenses, dishwasherStatus?.status, bathroomReservations, currentTime]);
  
  const cardHeight = useMemo(() => {
    if (availableHeight === null || availableHeight <= 0) {
      return 132;
    }

    const rows = Math.ceil(quickActions.length / 2);
    const heightPerCardWrapper = availableHeight / rows;
    const minHeight = 132;
    return Math.max(heightPerCardWrapper, minHeight);
  }, [availableHeight, quickActions.length]);

  const scrollViewRef = useRef<ScrollView>(null);
  const welcomeRef = useRef<View>(null);
  const [welcomeHeight, setWelcomeHeight] = useState(0);

  const handleWelcomeLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setWelcomeHeight(height);
  };

  useEffect(() => {
    if (welcomeHeight === 0) {
      return;
    }

    const headerHeight = 56 + insets.top;
    const scrollViewHeight = windowHeight - headerHeight;
    const contentPadding = 24 + 32;
    const welcomeTotalHeight = welcomeHeight + 20;
    const availableForGrid = scrollViewHeight - contentPadding - welcomeTotalHeight;
    
    if (availableForGrid > 480) {
      setAvailableHeight(availableForGrid);
    } else {
      setAvailableHeight(480);
    }
  }, [welcomeHeight, windowHeight, insets.top]);

  return (
    <View style={styles.root}>
      <Header
        title={currentGroup?.name || 'Dashboard'}
        rightAction={
          <Pressable onPress={() => router.push('/(group)/profile')} hitSlop={8} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color="#1f2937" />
          </Pressable>
        }
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          availableHeight !== null && availableHeight > 0 && windowHeight > 0 && {
            flexGrow: 1,
            minHeight: windowHeight - (56 + insets.top),
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        <View ref={welcomeRef} style={styles.welcome} onLayout={handleWelcomeLayout}>
          <Text style={styles.greeting}>Witaj{user?.name ? `, ${user.name}` : ''}!</Text>
          <Text style={styles.subtitleText}>Co chcesz dzisiaj zrobić?</Text>
        </View>

        <View style={[
          styles.grid,
          availableHeight !== null && availableHeight > 0 && {
            flex: 1,
            height: availableHeight,
          },
        ]}>
          {quickActions.map((action) => (
            <Pressable
              key={action.id}
              style={({ pressed }) => [
                styles.cardWrapper,
                availableHeight !== null && availableHeight > 0 && { height: cardHeight },
                pressed && styles.cardPressed,
              ]}
              onPress={action.onPress}
            >
              <Card style={styles.card}>
                <CardContent style={styles.cardContent}>
                  <View style={styles.iconWrapper}>
                    <View style={[styles.iconContainer, { backgroundColor: action.backgroundColor }]}>{action.icon}</View>
                  </View>
                  <Text style={styles.cardTitle}>{action.title}</Text>
                  <View style={styles.subtitleWrapper}>
                    <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
                    {action.statusDotColor ? (
                      <View style={[styles.statusDot, { backgroundColor: action.statusDotColor }]} />
                    ) : null}
                  </View>
                </CardContent>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
