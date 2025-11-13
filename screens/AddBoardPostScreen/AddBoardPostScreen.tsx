import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { useAppStore } from '@/hooks/useAppStore';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { styles } from './AddBoardPostScreen.style';
import { validateTitle, validateRequired } from '@/utils/validation';

export default function AddBoardPostScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const addBoardPost = useAppStore((state) => state.addBoardPost);

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Brak uprawnień', 'Musisz udzielić uprawnień do galerii, aby dodać zdjęcie.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Błąd', 'Nie udało się wybrać zdjęcia.');
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const handleSubmit = () => {
    if (!currentGroup || !user) {
      Alert.alert('Błąd', 'Musisz być zalogowany i należeć do grupy, aby dodać ogłoszenie.');
      return;
    }

    const postData: Parameters<typeof addBoardPost>[0] = {
      groupId: currentGroup.id,
      authorId: user.id,
      title: title.trim(),
      content: content.trim(),
    };

    if (imageUri) {
      postData.imageUrl = imageUri;
    }

    addBoardPost(postData);
    router.back();
  };

  return (
    <View style={styles.root}>
      <Header
        title="Nowe ogłoszenie"
        showBack
        onBack={() => router.back()}
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
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <View style={styles.field}>
                <Label>Tytuł</Label>
                <Input
                  placeholder="np. Impreza w piątek!"
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                  autoCapitalize="sentences"
                  returnKeyType="next"
                />
                {errors.title && <Text style={styles.error}>{errors.title}</Text>}
              </View>

              <View style={styles.field}>
                <Label>Treść</Label>
                <Textarea
                  placeholder="Napisz wiadomość dla współlokatorów..."
                  value={content}
                  onChangeText={(text) => {
                    setContent(text);
                    if (errors.content) {
                      setErrors((prev) => ({ ...prev, content: undefined }));
                    }
                  }}
                  multiline
                  numberOfLines={8}
                  minHeight={160}
                />
                {errors.content && <Text style={styles.error}>{errors.content}</Text>}
              </View>

              <View style={styles.field}>
                <Label>Zdjęcie (opcjonalne)</Label>
                {imageUri ? (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                    <Pressable style={styles.removeImageButton} onPress={removeImage}>
                      <Ionicons name="close-circle" size={24} color="#dc2626" />
                    </Pressable>
                  </View>
                ) : (
                  <Button variant="outline" onPress={pickImage} style={styles.imageButton}>
                    <View style={styles.imageButtonContent}>
                      <Ionicons name="image-outline" size={20} color="#155DFC" />
                      <Text style={styles.imageButtonText}>Dodaj zdjęcie</Text>
                    </View>
                  </Button>
                )}
              </View>

              <Button onPress={handleSubmit} disabled={!title.trim() || !content.trim()} style={styles.submitButton}>
                Opublikuj ogłoszenie
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

