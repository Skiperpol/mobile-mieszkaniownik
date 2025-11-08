import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { DatePickerField } from '../components/ui/date-picker';
import { TimePickerField } from '../components/ui/time-picker';

interface BathroomStatusScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

function createDateWithNewDatePart(source: Date | null, datePart: Date) {
  const base = source ? new Date(source) : new Date();
  base.setFullYear(datePart.getFullYear(), datePart.getMonth(), datePart.getDate());
  return base;
}

function createDateWithNewTimePart(source: Date | null, timePart: Date) {
  const base = source ? new Date(source) : new Date();
  base.setHours(timePart.getHours(), timePart.getMinutes(), 0, 0);
  return base;
}

export function BathroomStatusScreen({ onNavigate, onBack }: BathroomStatusScreenProps) {
  const [showReserveForm, setShowReserveForm] = useState(false);
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState('30');

  const bathroomReservations = useAppStore((state) => state.bathroomReservations);
  const user = useAppStore((state) => state.user);
  const currentGroup = useAppStore((state) => state.currentGroup);
  const reserveBathroom = useAppStore((state) => state.reserveBathroom);
  const releaseBathroom = useAppStore((state) => state.releaseBathroom);

  const now = useMemo(() => new Date(), []);

  const currentReservation = useMemo(
    () =>
      bathroomReservations.find((res) => {
        const start = new Date(res.startTime);
        const end = new Date(res.endTime);
        return res.occupied && start <= now && end >= now;
      }) || null,
    [bathroomReservations, now],
  );

  const upcomingReservations = useMemo(
    () =>
      bathroomReservations
        .filter((res) => new Date(res.startTime) > now)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [bathroomReservations, now],
  );

  const isMyReservation = (userId: string) => userId === user?.id;

  const handleReserve = () => {
    if (!currentGroup || !user || !startDateTime) {
      return;
    }
    const normalizedDuration = Math.max(5, parseInt(duration, 10) || 0);
    const start = new Date(startDateTime);
    const end = new Date(start.getTime() + normalizedDuration * 60 * 1000);

    reserveBathroom({
      groupId: currentGroup.id,
      userId: user.id,
      startTime: start,
      endTime: end,
      occupied: true,
    });

    setShowReserveForm(false);
    setStartDateTime(null);
    setDuration('30');
  };

  const handleRelease = () => {
    if (currentReservation) {
      releaseBathroom(currentReservation.id);
    }
  };

  const selectedDate = startDateTime ? new Date(startDateTime) : null;
  const selectedTime = startDateTime ? new Date(startDateTime) : null;

  const formatTimeRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleString('pl-PL', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const endStr = end.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${startStr} - ${endStr}`;
  };

  return (
    <View style={styles.root}>
      <Header
        title="Status łazienki"
        showBack
        onBack={onBack || (() => onNavigate('dashboard'))}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card style={[styles.statusCard, currentReservation ? styles.statusBusy : styles.statusFree]}>
            <CardContent style={styles.statusContent}>
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={currentReservation ? 'warning' : 'checkmark-circle'}
                  size={48}
                  color={currentReservation ? '#dc2626' : '#16a34a'}
                />
              </View>
              <Text style={styles.statusTitle}>{currentReservation ? 'Zajęta' : 'Wolna'}</Text>
              {currentReservation ? (
                <View style={styles.statusDetails}>
                  <Text style={styles.statusText}>
                    Używa: {isMyReservation(currentReservation.userId) ? 'Ty' : currentReservation.userId}
                  </Text>
                  <Text style={styles.statusText}>
                    Do:{' '}
                    {new Date(currentReservation.endTime).toLocaleTimeString('pl-PL', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  {isMyReservation(currentReservation.userId) ? (
                    <Button onPress={handleRelease} variant="secondary" style={styles.fullWidthButton}>
                      Zwolnij łazienkę
                    </Button>
                  ) : null}
                </View>
              ) : (
                <Text style={styles.statusSubtitle}>Łazienka jest gotowa do użycia</Text>
              )}
            </CardContent>
          </Card>

          {!showReserveForm ? (
            <Button onPress={() => setShowReserveForm(true)} style={styles.fullWidthButton}>
              Zarezerwuj łazienkę
            </Button>
          ) : (
            <Card>
              <CardContent style={styles.formContent}>
                <Text style={styles.formTitle}>Nowa rezerwacja</Text>

                <View style={styles.field}>
                  <Label>Data</Label>
                  <DatePickerField
                    value={selectedDate}
                    onChange={(date) => setStartDateTime((current) => createDateWithNewDatePart(current, date))}
                    placeholder="Wybierz datę"
                  />
                </View>

                <View style={styles.field}>
                  <Label>Godzina</Label>
                  <TimePickerField
                    value={selectedTime}
                    onChange={(time) => setStartDateTime((current) => createDateWithNewTimePart(current, time))}
                    placeholder="Wybierz godzinę"
                  />
                </View>

                <View style={styles.field}>
                  <Label>Czas trwania (minuty)</Label>
                  <Input
                    value={duration}
                    onChangeText={(text) => setDuration(text.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad"
                    placeholder="30"
                  />
                </View>

                <View style={styles.formActions}>
                  <Button variant="ghost" style={styles.halfButton} onPress={() => setShowReserveForm(false)}>
                    Anuluj
                  </Button>
                  <Button
                    style={styles.halfButton}
                    onPress={handleReserve}
                    disabled={!startDateTime || !(parseInt(duration, 10) > 0)}
                  >
                    Zarezerwuj
                  </Button>
                </View>
              </CardContent>
            </Card>
          )}

          {upcomingReservations.length > 0 ? (
            <View style={styles.upcomingSection}>
              <Text style={styles.upcomingTitle}>Nadchodzące rezerwacje</Text>
              {upcomingReservations.map((reservation) => {
                const start = new Date(reservation.startTime);
                const end = new Date(reservation.endTime);
                return (
                  <Card key={reservation.id}>
                    <CardContent style={styles.upcomingCard}>
                      <View style={styles.avatar}>
                        <Ionicons name="person" size={20} color="#1d4ed8" />
                      </View>
                      <View style={styles.upcomingInfo}>
                        <Text style={styles.upcomingUser}>
                          {isMyReservation(reservation.userId) ? 'Ty' : reservation.userId}
                        </Text>
                        <View style={styles.upcomingTimeRow}>
                          <Ionicons name="time-outline" size={16} color="#6b7280" />
                          <Text style={styles.upcomingTime}>{formatTimeRange(start, end)}</Text>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                );
              })}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 20,
  },
  statusCard: {
    borderRadius: 24,
  },
  statusContent: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 28,
  },
  statusBusy: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  statusFree: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#4b5563',
  },
  statusDetails: {
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#1f2937',
  },
  fullWidthButton: {
    width: '100%',
  },
  formContent: {
    gap: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  field: {
    gap: 8,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
  upcomingSection: {
    gap: 12,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingInfo: {
    flex: 1,
    gap: 4,
  },
  upcomingUser: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  upcomingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  upcomingTime: {
    fontSize: 13,
    color: '#4b5563',
  },
});
