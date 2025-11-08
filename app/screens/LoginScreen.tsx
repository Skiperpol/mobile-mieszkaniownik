import React, { useCallback, useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAppStore } from '../store/useAppStore';
import { useNavigation } from 'expo-router';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAppStore((s) => s.login);
  const navigation = useNavigation();

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigation.navigate('JoinOrCreate');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  }, [email, login, navigation, password]);

  return (
    <LinearGradient colors={['#7c3aed', '#ec4899', '#f97316']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoBox}>
              <View style={styles.logoCircle}>
                <Ionicons name="home" size={42} color="#7c3aed" />
              </View>
              <Text style={styles.title}>Mieszkaniownik</Text>
              <Text style={styles.subtitle}>Zarządzaj wspólnym mieszkaniem</Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.field}>
                <Label>E-mail</Label>
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
                  textContentType="password"
                />
              </View>

              <Button onPress={handleLogin} loading={loading}>
                {loading ? 'Logowanie...' : 'Zaloguj się'}
              </Button>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Nie masz konta?{' '}
                <Text style={styles.footerLink} onPress={() => navigation.navigate('Register')}>
                  Zarejestruj się
                </Text>
              </Text>
              <Text style={styles.hint}>💡 Użyj dowolnego emaila, aby zobaczyć demo z przykładowymi danymi</Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: 'center',
    gap: 28,
  },
  logoBox: {
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 12,
  },
  field: {
    gap: 8,
  },
  footer: {
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
  },
  footerLink: {
    color: '#ffffff',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  hint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
  },
});