import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore, AppState } from '@/store/useAppStore';
import { useRouter } from 'expo-router';
import { styles } from '@/screens/LoginScreen/LoginScreen.style';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAppStore((status: AppState) => status.login);
  const router = useRouter();
  
  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/join-or-create');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  }, [email, login, router, password]);

  return (
    <LinearGradient colors={['#46FF6E', '#259FB3', '#0414FF']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                <Ionicons name="home" size={42} color="#155DFC" />
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
                  autoComplete="email"
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
                  autoComplete="off"
                />
              </View>

              <Button onPress={handleLogin} loading={loading}>
                {loading ? 'Logowanie...' : 'Zaloguj się'}
              </Button>
              <View style={styles.footer}>
              <Text style={styles.footerText}>
                Nie masz konta?{' '}
                <Text style={styles.footerLink} onPress={() => router.push('/register')}>
                  Zarejestruj się
                </Text>
              </Text>
            </View>
            </View>


          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
