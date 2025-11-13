import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppStore } from '@/hooks/useAppStore';
import { useRouter } from 'expo-router';
import { styles } from './JoinOrCreateGroupScreen.style';
import { SelectMode } from './components/SelectMode';
import { CreateGroupForm } from './components/CreateGroupForm';
import { CreateGroupSuccess } from './components/CreateGroupSuccess';
import { JoinGroupForm } from './components/JoinGroupForm';

type Mode = 'select' | 'create' | 'join';

export default function JoinOrCreateGroupScreen() {
  const [mode, setMode] = useState<Mode>('select');
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const router = useRouter();

  const createGroup = useAppStore((s) => s.createGroup);
  const joinGroup = useAppStore((state) => state.joinGroup);

  const canCreate = useMemo(() => groupName.trim().length >= 3, [groupName]);
  const canJoin = useMemo(() => groupCode.trim().length === 6, [groupCode]);

  const handleCreateGroup = useCallback(async () => {
    if (!canCreate) return;
    setLoading(true);
    try {
      const code = await createGroup(groupName.trim());
      setGeneratedCode(code);
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setLoading(false);
    }
  }, [canCreate, createGroup, groupName]);

  const handleJoinGroup = useCallback(async () => {
    if (!canJoin) return;
    setLoading(true);
    try {
      await joinGroup(groupCode.trim().toUpperCase());
      router.push('/(group)');
    } catch (error) {
      console.error('Failed to join group:', error);
    } finally {
      setLoading(false);
    }
  }, [canJoin, groupCode, joinGroup, router]);

  const handleFinishCreate = useCallback(() => {
    router.push('/(group)');
  }, [router]);

  const handleScanQr = useCallback(() => {
    router.push('/join-or-create/scan-qr');
  }, [router]);

  return (
    <LinearGradient colors={['#f3f7ff', '#ffffff']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {mode === 'select' ? (
              <SelectMode onCreatePress={() => setMode('create')} onJoinPress={() => setMode('join')} />
            ) : null}
            {mode === 'create' && !generatedCode ? (
              <CreateGroupForm
                groupName={groupName}
                canCreate={canCreate}
                loading={loading}
                onGroupNameChange={setGroupName}
                onSubmit={handleCreateGroup}
                onBack={() => setMode('select')}
              />
            ) : null}
            {mode === 'create' && generatedCode ? (
              <CreateGroupSuccess code={generatedCode} onContinue={handleFinishCreate} />
            ) : null}
            {mode === 'join' ? (
              <JoinGroupForm
                groupCode={groupCode}
                canJoin={canJoin}
                loading={loading}
                onCodeChange={(value) => setGroupCode(value.toUpperCase())}
                onSubmit={handleJoinGroup}
                onBack={() => setMode('select')}
                onScanPress={handleScanQr}
              />
            ) : null}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
