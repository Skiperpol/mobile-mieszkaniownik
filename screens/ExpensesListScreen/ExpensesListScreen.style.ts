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
    paddingBottom: 120,
    gap: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  summaryCardWrapper: {
    flex: 1,
    minWidth: 0,
  },
  summaryCard: {
    gap: 8,
    padding: 16,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  balancePositive: {
    backgroundColor: '#dcfce7',
  },
  balanceNegative: {
    backgroundColor: '#fee2e2',
  },
  positiveText: {
    color: '#047857',
  },
  negativeText: {
    color: '#b91c1c',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  sectionHeader: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  emptyCard: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
  },
  expenseCard: {
    gap: 10,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  expenseMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseMeta: {
    fontSize: 13,
    color: '#6b7280',
  },
  expenseMetaHighlight: {
    fontWeight: '600',
    color: '#111827',
  },
  expenseDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  expenseDescription: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
});

