import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Header } from '@/components/Header';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePickerField } from '@/components/ui/date-picker';
import { TimePickerField } from '@/components/ui/time-picker';
import { styles } from './BathroomStatusScreen.style';

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

export default function BathroomStatusScreen() {
  const [showReserveForm, setShowReserveForm] = useState(false);
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState('30');
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  const bathroomReservations = useAppStore((state) => state.bathroomReservations);
  const user = useAppStore((state) => state.user);
  const currentGroup = useAppStore((state) => state.currentGroup);
  const reserveBathroom = useAppStore((state) => state.reserveBathroom);
  const releaseBathroom = useAppStore((state) => state.releaseBathroom);
  const deleteBathroomReservation = useAppStore((state) => state.deleteBathroomReservation);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  // Check and release expired reservations
  useEffect(() => {
    const now = currentTime;
    bathroomReservations.forEach((reservation) => {
      const endTime = new Date(reservation.endTime);
      if (reservation.occupied && endTime < now) {
        // Reservation has expired, release it
        releaseBathroom(reservation.id);
      }
    });
  }, [currentTime, bathroomReservations, releaseBathroom]);

  const now = useMemo(() => currentTime, [currentTime]);

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

  const handleDelete = (reservationId: string) => {
    Alert.alert(
      'Usuń rezerwację',
      'Czy na pewno chcesz usunąć tę rezerwację?',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => deleteBathroomReservation(reservationId),
        },
      ]
    );
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
        onBack={() => router.back()}
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
                    <Button 
                      onPress={handleRelease} 
                      variant="secondary" 
                      style={[styles.fullWidthButton, { width: '45%' }]}
                    >
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
                      <View style={styles.upcomingCardContent}>
                        <View style={styles.upcomingCardLeft}>
                          <View style={styles.avatar}>
                            <Ionicons name="person" size={20} color="#155DFC" />
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
                        </View>
                        {isMyReservation(reservation.userId) ? (
                          <Pressable
                            onPress={() => handleDelete(reservation.id)}
                            style={styles.deleteButton}
                            hitSlop={8}
                          >
                            <Ionicons name="trash-outline" size={20} color="#dc2626" />
                          </Pressable>
                        ) : null}
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

