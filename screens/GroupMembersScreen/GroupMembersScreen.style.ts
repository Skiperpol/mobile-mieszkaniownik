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
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  groupName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  groupMembers: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  groupCode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  groupCodeLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  groupCodeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  copyButton: {
    paddingHorizontal: 14,
  },
  copyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButtonIcon: {
    marginRight: 6,
  },
  copyButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4338ca',
  },
  copySuccessLabel: {
    color: '#047857',
  },
  copyButtonTextSuccess: {
    color: '#047857',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#111827',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  memberAvatarEmoji: {
    fontSize: 30,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  memberBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    marginRight: 8,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inviteCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  inviteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#155DFC',
    marginBottom: 8,
  },
  inviteDescription: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  inviteCode: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      default: 'monospace',
    }),
    fontWeight: '700',
  },
});

