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
      gap: 22,
    },
    form: {
      gap: 22,
    },
    field: {
      gap: 2,
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