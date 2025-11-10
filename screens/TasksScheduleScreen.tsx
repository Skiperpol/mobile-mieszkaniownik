import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BottomNav } from '../components/BottomNav';
import { Header } from '../components/Header';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { useAppStore } from '../store/useAppStore';
import { getUserName } from '../utils/userNames';

interface TasksScheduleScreenProps {
  onNavigate: (screen: string) => void;
  onTabChange: (tab: string) => void;
  onBack?: () => void;
}

const frequencyMeta: Record<
  string,
  {
    label: string;
    backgroundColor: string;
    textColor: string;
  }
> = {
  daily: {
    label: 'Codziennie',
    backgroundColor: '#fee2e2',
    textColor: '#b91c1c',
  },
  weekly: {
    label: 'Co tydzień',
    backgroundColor: '#dbeafe',
    textColor: '#1d4ed8',
  },
  monthly: {
    label: 'Co miesiąc',
    backgroundColor: '#dcfce7',
    textColor: '#166534',
  },
};

export function TasksScheduleScreen({ onNavigate, onTabChange, onBack }: TasksScheduleScreenProps) {
  const tasks = useAppStore((state) => state.tasks);
  const user = useAppStore((state) => state.user);
  const completeTask = useAppStore((state) => state.completeTask);
  const expenses = useAppStore((state) => state.expenses);
  const shoppingList = useAppStore((state) => state.shoppingList);
  const boardPosts = useAppStore((state) => state.boardPosts);
  const calendarEvents = useAppStore((state) => state.calendarEvents);

  const activeShoppingItems = useMemo(
    () => shoppingList.filter((item) => !item.purchased).length,
    [shoppingList],
  );
  const pendingTasks = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);
  const upcomingEvents = useMemo(
    () => calendarEvents.filter((event) => new Date(event.endDate) >= new Date()).length,
    [calendarEvents],
  );

  const myTasks = tasks.filter((task) => task.assignedTo === user?.id);
  const otherTasks = tasks.filter((task) => task.assignedTo !== user?.id);

  const handleComplete = (taskId: string) => {
    completeTask(taskId);
  };

  const isOverdue = (dueDate: Date) => new Date(dueDate) < new Date();

  const renderFrequencyBadge = (frequency: string) => {
    const meta = frequencyMeta[frequency] ?? {
      label: frequency,
      backgroundColor: '#e5e7eb',
      textColor: '#374151',
    };

    return (
      <Badge
        key={`frequency-${frequency}`}
        style={[styles.badge, { backgroundColor: meta.backgroundColor }]}
        textProps={{ style: [styles.badgeText, { color: meta.textColor }] }}
      >
        {meta.label}
      </Badge>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Harmonogram sprzątania"
        showBack
        onBack={onBack || (() => onNavigate('dashboard'))}
        rightAction={
          <Pressable onPress={() => onNavigate('add-task')} style={styles.headerAction} hitSlop={10}>
            <Ionicons name="add" size={22} color="#2563eb" />
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Twoje zadania ({myTasks.length})</Text>

          {myTasks.length === 0 ? (
            <Card style={styles.card}>
              <CardContent style={[styles.cardContent, styles.centerContent]}>
                <Ionicons name="checkmark-circle-outline" size={48} color="#22c55e" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>Nie masz żadnych zadań do wykonania</Text>
              </CardContent>
            </Card>
          ) : (
            myTasks.map((task) => {
              const overdue = isOverdue(task.dueDate);
              return (
                <Card
                  key={task.id}
                  style={[styles.card, overdue ? styles.cardOverdue : undefined]}
                >
                  <CardContent style={styles.cardContent}>
                    <View style={styles.taskHeader}>
                      <View style={styles.taskTitleWrapper}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        {task.description ? (
                          <Text style={styles.taskDescription}>{task.description}</Text>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.taskMeta}>
                      {renderFrequencyBadge(task.frequency)}
                      <Badge variant="outline" style={styles.badge} textProps={{ style: styles.badgeText }}>
                        <View style={styles.badgeContent}>
                          <Ionicons name="time-outline" size={14} color="#4338ca" style={styles.badgeIcon} />
                          <Text style={styles.badgeText}>
                            {new Date(task.dueDate).toLocaleDateString('pl-PL')}
                          </Text>
                        </View>
                      </Badge>
                    </View>

                    <Button
                      variant={overdue ? 'primary' : 'outline'}
                      style={styles.fullWidthButton}
                      onPress={() => handleComplete(task.id)}
                    >
                      <View style={styles.buttonContent}>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={18}
                          color={overdue ? '#ffffff' : '#4338ca'}
                          style={styles.buttonIcon}
                        />
                        <Text style={[styles.buttonText, overdue ? styles.buttonTextPrimary : styles.buttonTextOutline]}>
                          Oznacz jako wykonane
                        </Text>
                      </View>
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </View>

        {otherTasks.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zadania innych ({otherTasks.length})</Text>

            {otherTasks.map((task) => (
              <Card key={task.id} style={styles.card}>
                <CardContent style={styles.cardContent}>
                  <View style={styles.taskHeader}>
                    <View style={styles.taskTitleWrapper}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      {task.description ? (
                        <Text style={styles.taskDescription}>{task.description}</Text>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.taskMeta}>
                    {renderFrequencyBadge(task.frequency)}
                    <Badge variant="outline" style={styles.badge} textProps={{ style: styles.badgeText }}>
                      <View style={styles.badgeContent}>
                        <Ionicons
                          name="person-outline"
                          size={14}
                          color="#4338ca"
                          style={styles.badgeIcon}
                        />
                        <Text style={styles.badgeText}>{getUserName(task.assignedTo)}</Text>
                      </View>
                    </Badge>
                    <Badge variant="outline" style={styles.badge} textProps={{ style: styles.badgeText }}>
                      <View style={styles.badgeContent}>
                        <Ionicons name="time-outline" size={14} color="#4338ca" style={styles.badgeIcon} />
                        <Text style={styles.badgeText}>
                          {new Date(task.dueDate).toLocaleDateString('pl-PL')}
                        </Text>
                      </View>
                    </Badge>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        ) : null}

        {tasks.length === 0 ? (
          <Card style={styles.card}>
            <CardContent style={[styles.cardContent, styles.centerContent]}>
              <Ionicons name="sparkles-outline" size={48} color="#6366f1" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>Brak zadań w harmonogramie</Text>
              <Button style={styles.fullWidthButton} onPress={() => onNavigate('add-task')}>
                Dodaj pierwsze zadanie
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </ScrollView>

      <BottomNav
        activeTab="tasks"
        onTabChange={onTabChange}
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
  cardOverdue: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  cardContent: {
    padding: 20,
  },
  centerContent: {
    alignItems: 'center',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  taskTitleWrapper: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#4b5563',
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    alignItems: 'center',
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
  fullWidthButton: {
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: '#ffffff',
  },
  buttonTextOutline: {
    color: '#4338ca',
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
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe',
  },
});