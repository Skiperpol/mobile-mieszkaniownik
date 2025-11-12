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
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  highlightCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1d4ed8',
  },
  cardDescription: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  balanceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  balanceName: {
    fontSize: 16,
    color: '#111827',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  balancePositive: {
    color: '#15803d',
  },
  balanceNegative: {
    color: '#b91c1c',
  },
  transferRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transferParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transferAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debtorAvatar: {
    backgroundColor: '#fee2e2',
    marginRight: 6,
  },
  creditorAvatar: {
    backgroundColor: '#dcfce7',
    marginLeft: 6,
    marginRight: 6,
  },
  transferAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  transferName: {
    fontSize: 14,
    color: '#1f2937',
  },
  transferArrow: {
    marginHorizontal: 4,
  },
  transferAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  centerContent: {
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
  fullWidthButton: {
    width: '100%',
  },
});

