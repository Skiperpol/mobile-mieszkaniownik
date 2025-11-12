import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { styles } from './BoardPostsScreen.style';

export default function BoardPostsScreen() {
  const router = useRouter();
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

  const handleTabChange = (tab: string) => {
    if (tab === 'expenses') router.push('/(group)/expenses');
    else if (tab === 'shopping') router.push('/(group)/shopping-list');
    else if (tab === 'tasks') router.push('/(group)/tasks');
    else if (tab === 'calendar') router.push('/(group)/calendar');
    else if (tab === 'board') router.push('/(group)/board');
  };

  return (
    <View style={styles.root}>
      <Header
        title="Tablica ogłoszeń"
        showBack
        onBack={() => router.back()}
        rightAction={
          <Button variant="ghost" style={styles.iconButton} onPress={() => router.push('/(group)/add-board-post')}>
            <Ionicons name="add" size={22} color="#155DFC" />
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
                <Button onPress={() => router.push('/(group)/add-board-post')}>Dodaj pierwsze ogłoszenie</Button>
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
                          <Ionicons name="chatbox-ellipses-outline" size={16} color="#155DFC" />
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

      <BottomNav activeTab="board" onTabChange={handleTabChange} badges={badges} />
    </View>
  );
}

