import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Card, CardContent } from '../components/ui/card';
import { BottomNav } from '../components/BottomNav';
import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';
import { useNavigation } from 'expo-router';

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  backgroundColor: string;
  onPress: () => void;
}

export function GroupDashboard() {
  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const expenses = useAppStore((state) => state.expenses);
  const shoppingList = useAppStore((state) => state.shoppingList);
  const tasks = useAppStore((state) => state.tasks);
  const boardPosts = useAppStore((state) => state.boardPosts);
  const calendarEvents = useAppStore((state) => state.calendarEvents);

  const navigation = useNavigation();
  const activeShoppingItems = useMemo(() => shoppingList.filter((item) => !item.purchased).length, [shoppingList]);
  const pendingTasks = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);
  const upcomingEvents = useMemo(
    () => calendarEvents.filter((event) => new Date(event.endDate) >= new Date()).length,
    [calendarEvents],
  );

  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        id: 'expenses',
        title: 'Skarbonka',
        subtitle: `${totalExpenses.toFixed(2)} zł wydano`,
        backgroundColor: '#dcfce7',
        icon: <Ionicons name="wallet" size={24} color="#047857" />,
        onPress: () => navigation.navigate('Expenses'),
      },
      {
        id: 'shopping',
        title: 'Lista zakupów',
        subtitle: `${activeShoppingItems} produktów`,
        backgroundColor: '#dbeafe',
        icon: <Ionicons name="cart" size={24} color="#1d4ed8" />,
        onPress: () => navigation.navigate('ShoppingList'),
      },
      {
        id: 'tasks',
        title: 'Zadania',
        subtitle: `${pendingTasks} do zrobienia`,
        backgroundColor: '#ede9fe',
        icon: <Ionicons name="checkmark-done" size={24} color="#6d28d9" />,
        onPress: () => navigation.navigate('Tasks'),
      },
      {
        id: 'calendar',
        title: 'Kalendarz',
        subtitle: 'Wydarzenia i nieobecności',
        backgroundColor: '#fee2e2',
        icon: <Ionicons name="calendar" size={24} color="#b91c1c" />,
        onPress: () => navigation.navigate('Calendar'),
      },
      {
        id: 'board',
        title: 'Tablica',
        subtitle: 'Ogłoszenia grupy',
        backgroundColor: '#ffe4e6',
        icon: <MaterialCommunityIcons name="bullhorn" size={24} color="#db2777" />,
        onPress: () => navigation.navigate('Board'),
      },
      {
        id: 'bathroom',
        title: 'Łazienka',
        subtitle: 'Rezerwacje',
        backgroundColor: '#cffafe',
        icon: <Ionicons name="water" size={24} color="#0f766e" />,
        onPress: () => navigation.navigate('Bathroom'),
      },
      {
        id: 'dishwasher',
        title: 'Zmywarka',
        subtitle: 'Status',
        backgroundColor: '#fef3c7',
        icon: <MaterialCommunityIcons name="dishwasher" size={24} color="#d97706" />,
        onPress: () => navigation.navigate('Dishwasher'),
      },
      {
        id: 'members',
        title: 'Mieszkańcy',
        subtitle: `${currentGroup?.members.length || 0} osób`,
        backgroundColor: '#e0e7ff',
        icon: <Ionicons name="people" size={24} color="#4338ca" />,
        onPress: () => navigation.navigate('Members'),
      },
    ],
    [activeShoppingItems, currentGroup?.members.length, navigation, pendingTasks, totalExpenses, upcomingEvents],
  );

  return (
    <View style={styles.root}>
      <Header
        title={currentGroup?.name || 'Dashboard'}
        rightAction={
          <Pressable onPress={() => navigation.navigate('Profile')} hitSlop={8} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color="#1f2937" />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcome}>
          <Text style={styles.greeting}>Witaj, {user?.name || 'przyjacielu'}!</Text>
          <Text style={styles.subtitleText}>Co chcesz dzisiaj zrobić?</Text>
        </View>

        <View style={styles.grid}>
          {quickActions.map((action) => (
            <Pressable
              key={action.id}
              style={({ pressed }) => [styles.cardWrapper, pressed && styles.cardPressed]}
              onPress={action.onPress}
            >
              <Card>
                <CardContent style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: action.backgroundColor }]}>{action.icon}</View>
                  <Text style={styles.cardTitle}>{action.title}</Text>
                  <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
                </CardContent>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomNav
        activeTab="dashboard"
        onTabChange={() => navigation.navigate('Dashboard')}
        badges={{
          expenses: expenses.length,
          shopping: activeShoppingItems,
          tasks: pendingTasks,
          calendar: upcomingEvents,
          board: boardPosts.length,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 92,
    gap: 20,
  },
  welcome: {
    gap: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitleText: {
    fontSize: 15,
    color: '#6b7280',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
});