import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Text, View } from 'react-native';
import { Camera, BarcodeScanningResult, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import styles from './ScanQrScreen.style';

type PermissionStatus = 'unknown' | 'granted' | 'denied';

export default function ScanQrScreen() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('unknown');
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const router = useRouter();
  const joinGroup = useAppStore((state) => state.joinGroup);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
    };

    requestPermission();
  }, []);

  useEffect(() => {
    setErrorMessage(null);
    setHasScanned(false);
  }, []);

  const handleBarCodeScanned = useCallback(
    async ({ data }: BarcodeScanningResult) => {
      if (hasScanned || isJoining) {
        return;
      }

      setHasScanned(true);
      setErrorMessage(null);
      setIsJoining(true);

      try {
        const normalizedCode = data.trim().toUpperCase();
        if (normalizedCode.length !== 6) {
          throw new Error('Nieprawidłowy kod QR');
        }
        await joinGroup(normalizedCode);
        router.replace('/(group)');
      } catch (error) {
        console.error('Failed to join group from QR:', error);
        setErrorMessage('Nie udało się dołączyć do grupy. Spróbuj ponownie.');
        setHasScanned(false);
      } finally {
        setIsJoining(false);
      }
    },
    [hasScanned, isJoining, joinGroup, router],
  );

  const scanContent = useMemo(() => {
    if (permissionStatus === 'unknown') {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.statusText}>Uzyskiwanie dostępu do aparatu…</Text>
        </View>
      );
    }

    if (permissionStatus === 'denied') {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.statusTitle}>Brak dostępu do aparatu</Text>
          <Text style={styles.statusText}>
            Nadaj aplikacji dostęp do aparatu w ustawieniach systemowych, aby móc skanować kody QR.
          </Text>
          <Button
            variant="secondary"
            style={styles.permissionButton}
            onPress={() => Linking.openSettings()}
          >
            Otwórz ustawienia
          </Button>
        </View>
      );
    }

    return (
      <CameraView
        style={styles.scanner}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleBarCodeScanned}
      />
    );
  }, [handleBarCodeScanned, permissionStatus]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Zeskanuj kod QR</Text>
        <Text style={styles.headerSubtitle}>
          Ustaw kod w ramce i poczekaj na automatyczne zeskanowanie
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <View style={styles.cameraFrame}>{scanContent}</View>
        <View pointerEvents="none" style={styles.frameOverlay}>
          <View style={[styles.frameBorder, styles.frameTop]} />
          <View style={[styles.frameBorder, styles.frameBottom]} />
          <View style={[styles.frameBorder, styles.frameLeft]} />
          <View style={[styles.frameBorder, styles.frameRight]} />
        </View>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {isJoining ? (
        <View style={styles.loadingNotice}>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={styles.loadingText}>Dołączanie do grupy…</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button style={styles.backButton} variant="ghost" onPress={() => router.back()}>
          Wstecz
        </Button>
      </View>
    </View>
  );
}

