import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';

interface BoardPostsScreenProps {
  onNavigate: (screen: string) => void;
  onTabChange: (tab: string) => void;
  onBack?: () => void;
}

export function BoardPostsScreen({ onNavigate, onTabChange, onBack }: BoardPostsScreenProps) {
  const boardPosts = useAppStore((state) => state.boardPosts);
  const user = useAppStore((state) => state.user);
  const addComment = useAppStore((state) => state.addComment);
  const expenses = useAppStore((state) => state.expenses);
  const shoppingList = useAppStore((state) => state.shoppingList);
  const tasks = useAppStore((state) => state.tasks);
  const calendarEvents = useAppStore((state) => state.calendarEvents);

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  const badges = useMemo(
    () => ({
      expenses: expenses.length,
      shopping: shoppingList.filter((item) => !item.purchased).length,
      tasks: tasks.filter((task) => !task.completed).length,
      calendar: calendarEvents.filter((event) => new Date(event.endDate) >= new Date()).length,
      board: boardPosts.length,
    }),
    [boardPosts.length, calendarEvents, expenses.length, shoppingList, tasks],
  );

  const sortedPosts = useMemo(
    () =>
      [...boardPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [boardPosts],
  );

  const handleAddComment = (postId: string) => {
    const content = commentInputs[postId];
    if (!content?.trim() || !user) {
      return;
    }

    addComment(postId, {
      authorId: user.id,
      content: content.trim(),
    });

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const toggleComments = (postId: string) => {
    setExpandedPosts((prev) => {
      const updated = new Set(prev);
      if (updated.has(postId)) {
        updated.delete(postId);
      } else {
        updated.add(postId);
      }
      return updated;
    });
  };

  return (
    <View style={styles.root}>
      <Header
        title="Tablica ogłoszeń"
        showBack
        onBack={onBack || (() => onNavigate('dashboard'))}
        rightAction={
          <Button variant="ghost" style={styles.iconButton} onPress={() => onNavigate('add-board-post')}>
            <Ionicons name="add" size={22} color="#2563eb" />
          </Button>
        }
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {sortedPosts.length === 0 ? (
            <Card>
              <CardContent style={styles.emptyCard}>
                <Ionicons name="chatbubbles-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>Brak ogłoszeń</Text>
                <Button onPress={() => onNavigate('add-board-post')}>Dodaj pierwsze ogłoszenie</Button>
              </CardContent>
            </Card>
          ) : (
            sortedPosts.map((post) => {
              const isExpanded = expandedPosts.has(post.id);
              return (
                <Card key={post.id}>
                  <CardContent style={styles.postCard}>
                    <View style={styles.postHeader}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{post.authorId[0]?.toUpperCase()}</Text>
                      </View>
                      <View style={styles.headerText}>
                        <Text style={styles.author}>
                          {post.authorId === user?.id ? 'Ty' : post.authorId}
                        </Text>
                        <Text style={styles.timestamp}>
                          {new Date(post.createdAt).toLocaleString('pl-PL')}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.postTitle}>{post.title}</Text>
                    <Text style={styles.postContent}>{post.content}</Text>

                    <View style={styles.commentsSection}>
                      <Button
                        variant="ghost"
                        style={styles.commentToggle}
                        onPress={() => toggleComments(post.id)}
                      >
                        <View style={styles.commentToggleContent}>
                          <Ionicons name="chatbox-ellipses-outline" size={16} color="#2563eb" />
                          <Text style={styles.commentToggleText}>
                            {post.comments.length} komentarzy
                          </Text>
                          <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color="#6b7280"
                          />
                        </View>
                      </Button>

                      {isExpanded ? (
                        <View style={styles.commentsList}>
                          {post.comments.map((comment) => (
                            <View key={comment.id} style={styles.commentCard}>
                              <View style={styles.commentHeader}>
                                <View style={styles.smallAvatar}>
                                  <Text style={styles.smallAvatarText}>
                                    {comment.authorId[0]?.toUpperCase()}
                                  </Text>
                                </View>
                                <Text style={styles.commentAuthor}>
                                  {comment.authorId === user?.id ? 'Ty' : comment.authorId}
                                </Text>
                                <Text style={styles.commentTimestamp}>
                                  {new Date(comment.createdAt).toLocaleString('pl-PL')}
                                </Text>
                              </View>
                              <Text style={styles.commentContent}>{comment.content}</Text>
                            </View>
                          ))}

                          <View style={styles.commentInputRow}>
                            <Input
                              placeholder="Dodaj komentarz..."
                              value={commentInputs[post.id] || ''}
                              onChangeText={(text) =>
                                setCommentInputs((prev) => ({ ...prev, [post.id]: text }))
                              }
                              style={styles.commentInput}
                            />
                            <Button
                              variant="secondary"
                              style={styles.sendButton}
                              onPress={() => handleAddComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim()}
                            >
                              <Ionicons name="send" size={16} color="#ffffff" />
                            </Button>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </CardContent>
                </Card>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav activeTab="board" onTabChange={onTabChange} badges={badges} />
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: '#1d4ed8',
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
    color: '#2563eb',
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
    color: '#1d4ed8',
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
