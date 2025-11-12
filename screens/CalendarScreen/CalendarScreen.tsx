import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { BottomNav } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { styles } from './CalendarScreen.style';

const eventTypeMeta: Record<
  string,
  {
    label: string;
    backgroundColor: string;
    textColor: string;
  }
> = {
  absence: {
    label: 'Nieobecność',
    backgroundColor: '#fed7aa',
    textColor: '#c2410c',
  },
  event: {
    label: 'Wydarzenie',
    backgroundColor: '#dbeafe',
    textColor: '#155DFC',
  },
};

export default function CalendarScreen() {
  const router = useRouter();
  const calendarEvents = useAppStore((state) => state.calendarEvents);
  const user = useAppStore((state) => state.user);
  const expenses = useAppStore((state) => state.expenses);
  const shoppingList = useAppStore((state) => state.shoppingList);
  const tasks = useAppStore((state) => state.tasks);
  const boardPosts = useAppStore((state) => state.boardPosts);

  const activeShoppingItems = useMemo(
    () => shoppingList.filter((item) => !item.purchased).length,
    [shoppingList],
  );
  const pendingTasks = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);
  const upcomingEventsCount = useMemo(
    () => calendarEvents.filter((event) => new Date(event.endDate) >= new Date()).length,
    [calendarEvents],
  );

  const sortedEvents = useMemo(
    () =>
      [...calendarEvents].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      ),
    [calendarEvents],
  );

  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.endDate) >= new Date(),
  );
  const pastEvents = sortedEvents.filter((event) => new Date(event.endDate) < new Date());

  const formatRange = (start: Date, end: Date) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startStr = startDate.toLocaleDateString('pl-PL');
    const endStr = endDate.toLocaleDateString('pl-PL');
    return startStr === endStr ? startStr : `${startStr} - ${endStr}`;
  };

  const renderEventBadge = (type: string) => {
    const meta = eventTypeMeta[type] ?? {
      label: type,
      backgroundColor: '#e5e7eb',
      textColor: '#374151',
    };

    return (
      <Badge
        key={`type-${type}`}
        style={[styles.badge, { backgroundColor: meta.backgroundColor }]}
        textProps={{ style: [styles.badgeText, { color: meta.textColor }] }}
      >
        {meta.label}
      </Badge>
    );
  };

  const renderSection = (title: string, events: typeof calendarEvents, emptyState?: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title} ({events.length})
      </Text>
      {events.length === 0 ? (
        emptyState ?? null
      ) : (
        events.map((event) => (
          <Card key={event.id} style={styles.card}>
            <CardContent style={styles.cardContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              {event.description ? (
                <Text style={styles.eventDescription}>{event.description}</Text>
              ) : null}

              <View style={styles.badgeRow}>
                {renderEventBadge(event.type)}
                <Badge variant="outline" style={styles.badge} textProps={{ style: styles.badgeText }}>
                  <View style={styles.badgeContent}>
                    <Ionicons name="person-outline" size={14} color="#4338ca" style={styles.badgeIcon} />
                    <Text style={styles.badgeText}>
                      {event.userId === user?.id ? 'Ty' : event.userId}
                    </Text>
                  </View>
                </Badge>
              </View>

              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={16} color="#4b5563" style={styles.dateIcon} />
                <Text style={styles.dateText}>{formatRange(event.startDate, event.endDate)}</Text>
              </View>
            </CardContent>
          </Card>
        ))
      )}
    </View>
  );

  const handleTabChange = (tab: string) => {
    if (tab === 'expenses') router.push('/(group)/expenses');
    else if (tab === 'shopping') router.push('/(group)/shopping-list');
    else if (tab === 'tasks') router.push('/(group)/tasks');
    else if (tab === 'calendar') router.push('/(group)/calendar');
    else if (tab === 'board') router.push('/(group)/board');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Kalendarz"
        showBack
        onBack={() => router.back()}
        rightAction={
          <Pressable onPress={() => router.push('/(group)/add-absence')} style={styles.headerAction} hitSlop={10}>
            <Ionicons name="add" size={22} color="#155DFC" />
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderSection(
          'Nadchodzące',
          upcomingEvents,
          <Card style={styles.card}>
            <CardContent style={[styles.cardContent, styles.centerContent]}>
              <Ionicons name="calendar-outline" size={48} color="#9ca3af" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>Brak nadchodzących wydarzeń</Text>
              <Button style={styles.fullWidthButton} onPress={() => router.push('/(group)/add-absence')}>
                Dodaj nieobecność
              </Button>
            </CardContent>
          </Card>,
        )}

        {pastEvents.length > 0
          ? renderSection('Przeszłe', pastEvents)
          : null}
      </ScrollView>

      <BottomNav
        activeTab="calendar"
        onTabChange={handleTabChange}
        badges={{
          expenses: expenses.length,
          shopping: activeShoppingItems,
          tasks: pendingTasks,
          calendar: upcomingEventsCount,
          board: boardPosts.length,
        }}
      />
    </View>
  );
}

