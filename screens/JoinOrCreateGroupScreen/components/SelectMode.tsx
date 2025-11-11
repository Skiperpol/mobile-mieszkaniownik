import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/button';
import { styles } from '../JoinOrCreateGroupScreen.style';

interface SelectModeProps {
  onCreatePress: () => void;
  onJoinPress: () => void;
}

export function SelectMode({ onCreatePress, onJoinPress }: SelectModeProps) {
  return (
    <View style={styles.centerBox}>
      <View style={styles.heroIcon}>
        <Ionicons name="people" size={40} color="#ffffff" />
      </View>
      <Text style={styles.title}>Witaj!</Text>
      <Text style={styles.subtitle}>Dołącz do grupy lub stwórz nową</Text>

      <View style={styles.actions}>
        <Button onPress={onCreatePress}>
          <View style={styles.buttonContentPrimary}>
            <Ionicons name="add-circle" size={22} color="#ffffff" />
            <Text style={styles.buttonTextPrimary}>Stwórz nową grupę</Text>
          </View>
        </Button>

        <Button variant="ghost" style={styles.whiteGhostButton} onPress={onJoinPress}>
          <View style={styles.buttonContentGhost}>
            <Ionicons name="log-in-outline" size={22} />
            <Text style={styles.buttonTextGhost}>Dołącz do grupy</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}

