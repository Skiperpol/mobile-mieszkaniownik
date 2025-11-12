import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { useAppStore } from '@/store/useAppStore';
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

  // Update current time every minute to check bathroom status
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);
  const activeShoppingItems = useMemo(() => shoppingList.filter((item) => !item.purchased).length, [shoppingList]);
  const pendingTasks = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);

  const quickActions: QuickAction[] = useMemo(() => {
    // Get dishwasher status colors and dot
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

  // Calculate card height based on available space
  const cardHeight = useMemo(() => {
    if (availableHeight === null || availableHeight <= 0) {
      // Return minimum height until we measure the actual space
      return 132; // 120px content + 12px padding (6px top + 6px bottom)
    }
    
    // Number of rows (8 cards in 2 columns = 4 rows)
    const rows = Math.ceil(quickActions.length / 2);
    
    // Calculate height per card wrapper
    // Each cardWrapper has paddingVertical: 6px, which applies to each card
    // The padding creates spacing between cards, but we want cards to fill available space
    // Simply divide available height by number of rows to get height per card wrapper
    const heightPerCardWrapper = availableHeight / rows;
    
    // Minimum height for card wrapper (120px min content + 12px padding = 132px total)
    const minHeight = 132;
    
    // Return the larger value - this ensures cards fill available space on larger devices
    // but maintain minimum height on smaller devices for scrolling
    return Math.max(heightPerCardWrapper, minHeight);
  }, [availableHeight, quickActions.length]);

  const scrollViewRef = useRef<ScrollView>(null);
  const welcomeRef = useRef<View>(null);
  const [welcomeHeight, setWelcomeHeight] = useState(0);

  // Measure welcome section height
  const handleWelcomeLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setWelcomeHeight(height);
  };

  // Calculate available height for cards
  useEffect(() => {
    if (welcomeHeight === 0) {
      return;
    }

    // Header height: 56px (container) + safe area top
    const headerHeight = 56 + insets.top;
    
    // Available height for scroll view = window height - header height
    const scrollViewHeight = windowHeight - headerHeight;
    
    // Content padding: 24px top + 32px bottom = 56px
    const contentPadding = 24 + 32;
    
    // Welcome section: actual height + margin bottom (20px)
    const welcomeTotalHeight = welcomeHeight + 20;
    
    // Available height for grid = scroll view height - content padding - welcome section
    // This is the exact space available for the grid container
    const availableForGrid = scrollViewHeight - contentPadding - welcomeTotalHeight;
    
    // Minimum height for scrolling on small screens (4 rows * 120px = 480px)
    // Use the larger value - this ensures cards fill the screen on larger devices
    // but maintain minimum height on smaller devices for scrolling
    if (availableForGrid > 480) {
      setAvailableHeight(availableForGrid);
    } else {
      // On small screens, use minimum but allow scrolling
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
