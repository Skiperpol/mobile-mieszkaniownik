import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';
import { styles } from './JoinOrCreateGroupScreen.style';

type Mode = 'select' | 'create' | 'join';

export default function JoinOrCreateGroupScreen() {
  const [mode, setMode] = useState<Mode>('select');
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const router = useRouter();
  
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
      router.push('/(group)');
    } catch (error) {
      console.error('Failed to join group:', error);
    } finally {
      setLoading(false);
    }
  }, [canJoin, groupCode, joinGroup, router]);

  const handleFinishCreate = useCallback(() => {
    router.push('/(group)');
  }, [router]);

  const handleScanQr = useCallback(() => {
    router.push('/join-or-create/scan-qr');
  }, [router]);

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

        <Button variant="ghost" style={styles.whiteGhostButton} onPress={() => setMode('join')}>
          <View style={styles.buttonContentGhost}>
            <Ionicons name="log-in-outline" size={22}/>
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

            <View style={styles.buttonColumn}>
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
      <Card style={styles.joinCard}>
        <CardHeader>
          <CardTitle style={styles.joinTitle}>Dołącz do grupy</CardTitle>
          <CardDescription style={styles.joinDescription}>
            Wpisz lub zeskanuj kod otrzymany od współlokatora
          </CardDescription>
        </CardHeader>
        <CardContent style={styles.joinCardContent}>
          <View style={styles.inputWrapper}>
            <Label style={styles.label}>Kod grupy</Label>
            <Input
              value={groupCode}
              onChangeText={(text) => setGroupCode(text.toUpperCase())}
              placeholder="ABC123"
              autoCapitalize="characters"
              maxLength={6}
              textAlign="center"
              style={styles.codeInput}
            />
          </View>

          <Button
            onPress={handleJoinGroup}
            disabled={!canJoin || loading}
            loading={loading}
            style={styles.fullWidthButton}
          >
            {loading ? 'Dołączanie...' : 'Dołącz'}
          </Button>
          <Button
            variant="secondary"
            onPress={handleScanQr}
            style={styles.fullWidthButton}
          >
            Zeskanuj kod QR
          </Button>
          <Button
            variant="ghost"
            onPress={() => setMode('select')}
            style={styles.fullWidthButton}
          >
            Wstecz
          </Button>
        </CardContent>
      </Card>
    </View>
  );

  return (
    <LinearGradient colors={['#f3f7ff', '#ffffff']} style={styles.gradient}>
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
    </LinearGradient>
  );
}
