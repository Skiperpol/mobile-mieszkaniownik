import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/hooks/useAppStore';
import { getUserColor } from '@/utils/userNames';
import { styles } from './UserProfileScreen.style';

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
            <LinearGradient
              colors={user ? getUserColor(user.id) : ['#9ca3af', '#6b7280']}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarText}>
                {user?.name?.[0]?.toUpperCase() ?? '?'}
              </Text>
            </LinearGradient>
            <Text style={styles.userName}>{user?.name ?? 'Użytkownik'}</Text>
            <Text style={styles.userEmail}>{user?.email ?? 'Brak email'}</Text>
          </CardContent>
        </Card>

        {currentGroup ? (
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <View style={styles.groupHeader}>
                <LinearGradient
                  colors={['#155DFC', '#3b82f6']}
                  style={styles.groupIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="home-outline" size={20} color="#ffffff" />
                </LinearGradient>
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