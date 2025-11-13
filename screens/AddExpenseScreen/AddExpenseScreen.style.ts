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
  },
  card: {
    borderRadius: 24,
  },
  cardContent: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  error: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: 4,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
  },
  chipSelected: {
    backgroundColor: '#ede9fe',
    borderColor: '#8b5cf6',
  },
  chipPressed: {
    opacity: 0.85,
  },
  chipText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#5b21b6',
  },
  splitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equalSplitButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  equalSplitText: {
    fontSize: 13,
    color: '#155DFC',
    fontWeight: '600',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  memberName: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  amountInputWrapper: {
    flex: 1,
    maxWidth: 140,
    marginLeft: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingLeft: 12,
    paddingRight: 12,
    height: 48,
  },
  memberAmountInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0,
    margin: 0,
    textAlign: 'right',
  },
  currencyText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    marginLeft: 8,
    minWidth: 20,
  },
  summaryBox: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  summaryError: {
    color: '#dc2626',
  },
  errorText: {
    fontSize: 13,
    color: '#dc2626',
    fontWeight: '500',
    marginTop: 4,
  },
  successText: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '500',
    marginTop: 4,
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
  },
  noMembersText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    paddingVertical: 16,
    textAlign: 'center',
  },
});
