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
  typeList: {
    gap: 12,
  },
  typeCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    backgroundColor: '#ffffff',
    gap: 6,
  },
  typeCardSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#f5f3ff',
  },
  typeCardPressed: {
    opacity: 0.9,
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  typeTitleSelected: {
    color: '#5b21b6',
  },
  typeDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  datesRow: {
    flexDirection: 'row',
    gap: 16,
  },
  dateField: {
    flex: 1,
    gap: 8,
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
  },
});

