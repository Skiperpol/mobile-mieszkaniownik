import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    gradient: {
      flex: 1,
      justifyContent: 'center',
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingVertical: 48,
      justifyContent: 'center',
    },
    centerBox: {
      alignItems: 'center',
      gap: 24,
    },
    heroIcon: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: '#3b82f6',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: '#1f2937',
    },
    subtitle: {
      fontSize: 16,
      color: '#4b5563',
    },
    actions: {
      width: '100%',
      gap: 16,
    },
    buttonContentPrimary: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    buttonTextPrimary: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonContentGhost: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    whiteGhostButton: {
      backgroundColor: '#FFFFFF',
    },
    buttonTextGhost: {
      fontSize: 16,
      fontWeight: '600',
    },
    cardContent: {
      gap: 16,
    },
    joinCard: {
      width: '100%',
      borderRadius: 24,
      paddingVertical: 8,
      paddingHorizontal: 4,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 12,
    },
    joinCardContent: {
      gap: 16,
      paddingTop: 8,
    },
    joinTitle: {
      fontSize: 22,
      fontWeight: '700',
    },
    joinDescription: {
      fontSize: 16,
      color: '#6b7280',
    },
    inputWrapper: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      color: '#4b5563',
    },
    fullWidthButton: {
      width: '100%',
    },
    cardHeaderCenter: {
      alignItems: 'center',
      gap: 4,
    },
    codeBox: {
      backgroundColor: '#dbeafe',
      borderRadius: 16,
      paddingVertical: 20,
      paddingHorizontal: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#bfdbfe',
    },
    codeLabel: {
      fontSize: 13,
      color: '#4b5563',
      marginBottom: 6,
    },
    codeValue: {
      fontSize: 36,
      letterSpacing: 8,
      fontWeight: '700',
      color: '#1d4ed8',
      fontFamily: 'monospace',
    },
    infoText: {
      fontSize: 13,
      color: '#4b5563',
      textAlign: 'center',
    },
    buttonColumn: {
      flexDirection: 'column',
      gap: 12,
    },
    halfButton: {
      flex: 1,
    },
    codeInput: {
      fontSize: 24,
      letterSpacing: 6,
      fontWeight: '600',
      backgroundColor: '#f3f4f6',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 12,
      paddingVertical: 12,
    },
  });