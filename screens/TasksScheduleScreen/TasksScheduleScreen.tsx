import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { BottomNav } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { getUserName } from '@/utils/userNames';
import { styles } from './TasksScheduleScreen.style';

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
    textColor: '#155DFC',
  },
  monthly: {
    label: 'Co miesiąc',
    backgroundColor: '#dcfce7',
    textColor: '#166534',
  },
};

export default function TasksScheduleScreen() {
  const router = useRouter();
  const tasks = useAppStore((state) => state.tasks);
  const user = useAppStore((state) => state.user);
  const completeTask = useAppStore((state) => state.completeTask);
  const deleteTask = useAppStore((state) => state.deleteTask);

  const myTasks = tasks.filter((task) => task.assignedTo === user?.id);
  const otherTasks = tasks.filter((task) => task.assignedTo !== user?.id);

  const handleComplete = (taskId: string) => {
    completeTask(taskId);
  };

  const handleDelete = (taskId: string, taskTitle: string) => {
    Alert.alert(
      'Usuń zadanie',
      `Czy na pewno chcesz usunąć zadanie "${taskTitle}"?`,
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => deleteTask(taskId),
        },
      ]
    );
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
        onBack={() => router.back()}
        rightAction={
          <Pressable onPress={() => router.push('/(group)/add-task')} style={styles.headerAction} hitSlop={10}>
            <Ionicons name="add" size={22} color="#155DFC" />
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
                      <Pressable
                        onPress={() => handleDelete(task.id, task.title)}
                        style={styles.deleteButton}
                        hitSlop={8}
                      >
                        <Ionicons name="trash-outline" size={20} color="#dc2626" />
                      </Pressable>
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
                    <Pressable
                      onPress={() => handleDelete(task.id, task.title)}
                      style={styles.deleteButton}
                      hitSlop={8}
                    >
                      <Ionicons name="trash-outline" size={20} color="#dc2626" />
                    </Pressable>
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
              <Button style={styles.fullWidthButton} onPress={() => router.push('/(group)/add-task')}>
                Dodaj pierwsze zadanie
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </ScrollView>

      {/* <BottomNav
        activeTab="tasks"
        onTabChange={handleTabChange}
      /> */}
    </View>
  );
}

