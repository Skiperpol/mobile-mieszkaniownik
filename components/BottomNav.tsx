import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TAB_CONFIG = {
  expenses: {
    label: 'Skarbonka',
    icon: (focused: boolean) => (
      <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={24} color={focused ? '#10b981' : '#6b7280'} />
    ),
  },
  shopping: {
    label: 'Zakupy',
    icon: (focused: boolean) => (
      <Ionicons
        name={focused ? 'cart' : 'cart-outline'}
        size={24}
        color={focused ? '#3b82f6' : '#6b7280'}
      />
    ),
  },
  tasks: {
    label: 'Zadania',
    icon: (focused: boolean) => (
      <Ionicons
        name={focused ? 'checkmark-done' : 'checkmark-done-outline'}
        size={24}
        color={focused ? '#8b5cf6' : '#6b7280'}
      />
    ),
  },
  calendar: {
    label: 'Kalendarz',
    icon: (focused: boolean) => (
      <Ionicons
        name={focused ? 'calendar' : 'calendar-outline'}
        size={24}
        color={focused ? '#f97316' : '#6b7280'}
      />
    ),
  },
  board: {
    label: 'Ogłoszenia',
    icon: (focused: boolean) => (
      <MaterialCommunityIcons
        name={focused ? 'bullhorn' : 'bullhorn-outline'}
        size={24}
        color={focused ? '#ec4899' : '#6b7280'}
      />
    ),
  },
} as const;

const tabs = Object.entries(TAB_CONFIG) as [keyof typeof TAB_CONFIG, (typeof TAB_CONFIG)['expenses']][];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const expenses = useAppStore((state) => state.expenses);
  const shoppingList = useAppStore((state) => state.shoppingList);
  const tasks = useAppStore((state) => state.tasks);
  const calendarEvents = useAppStore((state) => state.calendarEvents);
  const boardPosts = useAppStore((state) => state.boardPosts);

  const badges = useMemo(() => {
    const now = new Date();
    return {
      expenses: expenses.length,
      shopping: shoppingList.filter((item) => !item.purchased).length,
      tasks: tasks.filter((task) => !task.completed).length,
      calendar: calendarEvents.filter((event) => new Date(event.endDate) >= now).length,
      board: boardPosts.length,
    };
  }, [expenses, shoppingList, tasks, calendarEvents, boardPosts]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {tabs.map(([tabId, tab]) => {
          const focused = activeTab === tabId;
          const badgeCount = badges[tabId] ?? 0;
          return (
            <Pressable
              key={tabId}
              onPress={() => onTabChange(tabId)}
              style={({ pressed }) => [
                styles.tab,
                focused ? styles.tabActive : null,
                pressed ? styles.tabPressed : null,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
            >
              <View style={styles.iconWrapper}>
                {tab.icon(focused)}
                {badgeCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badgeCount}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={[styles.label, focused ? styles.labelActive : null]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  tabActive: {
    transform: [{ scale: 1.05 }],
  },
  tabPressed: {
    opacity: 0.8,
  },
  iconWrapper: {
    position: 'relative',
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  labelActive: {
    color: '#111827',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -12,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
});