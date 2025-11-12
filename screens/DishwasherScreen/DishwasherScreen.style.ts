import { StyleSheet } from 'react-native';

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
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  statusCard: {
    borderWidth: 1,
  },
  centerContent: {
    alignItems: 'center',
  },
  statusIcon: {
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  statusMeta: {
    marginTop: 12,
    fontSize: 13,
    color: '#6b7280',
  },
  actions: {
    marginBottom: 12,
  },
  fullWidthButton: {
    width: '100%',
    marginBottom: 12,
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
  },
  buttonTextPrimary: {
    color: '#ffffff',
  },
  buttonTextOutline: {
    color: '#4338ca',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  instructions: {
    marginTop: 4,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  instructionIcon: {
    marginTop: 6,
    marginRight: 10,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

