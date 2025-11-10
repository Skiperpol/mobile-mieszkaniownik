import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BottomNav } from '../components/BottomNav';
import { Header } from '../components/Header';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAppStore } from '../store/useAppStore';

interface CalendarScreenProps {
  onNavigate: (screen: string) => void;
  onTabChange: (tab: string) => void;
  onBack?: () => void;
}

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
    textColor: '#1d4ed8',
  },
};

export function CalendarScreen({ onNavigate, onTabChange, onBack }: CalendarScreenProps) {
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

  return (
    <View style={styles.container}>
      <Header
        title="Kalendarz"
        showBack
        onBack={onBack || (() => onNavigate('dashboard'))}
        rightAction={
          <Pressable onPress={() => onNavigate('add-absence')} style={styles.headerAction} hitSlop={10}>
            <Ionicons name="add" size={22} color="#2563eb" />
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
              <Button style={styles.fullWidthButton} onPress={() => onNavigate('add-absence')}>
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
        onTabChange={onTabChange}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  badge: {
    marginRight: 8,
    marginBottom: 8,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4338ca',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#1f2937',
  },
  centerContent: {
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  fullWidthButton: {
    width: '100%',
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe',
  },
});