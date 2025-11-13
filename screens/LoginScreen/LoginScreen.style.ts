import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    flex: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    container: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingVertical: 48,
      justifyContent: 'center',
      gap: 28,
    },
    logoBox: {
      alignItems: 'center',
      gap: 12,
    },
    logoCircle: {
      width: 96,
      height: 96,
      borderRadius: 24,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
    },
    title: {
      fontSize: 34,
      fontWeight: '700',
      color: '#ffffff',
    },
    subtitle: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.9)',
      textAlign: 'center',
    },
    formCard: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: 24,
      padding: 24,
      gap: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 30,
      elevation: 12,
    },
    field: {
      gap: 8,
    },
    footer: {
      alignItems: 'center',
      gap: 12,
    },
    footerText: {
      fontSize: 15,
    },
    footerLink: {
      color: '#155DFC',
      fontWeight: '700',
    },
    hint: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 13,
      textAlign: 'center',
    },
    error: {
      color: '#dc2626',
      fontSize: 13,
      marginTop: 4,
    },
  });