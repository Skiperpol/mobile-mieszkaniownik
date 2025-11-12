import React from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { styles } from '../JoinOrCreateGroupScreen.style';

interface CreateGroupFormProps {
  groupName: string;
  canCreate: boolean;
  loading: boolean;
  onGroupNameChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function CreateGroupForm({
  groupName,
  canCreate,
  loading,
  onGroupNameChange,
  onSubmit,
  onBack,
}: CreateGroupFormProps) {
  return (
    <View style={styles.centerBox}>
      <Card style={styles.createCard}>
        <CardHeader style={styles.createHeader}>
          <CardTitle style={styles.createTitle}>Stwórz grupę</CardTitle>
          <CardDescription style={styles.createDescription}>
            Podaj nazwę Twojego mieszkania
          </CardDescription>
        </CardHeader>
        <CardContent style={styles.createContent}>
          <View style={styles.inputWrapper}>
            <Label style={styles.label}>Nazwa grupy</Label>
            <Input
              value={groupName}
              onChangeText={onGroupNameChange}
              placeholder="np. Mieszkanie przy Parkowej 12"
              autoCapitalize="sentences"
              autoCorrect={false}
              keyboardType="default"
              style={styles.textInput}
            />
          </View>

          <View style={styles.fullWidthColumn}>
            <Button
              onPress={onSubmit}
              disabled={!canCreate || loading}
              loading={loading}
              style={[styles.fullWidthButton, styles.primaryButton]}
            >
              {loading ? 'Tworzenie...' : 'Stwórz'}
            </Button>
            <Button
              variant="ghost"
              onPress={onBack}
              style={[styles.fullWidthButton, styles.secondaryButton]}
            >
              Wstecz
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

