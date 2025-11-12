import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { getUserAvatar, getUserColor, getUserName } from '@/utils/userNames';
import { styles } from './GroupMembersScreen.style';

export default function GroupMembersScreen() {
  const router = useRouter();
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
        onBack={() => router.back()}
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
                <Ionicons name="people-outline" size={24} color="#155DFC" />
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

