import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../components/Header';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAppStore } from '../store/useAppStore';

interface DishwasherScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

const statusStyles = {
  empty: {
    container: {
      backgroundColor: '#f3f4f6',
      borderColor: '#e5e7eb',
    },
    iconColor: '#9ca3af',
    title: 'Pusta',
    description: 'Można zacząć wkładać naczynia',
  },
  loading: {
    container: {
      backgroundColor: '#dbeafe',
      borderColor: '#bfdbfe',
    },
    iconColor: '#2563eb',
    title: 'Dorzucam naczynia',
    description: 'Jeszcze nie uruchamiaj!',
  },
  running: {
    container: {
      backgroundColor: '#dcfce7',
      borderColor: '#bbf7d0',
    },
    iconColor: '#16a34a',
    title: 'Zmywa',
    description: 'W toku...',
  },
  clean: {
    container: {
      backgroundColor: '#ede9fe',
      borderColor: '#ddd6fe',
    },
    iconColor: '#7c3aed',
    title: 'Czyste naczynia',
    description: 'Trzeba wyładować',
  },
} as const;

const instructions = [
  'Kliknij „Dorzucam naczynia”, gdy wkładasz brudne naczynia',
  'Gdy zmywarka jest pełna, kliknij „Uruchom zmywarkę”',
  'Po zakończeniu cyklu oznacz jako „Czyste naczynia”',
  'Wyładuj zmywarkę i kliknij „Wyładowałem naczynia”',
];

export function DishwasherScreen({ onNavigate, onBack }: DishwasherScreenProps) {
  const dishwasherStatus = useAppStore((state) => state.dishwasherStatus);
  const user = useAppStore((state) => state.user);
  const updateDishwasherStatus = useAppStore((state) => state.updateDishwasherStatus);

  const status = dishwasherStatus?.status ?? 'empty';

  const statusInfo = useMemo(() => statusStyles[status] ?? statusStyles.empty, [status]);

  const canAddDishes = status === 'empty' || status === 'loading';
  const canStart = status === 'loading';
  const canMarkClean = status === 'running';
  const canUnload = status === 'clean';

  const handleAddDishes = () => {
    if (user) {
      updateDishwasherStatus('loading', user.id);
    }
  };

  const handleStart = () => {
    if (user) {
      updateDishwasherStatus('running', user.id);
    }
  };

  const handleMarkClean = () => {
    updateDishwasherStatus('clean');
  };

  const handleUnload = () => {
    updateDishwasherStatus('empty');
  };

  return (
    <View style={styles.container}>
      <Header title="Status zmywarki" showBack onBack={onBack || (() => onNavigate('dashboard'))} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={[styles.card, styles.statusCard, statusInfo.container]}>
          <CardContent style={[styles.cardContent, styles.centerContent]}>
            <Ionicons name="restaurant-outline" size={80} color={statusInfo.iconColor} style={styles.statusIcon} />
            <Text style={styles.statusTitle}>{statusInfo.title}</Text>
            <Text style={styles.statusDescription}>{statusInfo.description}</Text>
            {status === 'running' && dishwasherStatus?.startedAt ? (
              <Text style={styles.statusMeta}>
                Uruchomiona: {new Date(dishwasherStatus.startedAt).toLocaleString('pl-PL')}
              </Text>
            ) : null}
          </CardContent>
        </Card>

        <View style={styles.actions}>
          {canAddDishes ? (
            <Button
              size="lg"
              variant={status === 'loading' ? 'outline' : 'primary'}
              style={styles.fullWidthButton}
              onPress={handleAddDishes}
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="add"
                  size={20}
                  color={status === 'loading' ? '#4338ca' : '#ffffff'}
                  style={styles.buttonIcon}
                />
                <Text style={[styles.buttonText, status === 'loading' ? styles.buttonTextOutline : styles.buttonTextPrimary]}>
                  Dorzucam naczynia
                </Text>
              </View>
            </Button>
          ) : null}

          {canStart ? (
            <Button size="lg" style={styles.fullWidthButton} onPress={handleStart}>
              <View style={styles.buttonContent}>
                <Ionicons name="play" size={20} color="#ffffff" style={styles.buttonIcon} />
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Uruchom zmywarkę</Text>
              </View>
            </Button>
          ) : null}

          {canMarkClean ? (
            <Button
              size="lg"
              variant="outline"
              style={styles.fullWidthButton}
              onPress={handleMarkClean}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#4338ca" style={styles.buttonIcon} />
                <Text style={[styles.buttonText, styles.buttonTextOutline]}>Zmywanie zakończone</Text>
              </View>
            </Button>
          ) : null}

          {canUnload ? (
            <Button size="lg" style={styles.fullWidthButton} onPress={handleUnload}>
              <View style={styles.buttonContent}>
                <Ionicons name="checkbox-outline" size={20} color="#ffffff" style={styles.buttonIcon} />
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Wyładowałem naczynia</Text>
              </View>
            </Button>
          ) : null}
        </View>

        {status === 'loading' &&
        dishwasherStatus?.contributors &&
        dishwasherStatus.contributors.length > 0 ? (
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <Text style={styles.sectionTitle}>Dorzucają naczynia</Text>
              <View style={styles.badgeRow}>
                {dishwasherStatus.contributors.map((contributorId, index) => (
                  <Badge
                    key={`${contributorId}-${index}`}
                    variant="secondary"
                    style={styles.badge}
                    textProps={{ style: styles.badgeText }}
                  >
                    {contributorId === user?.id ? 'Ty' : contributorId}
                  </Badge>
                ))}
              </View>
            </CardContent>
          </Card>
        ) : null}

        <Card style={styles.card}>
          <CardContent style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Jak to działa?</Text>
            <View style={styles.instructions}>
              {instructions.map((instruction, index) => (
                <View key={instruction} style={styles.instructionRow}>
                  <Ionicons name="ellipse" size={8} color="#2563eb" style={styles.instructionIcon} />
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>
      </ScrollView>
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
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  statusCard: {
    borderWidth: 1,
  },
  centerContent: {
    alignItems: 'center',
  },
  statusIcon: {
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  statusMeta: {
    marginTop: 12,
    fontSize: 13,
    color: '#6b7280',
  },
  actions: {
    marginBottom: 12,
  },
  fullWidthButton: {
    width: '100%',
    marginBottom: 12,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  instructions: {
    marginTop: 4,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  instructionIcon: {
    marginTop: 6,
    marginRight: 10,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});