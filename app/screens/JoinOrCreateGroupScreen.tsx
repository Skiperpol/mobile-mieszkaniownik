import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAppStore } from '../store/useAppStore';
import { useNavigation } from 'expo-router';

type Mode = 'select' | 'create' | 'join';

export function JoinOrCreateGroupScreen() {
  const [mode, setMode] = useState<Mode>('select');
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const navigation = useNavigation();
  
  const createGroup = useAppStore((s) => s.createGroup);
  const joinGroup = useAppStore((state) => state.joinGroup);

  const canCreate = useMemo(() => groupName.trim().length >= 3, [groupName]);
  const canJoin = useMemo(() => groupCode.trim().length === 6, [groupCode]);

  const handleCreateGroup = useCallback(async () => {
    if (!canCreate) return;
    setLoading(true);
    try {
      const code = await createGroup(groupName.trim());
      setGeneratedCode(code);
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setLoading(false);
    }
  }, [canCreate, createGroup, groupName]);

  const handleJoinGroup = useCallback(async () => {
    if (!canJoin) return;
    setLoading(true);
    try {
      await joinGroup(groupCode.trim().toUpperCase());
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Failed to join group:', error);
    } finally {
      setLoading(false);
    }
  }, [canJoin, groupCode, joinGroup, navigation]);

  const handleFinishCreate = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  const renderSelectMode = () => (
    <View style={styles.centerBox}>
      <View style={styles.heroIcon}>
        <Ionicons name="people" size={40} color="#ffffff" />
      </View>
      <Text style={styles.title}>Witaj!</Text>
      <Text style={styles.subtitle}>Dołącz do grupy lub stwórz nową</Text>

      <View style={styles.actions}>
        <Button onPress={() => setMode('create')}>
          <View style={styles.buttonContentPrimary}>
            <Ionicons name="add-circle" size={22} color="#ffffff" />
            <Text style={styles.buttonTextPrimary}>Stwórz nową grupę</Text>
          </View>
        </Button>

        <Button variant="ghost" onPress={() => setMode('join')}>
          <View style={styles.buttonContentGhost}>
            <Ionicons name="log-in-outline" size={22} color="#7c3aed" />
            <Text style={styles.buttonTextGhost}>Dołącz do grupy</Text>
          </View>
        </Button>
      </View>
    </View>
  );

  const renderCreateMode = () => {
    if (generatedCode) {
      return (
        <View style={styles.centerBox}>
          <Card>
            <CardHeader style={styles.cardHeaderCenter}>
              <CardTitle>Grupa utworzona!</CardTitle>
              <CardDescription>Udostępnij kod znajomym</CardDescription>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              <View style={styles.codeBox}>
                <Text style={styles.codeLabel}>Kod grupy</Text>
                <Text style={styles.codeValue}>{generatedCode}</Text>
              </View>
              <Text style={styles.infoText}>
                Twoi współlokatorzy mogą użyć tego kodu, aby dołączyć do grupy
              </Text>
              <Button onPress={handleFinishCreate}>Przejdź do aplikacji</Button>
            </CardContent>
          </Card>
        </View>
      );
    }

    return (
      <View style={styles.centerBox}>
        <Card>
          <CardHeader>
            <CardTitle>Stwórz grupę</CardTitle>
            <CardDescription>Podaj nazwę Twojego mieszkania</CardDescription>
          </CardHeader>
          <CardContent style={styles.cardContent}>
            <Label>Nazwa grupy</Label>
            <Input
              value={groupName}
              onChangeText={setGroupName}
              placeholder="np. Mieszkanie przy Parkowej 12"
              autoCapitalize="words"
            />

            <View style={styles.buttonRow}>
              <Button variant="ghost" style={styles.halfButton} onPress={() => setMode('select')}>
                Wstecz
              </Button>
              <Button
                style={styles.halfButton}
                onPress={handleCreateGroup}
                disabled={!canCreate || loading}
                loading={loading}
              >
                {loading ? 'Tworzenie...' : 'Stwórz'}
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    );
  };

  const renderJoinMode = () => (
    <View style={styles.centerBox}>
      <Card>
        <CardHeader>
          <CardTitle>Dołącz do grupy</CardTitle>
          <CardDescription>Wpisz kod otrzymany od współlokatora</CardDescription>
        </CardHeader>
        <CardContent style={styles.cardContent}>
          <Label>Kod grupy</Label>
          <Input
            value={groupCode}
            onChangeText={(text) => setGroupCode(text.toUpperCase())}
            placeholder="ABC123"
            autoCapitalize="characters"
            maxLength={6}
            textAlign="center"
            style={styles.codeInput}
          />

          <View style={styles.buttonRow}>
            <Button variant="ghost" style={styles.halfButton} onPress={() => setMode('select')}>
              Wstecz
            </Button>
            <Button
              style={styles.halfButton}
              onPress={handleJoinGroup}
              disabled={!canJoin || loading}
              loading={loading}
            >
              {loading ? 'Dołączanie...' : 'Dołącz'}
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {mode === 'select' && renderSelectMode()}
            {mode === 'create' && renderCreateMode()}
            {mode === 'join' && renderJoinMode()}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#eff6ff',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: 'center',
  },
  centerBox: {
    alignItems: 'center',
    gap: 24,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  buttonContentPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonTextPrimary: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContentGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonTextGhost: {
    color: '#7c3aed',
    fontSize: 16,
    fontWeight: '600',
  },
  cardContent: {
    gap: 16,
  },
  cardHeaderCenter: {
    alignItems: 'center',
    gap: 4,
  },
  codeBox: {
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  codeLabel: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 6,
  },
  codeValue: {
    fontSize: 36,
    letterSpacing: 8,
    fontWeight: '700',
    color: '#1d4ed8',
    fontFamily: 'monospace',
  },
  infoText: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
  codeInput: {
    fontSize: 24,
    letterSpacing: 6,
    fontWeight: '600',
  },
});