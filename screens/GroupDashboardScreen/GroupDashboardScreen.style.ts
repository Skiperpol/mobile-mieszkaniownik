import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#f9fafb',
    },
    settingsButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 92,
      gap: 20,
    },
    welcome: {
      gap: 4,
    },
    greeting: {
      fontSize: 24,
      fontWeight: '700',
      color: '#111827',
    },
    subtitleText: {
      fontSize: 15,
      color: '#6b7280',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      justifyContent: 'space-between',
    },
    cardWrapper: {
      width: '48%',
    },
    cardPressed: {
      transform: [{ scale: 0.98 }],
    },
    cardContent: {
      gap: 12,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
    },
    cardSubtitle: {
      fontSize: 13,
      color: '#6b7280',
    },
  });