import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../components/Header';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAppStore } from '../store/useAppStore';
import { getUserAvatar, getUserColor, getUserName } from '../utils/userNames';

interface GroupMembersScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function GroupMembersScreen({ onNavigate, onBack }: GroupMembersScreenProps) {
  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const [copied, setCopied] = useState(false);

  if (!currentGroup) {
    return null;
  }

  const handleCopyCode = async () => {
    if (!currentGroup.code) return;

    try {
      await Clipboard.setStringAsync(currentGroup.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Failed to copy code', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Członkowie grupy"
        showBack
        onBack={onBack ? onBack : () => onNavigate('dashboard')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <CardContent style={styles.cardContent}>
            <View style={styles.groupHeader}>
              <View style={styles.groupIcon}>
                <Ionicons name="people-outline" size={24} color="#1d4ed8" />
              </View>
              <View>
                <Text style={styles.groupName}>{currentGroup.name}</Text>
                <Text style={styles.groupMembers}>{currentGroup.members.length} członków</Text>
              </View>
            </View>

            <View style={styles.groupCode}>
              <View>
                <Text style={styles.groupCodeLabel}>Kod grupy</Text>
                <Text style={styles.groupCodeValue}>{currentGroup.code}</Text>
              </View>
              <Button
                variant="outline"
                size="sm"
                style={styles.copyButton}
                textStyle={copied ? styles.copyButtonTextSuccess : undefined}
                onPress={handleCopyCode}
              >
                <View style={styles.copyButtonContent}>
                  <Ionicons
                    name={copied ? 'checkmark-outline' : 'copy-outline'}
                    size={16}
                    color={copied ? '#047857' : '#4338ca'}
                    style={styles.copyButtonIcon}
                  />
                  <Text style={[styles.copyButtonLabel, copied ? styles.copySuccessLabel : undefined]}>
                    {copied ? 'Skopiowano' : 'Kopiuj'}
                  </Text>
                </View>
              </Button>
            </View>
          </CardContent>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Członkowie</Text>

          {currentGroup.members.map((memberId, index) => {
            const isSelf = memberId === user?.id;
            const isMemberAdmin = memberId === currentGroup.createdBy;
            const memberName = getUserName(memberId);
            const [startColor, endColor] = getUserColor(memberId);

            return (
              <Card key={memberId} style={styles.card}>
                <CardContent style={styles.cardContent}>
                  <View style={styles.memberRow}>
                    <LinearGradient
                      colors={[startColor, endColor]}
                      style={styles.memberAvatar}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.memberAvatarEmoji}>{getUserAvatar(memberId)}</Text>
                    </LinearGradient>

                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>
                        {isSelf ? `${memberName} (Ty)` : memberName}
                      </Text>
                      <View style={styles.memberBadges}>
                        {isMemberAdmin ? (
                          <Badge
                            variant="secondary"
                            style={styles.badge}
                            textProps={{ style: styles.badgeText }}
                          >
                            Admin
                          </Badge>
                        ) : null}
                        <Badge variant="outline" style={styles.badge} textProps={{ style: styles.badgeText }}>
                          Członek #{index + 1}
                        </Badge>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            );
          })}
        </View>

        <Card style={[styles.card, styles.inviteCard]}>
          <CardContent style={styles.cardContent}>
            <Text style={styles.inviteTitle}>Zaproś współlokatorów</Text>
            <Text style={styles.inviteDescription}>
              Udostępnij kod grupy{' '}
              <Text style={styles.inviteCode}>{currentGroup.code}</Text>{' '}
              swoim współlokatorom, aby mogli dołączyć.
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: '#1d4ed8',
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