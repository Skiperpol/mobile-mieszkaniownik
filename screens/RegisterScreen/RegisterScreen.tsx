import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/Header';
import { useAppStore, AppState } from '@/store/useAppStore';
import { useRouter } from 'expo-router';
import { styles } from '@/screens/RegisterScreen/RegisterScreen.style';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAppStore((status: AppState) => status.register);
  const router = useRouter();

  const errorMessage = useMemo(() => {
    if (!password || !confirmPassword) {
      return undefined;
    }
    if (password !== confirmPassword) {
      return 'Hasła nie są identyczne';
    }
    if (password.length < 6) {
      return 'Hasło musi mieć co najmniej 6 znaków';
    }
    return undefined;
  }, [confirmPassword, password]);

  const handleRegister = useCallback(async () => {
    if (errorMessage) return;
    setLoading(true);
    try {
      await register(email.trim(), password, name.trim());
      router.replace('/join-or-create');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  }, [email, errorMessage, name, router, password, register]);

  return (
    <View style={styles.root}>
      <Header title="Rejestracja" showBack onBack={() => router.back()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.form}>
              <View style={styles.field}>
                <Label>Imię</Label>
                <Input value={name} onChangeText={setName} placeholder="Twoje imię" textContentType="name" />
              </View>

              <View style={styles.field}>
                <Label>Email</Label>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="twoj@email.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.field}>
                <Label>Hasło</Label>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  textContentType="newPassword"
                />
              </View>

              <View style={styles.field}>
                <Label>Potwierdź hasło</Label>
                <Input
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  textContentType="newPassword"
                />
              </View>

              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

              <Button onPress={handleRegister} disabled={loading || Boolean(errorMessage)} loading={loading}>
                {loading ? 'Rejestracja...' : 'Zarejestruj się'}
              </Button>
            </View>

            <Text style={styles.loginText}>
              Masz już konto?{' '}
              <Text style={styles.loginLink} onPress={() => router.replace('/(auth)')}>
                Zaloguj się
              </Text>
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
