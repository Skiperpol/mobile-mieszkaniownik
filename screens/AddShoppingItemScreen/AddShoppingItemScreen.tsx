import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { styles } from './AddShoppingItemScreen.style';

export default function AddShoppingItemScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');

  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const addShoppingItem = useAppStore((state) => state.addShoppingItem);

  const handleSubmit = () => {
    if (!currentGroup || !user || !name.trim()) {
      return;
    }

    addShoppingItem({
      groupId: currentGroup.id,
      name: name.trim(),
      quantity: quantity.trim(),
      addedBy: user.id,
      estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : undefined,
    });

    router.back();
  };

  return (
    <View style={styles.root}>
      <Header
        title="Dodaj produkt"
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
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <View style={styles.field}>
                <Label>Nazwa produktu</Label>
                <Input
                  placeholder="np. Mleko"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="sentences"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.field}>
                <Label>Ilość (opcjonalnie)</Label>
                <Input
                  placeholder="np. 2 litry, 1 opakowanie"
                  value={quantity}
                  onChangeText={setQuantity}
                  autoCapitalize="sentences"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.field}>
                <Label>Szacunkowa cena (zł)</Label>
                <Input
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={estimatedPrice}
                  onChangeText={setEstimatedPrice}
                />
                <Text style={styles.helperText}>
                  Po zakupie zostanie automatycznie utworzony wydatek w Skarbonce
                </Text>
              </View>

              <Button
                onPress={handleSubmit}
                disabled={!name.trim()}
                style={styles.submitButton}
              >
                Dodaj do listy
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

