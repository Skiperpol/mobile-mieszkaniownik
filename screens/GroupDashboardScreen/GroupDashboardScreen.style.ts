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
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 32,
    },
    welcome: {
      marginBottom: 20,
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
      marginHorizontal: -6,
      marginBottom: -12,
    },
    cardWrapper: {
      width: '50%',
      paddingHorizontal: 6,
      marginBottom: 12,
    },
    cardPressed: {
      transform: [{ scale: 0.98 }],
    },
    card: {
      flex: 1,
      height: '100%',
    },
    cardContent: {
      gap: 12,
      flex: 1,
      justifyContent: 'space-between',
    },
    iconWrapper: {
      width: 48,
      height: 48,
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
    subtitleWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    cardSubtitle: {
      fontSize: 13,
      color: '#6b7280',
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#16a34a',
    },
  });