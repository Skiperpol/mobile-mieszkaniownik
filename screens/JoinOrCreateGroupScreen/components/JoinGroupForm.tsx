import React from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { styles } from '../JoinOrCreateGroupScreen.style';

interface JoinGroupFormProps {
  groupCode: string;
  canJoin: boolean;
  loading: boolean;
  error?: string;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  onScanPress: () => void;
}

export function JoinGroupForm({
  groupCode,
  canJoin,
  loading,
  error,
  onCodeChange,
  onSubmit,
  onBack,
  onScanPress,
}: JoinGroupFormProps) {
  return (
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
              onChangeText={onCodeChange}
              placeholder="ABC123"
              autoCapitalize="characters"
              maxLength={6}
              textAlign="center"
              style={styles.codeInput}
            />
            {error && <Text style={styles.error}>{error}</Text>}
          </View>

          <Button
            onPress={onSubmit}
            disabled={!canJoin || loading}
            loading={loading}
            style={styles.fullWidthButton}
          >
            {loading ? 'Dołączanie...' : 'Dołącz'}
          </Button>
          <Button variant="secondary" onPress={onScanPress} style={styles.fullWidthButton}>
            Zeskanuj kod QR
          </Button>
          <Button variant="ghost" onPress={onBack} style={styles.fullWidthButton}>
            Wstecz
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}

