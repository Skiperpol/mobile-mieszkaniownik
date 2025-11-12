import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  centerContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: '700',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#4b5563',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#155DFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  groupLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  fullWidthButton: {
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#312e81',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rowTextWrapper: {
    marginLeft: 12,
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 16,
    color: '#111827',
  },
  rowValueMono: {
    fontSize: 14,
    color: '#111827',
    fontFamily: Platform.select({
      ios: 'Menlo',
      default: 'monospace',
    }),
  },
  actions: {
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  leaveButton: {
    borderColor: '#fb923c',
  },
  leaveButtonText: {
    color: '#c2410c',
  },
  logoutButton: {
    borderColor: '#fca5a5',
  },
  logoutButtonText: {
    color: '#b91c1c',
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1d4ed8',
  },
  infoText: {
    fontSize: 14,
    color: '#1f2937',
  },
  infoTextStrong: {
    fontWeight: '700',
  },
  infoVersion: {
    fontSize: 12,
    marginTop: 12,
    color: '#4b5563',
  },
});

