import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';

export default function UserProfileScreen() {
  const user = useAppStore((state) => state.user);
  const currentGroup = useAppStore((state) => state.currentGroup);
  const logout = useAppStore((state) => state.logout);
  const leaveGroup = useAppStore((state) => state.leaveGroup);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)');
  };

  const handleLeaveGroup = () => {
    leaveGroup();
    router.push('/join-or-create');
  };

  return (
    <View style={styles.container}>
      <Header title="Profil" showBack onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <CardContent style={[styles.cardContent, styles.centerContent]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? '?'}</Text>
            </View>
            <Text style={styles.userName}>{user?.name ?? 'Użytkownik'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </CardContent>
        </Card>

        {currentGroup ? (
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <View style={styles.groupHeader}>
                <View style={styles.groupIcon}>
                  <Ionicons name="home-outline" size={20} color="#1d4ed8" />
                </View>
                <View>
                  <Text style={styles.groupLabel}>Twoja grupa</Text>
                  <Text style={styles.groupName}>{currentGroup.name}</Text>
                </View>
              </View>

              <Button
                variant="outline"
                style={styles.fullWidthButton}
                onPress={() => router.push('/(group)/members')}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="people-outline" size={18} color="#4c1d95" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Zobacz członków</Text>
                </View>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Card style={styles.card}>
          <CardContent style={styles.cardContent}>
            <View style={styles.row}>
              <Ionicons name="mail-outline" size={20} color="#4b5563" />
              <View style={styles.rowTextWrapper}>
                <Text style={styles.rowLabel}>Email</Text>
                <Text style={styles.rowValue}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Ionicons name="person-circle-outline" size={20} color="#4b5563" />
              <View style={styles.rowTextWrapper}>
                <Text style={styles.rowLabel}>ID użytkownika</Text>
                <Text style={styles.rowValueMono}>{user?.id}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <View style={styles.actions}>
          {currentGroup ? (
            <Button
              variant="outline"
              style={[styles.fullWidthButton, styles.leaveButton, styles.actionButton]}
              textStyle={styles.leaveButtonText}
              onPress={handleLeaveGroup}
            >
              Opuść grupę
            </Button>
          ) : null}

          <Button
            variant="outline"
            style={[styles.fullWidthButton, styles.logoutButton, styles.actionButton]}
            textStyle={styles.logoutButtonText}
            onPress={handleLogout}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="log-out-outline" size={18} color="#b91c1c" style={styles.buttonIcon} />
              <Text style={[styles.buttonText, styles.logoutButtonText]}>Wyloguj się</Text>
            </View>
          </Button>
        </View>

        <Card style={[styles.card, styles.infoCard]}>
          <CardContent style={styles.cardContent}>
            <Text style={styles.infoTitle}>O aplikacji</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoTextStrong}>Mieszkaniownik</Text> - aplikacja do zarządzania wspólnym mieszkaniem
            </Text>
            <Text style={styles.infoVersion}>Wersja 1.0.0</Text>
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
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  centerContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#4b5563',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
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
    color: '#312e81',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rowTextWrapper: {
    marginLeft: 12,
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 16,
    color: '#111827',
  },
  rowValueMono: {
    fontSize: 14,
    color: '#111827',
    fontFamily: Platform.select({
      ios: 'Menlo',
      default: 'monospace',
    }),
  },
  actions: {
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  leaveButton: {
    borderColor: '#fb923c',
  },
  leaveButtonText: {
    color: '#c2410c',
  },
  logoutButton: {
    borderColor: '#fca5a5',
  },
  logoutButtonText: {
    color: '#b91c1c',
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1d4ed8',
  },
  infoText: {
    fontSize: 14,
    color: '#1f2937',
  },
  infoTextStrong: {
    fontWeight: '700',
  },
  infoVersion: {
    fontSize: 12,
    marginTop: 12,
    color: '#4b5563',
  },
});