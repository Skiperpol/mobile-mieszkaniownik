import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenuClick?: () => void;
  rightAction?: React.ReactNode;
}

export function Header({
  title,
  showBack = false,
  onBack,
  showMenu = false,
  onMenuClick,
  rightAction,
}: HeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.side}>
          {showBack ? (
            <Pressable onPress={onBack} style={styles.iconButton} accessibilityRole="button" hitSlop={8}>
              <Ionicons name="chevron-back" size={24} color="#1f2937" />
            </Pressable>
          ) : showMenu ? (
            <Pressable
              onPress={onMenuClick}
              style={styles.iconButton}
              accessibilityRole="button"
              hitSlop={8}
            >
              <Ionicons name="menu-outline" size={24} color="#1f2937" />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.titleWrapper} accessible accessibilityRole="header">
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={[styles.side, styles.sideRight]}>{rightAction}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  side: {
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
  },
});