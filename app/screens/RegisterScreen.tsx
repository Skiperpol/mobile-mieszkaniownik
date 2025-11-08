import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';
import { useNavigation } from 'expo-router';

export function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAppStore((state) => state.register);
  const navigation = useNavigation();

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
      navigation.navigate('JoinOrCreate');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  }, [email, errorMessage, name, navigation, password, register]);

  return (
    <View style={styles.root}>
      <Header title="Rejestracja" showBack onBack={() => navigation.goBack()} />

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
              <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                Zaloguj się
              </Text>
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 32,
    justifyContent: 'space-between',
  },
  form: {
    backgroundColor: '#f9fafb',
    borderRadius: 24,
    padding: 24,
    gap: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  field: {
    gap: 8,
  },
  error: {
    color: '#b91c1c',
    fontSize: 14,
    textAlign: 'center',
  },
  loginText: {
    textAlign: 'center',
    color: '#4b5563',
    fontSize: 15,
  },
  loginLink: {
    color: '#2563eb',
    fontWeight: '700',
  },
});