import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface AddShoppingItemScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function AddShoppingItemScreen({ onNavigate, onBack }: AddShoppingItemScreenProps) {
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

    onNavigate('shopping');
  };

  return (
    <View style={styles.root}>
      <Header
        title="Dodaj produkt"
        showBack
        onBack={() => (onBack ? onBack() : onNavigate('shopping'))}
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
          <View style={styles.card}>
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

            <Button onPress={handleSubmit} disabled={!name.trim()}>
              Dodaj do listy
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    gap: 20,
  },
  field: {
    gap: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
  },
});