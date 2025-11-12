import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 20,
  },
  statusCard: {
    borderRadius: 24,
  },
  statusContent: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 28,
  },
  statusBusy: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  statusFree: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#4b5563',
  },
  statusDetails: {
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#1f2937',
  },
  fullWidthButton: {
    width: '100%',
    textAlign: 'center',
  },
  formContent: {
    gap: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  field: {
    gap: 8,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
  upcomingSection: {
    gap: 12,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingInfo: {
    flex: 1,
    gap: 4,
  },
  upcomingUser: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  upcomingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  upcomingTime: {
    fontSize: 13,
    color: '#4b5563',
  },
});

