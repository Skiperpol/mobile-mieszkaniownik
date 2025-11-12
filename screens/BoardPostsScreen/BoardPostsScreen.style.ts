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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
  postCard: {
    gap: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#155DFC',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  author: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
  },
  postTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  postContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  commentsSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    gap: 12,
  },
  commentToggle: {
    alignSelf: 'flex-start',
  },
  commentToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentToggleText: {
    fontSize: 13,
    color: '#155DFC',
    fontWeight: '600',
  },
  commentsList: {
    gap: 12,
  },
  commentCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 12,
    gap: 6,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#155DFC',
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  commentTimestamp: {
    fontSize: 11,
    color: '#6b7280',
  },
  commentContent: {
    fontSize: 13,
    color: '#374151',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentInput: {
    flex: 1,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

