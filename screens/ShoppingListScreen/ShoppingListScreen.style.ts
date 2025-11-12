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
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  purchasedCard: {
    opacity: 0.7,
  },
  cardContent: {
    padding: 16,
  },
  centerContent: {
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemBody: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  itemHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  claimButton: {
    paddingHorizontal: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#155DFC',
  },
  badgeTextStrong: {
    fontWeight: '600',
  },
  purchasedText: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  fullWidthButton: {
    width: '100%',
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe',
  },
});

