import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    flex: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingBottom: 32,
      paddingTop: 16,
      gap: 32,
      justifyContent: 'space-between',
    },
    form: {
      backgroundColor: '#f9fafb',
      borderRadius: 24,
      padding: 24,
      gap: 18,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 4,
    },
    field: {
      gap: 8,
    },
    error: {
      color: '#b91c1c',
      fontSize: 14,
      textAlign: 'center',
    },
    loginText: {
      textAlign: 'center',
      color: '#4b5563',
      fontSize: 15,
    },
    loginLink: {
      color: '#2563eb',
      fontWeight: '700',
    },
  });