import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

interface AddBoardPostScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function AddBoardPostScreen({ onNavigate, onBack }: AddBoardPostScreenProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const addBoardPost = useAppStore((state) => state.addBoardPost);

  const handleSubmit = () => {
    if (!currentGroup || !user || !title.trim() || !content.trim()) {
      return;
    }

    addBoardPost({
      groupId: currentGroup.id,
      authorId: user.id,
      title: title.trim(),
      content: content.trim(),
    });

    onNavigate('board');
  };

  return (
    <View style={styles.root}>
      <Header
        title="Nowe ogłoszenie"
        showBack
        onBack={onBack ? onBack : () => onNavigate('board')}
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
          <View style={styles.card}>
            <View style={styles.field}>
              <Label>Tytuł</Label>
              <Input
                placeholder="np. Impreza w piątek!"
                value={title}
                onChangeText={setTitle}
                autoCapitalize="sentences"
                returnKeyType="next"
              />
            </View>

            <View style={styles.field}>
              <Label>Treść</Label>
              <Textarea
                placeholder="Napisz wiadomość dla współlokatorów..."
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={8}
                minHeight={160}
              />
            </View>

            <Button onPress={handleSubmit} disabled={!title.trim() || !content.trim()}>
              Opublikuj ogłoszenie
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    gap: 20,
  },
  field: {
    gap: 8,
  },
});
