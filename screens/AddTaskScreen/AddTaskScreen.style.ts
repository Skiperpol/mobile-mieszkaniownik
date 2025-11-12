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
  optionList: {
    gap: 12,
  },
  optionCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    backgroundColor: '#ffffff',
    gap: 6,
  },
  optionCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  optionCardPressed: {
    opacity: 0.9,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  optionTitleSelected: {
    color: '#047857',
  },
  optionDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    padding: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#1f2937',
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
  },
});

