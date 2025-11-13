import { Redirect } from 'expo-router';
import { useAppStore } from '../hooks/useAppStore';
import type { AppState } from '../types/app';

export default function RootIndex() {
  const isAuthenticated = useAppStore((status: AppState) => status.isAuthenticated);
  const currentGroup = useAppStore((status: AppState) => status.currentGroup);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />; 
  }

  if (!currentGroup) {
    return <Redirect href="/join-or-create" />; 
  }

  return <Redirect href="/(group)" />;
}