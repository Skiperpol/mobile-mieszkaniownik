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
import { useAppStore } from '@/hooks/useAppStore';
import type { AppState } from '@/types/app';
import { useRouter } from 'expo-router';
import { validateEmail, validatePassword, validateConfirmPassword, validateName } from '@/utils/validation';
import { styles } from '@/screens/RegisterScreen/RegisterScreen.style';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const register = useAppStore((status: AppState) => status.register);
  const router = useRouter();

  const handleRegister = useCallback(async () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await register(email.trim(), password, name.trim());
      router.replace('/join-or-create');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ email: 'Rejestracja nie powiodła się. Spróbuj ponownie.' });
    } finally {
      setLoading(false);
    }
  }, [email, name, router, password, confirmPassword, register]);

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
                <Input
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  placeholder="Twoje imię"
                  textContentType="name"
                />
                {errors.name && <Text style={styles.error}>{errors.name}</Text>}
              </View>

              <View style={styles.field}>
                <Label>Email</Label>
                <Input
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="twoj@email.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
                {errors.email && <Text style={styles.error}>{errors.email}</Text>}
              </View>

              <View style={styles.field}>
                <Label>Hasło</Label>
                <Input
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                    if (errors.confirmPassword && confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  placeholder="••••••••"
                  secureTextEntry
                  textContentType="newPassword"
                />
                {errors.password && <Text style={styles.error}>{errors.password}</Text>}
              </View>

              <View style={styles.field}>
                <Label>Potwierdź hasło</Label>
                <Input
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  placeholder="••••••••"
                  secureTextEntry
                  textContentType="newPassword"
                />
                {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
              </View>

              <Button onPress={handleRegister} disabled={loading} loading={loading}>
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
