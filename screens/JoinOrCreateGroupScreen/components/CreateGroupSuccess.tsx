import React from 'react';
import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { styles } from '../JoinOrCreateGroupScreen.style';

interface CreateGroupSuccessProps {
  code: string;
  onContinue: () => void;
}

export function CreateGroupSuccess({ code, onContinue }: CreateGroupSuccessProps) {
  return (
    <View style={styles.centerBox}>
      <Card style={styles.qrCard}>
        <CardContent style={styles.qrCardContent}>
          <View style={styles.qrImageWrapper}>
            <QRCode value={code} size={180} color="#111827" backgroundColor="transparent" />
          </View>
          <View style={styles.qrTextGroup}>
            <Text style={styles.qrTitle}>Grupa utworzona!</Text>
            <Text style={styles.qrSubtitle}>Udostępnij kod grupy lub QR znajomym</Text>
          </View>
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Kod grupy</Text>
            <Text style={styles.codeValue}>{code}</Text>
          </View>
          <Button style={styles.qrButton} onPress={onContinue}>
            Przejdź do mieszkania
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}

