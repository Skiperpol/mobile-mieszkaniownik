import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/hooks/useAppStore';
import { styles } from './ShoppingListScreen.style';

export default function ShoppingListScreen() {
  const router = useRouter();
  const shoppingList = useAppStore((state) => state.shoppingList);
  const user = useAppStore((state) => state.user);
  const claimShoppingItem = useAppStore((state) => state.claimShoppingItem);
  const markAsPurchased = useAppStore((state) => state.markAsPurchased);
  const deleteShoppingItem = useAppStore((state) => state.deleteShoppingItem);

  const activeItems = shoppingList.filter((item) => !item.purchased);
  const purchasedItems = shoppingList.filter((item) => item.purchased);

  const handleClaim = (itemId: string) => {
    if (!user) return;
    claimShoppingItem(itemId, user.id);
  };

  const handlePurchase = (itemId: string) => {
    markAsPurchased(itemId);
  };

  const handleDelete = (itemId: string, itemName: string) => {
    Alert.alert(
      'Usuń produkt',
      `Czy na pewno chcesz usunąć "${itemName}" z listy zakupów?`,
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => deleteShoppingItem(itemId),
        },
      ]
    );
  };


  const renderEmptyState = () => (
    <Card style={styles.card}>
      <CardContent style={[styles.cardContent, styles.centerContent]}>
        <Ionicons name="cart-outline" size={48} color="#9ca3af" style={styles.emptyIcon} />
        <Text style={styles.emptyTitle}>Lista zakupów jest pusta</Text>
        <Text style={styles.emptySubtitle}>Dodaj produkty, które trzeba kupić</Text>
        <Button style={styles.fullWidthButton} onPress={() => router.push('/(group)/add-shopping-item')}>
          Dodaj pierwszy produkt
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Lista zakupów"
        showBack
        onBack={() => router.back()}
        rightAction={
          <Pressable onPress={() => router.push('/(group)/add-shopping-item')} style={styles.headerAction} hitSlop={10}>
            <Ionicons name="add" size={24} color="#155DFC" />
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Do kupienia ({activeItems.length})</Text>
          </View>

          {activeItems.length === 0
            ? renderEmptyState()
            : activeItems.map((item) => (
                <Card key={item.id} style={styles.card}>
                  <CardContent style={styles.cardContent}>
                    <View style={styles.itemRow}>
                      <Checkbox
                        checked={item.purchased}
                        onChange={() => handlePurchase(item.id)}
                        disabled={!item.claimedBy}
                      />

                      <View style={styles.itemBody}>
                        <View style={styles.itemHeader}>
                          <View style={styles.itemHeaderLeft}>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            {item.quantity ? <Text style={styles.itemSubtitle}>{item.quantity}</Text> : null}
                          </View>

                          <View style={styles.itemHeaderRight}>
                            {item.estimatedPrice ? (
                              <Text style={styles.itemPrice}>{item.estimatedPrice.toFixed(2)} zł</Text>
                            ) : null}
                            {item.addedBy === user?.id ? (
                              <Pressable
                                onPress={() => handleDelete(item.id, item.name)}
                                style={styles.deleteButton}
                                hitSlop={8}
                              >
                                <Ionicons name="trash-outline" size={20} color="#dc2626" />
                              </Pressable>
                            ) : null}
                          </View>
                        </View>

                        <View style={styles.itemFooter}>
                          {item.claimedBy ? (
                            <Badge
                              variant="secondary"
                              style={styles.badge}
                              textProps={{ style: styles.badgeText }}
                            >
                              <View style={styles.badgeContent}>
                                <Ionicons name="person-outline" size={14} color="#155DFC" style={styles.badgeIcon} />
                                <Text style={[styles.badgeText, styles.badgeTextStrong]}>
                                  {item.claimedBy === user?.id ? 'Ty kupisz' : 'Ktoś kupuje'}
                                </Text>
                              </View>
                            </Badge>
                          ) : (
                            <Button size="sm" variant="outline" style={styles.claimButton} onPress={() => handleClaim(item.id)}>
                              Ja kupię
                            </Button>
                          )}
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              ))}
        </View>

        {purchasedItems.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kupione ({purchasedItems.length})</Text>

            {purchasedItems.map((item) => (
              <Card key={item.id} style={[styles.card, styles.purchasedCard]}>
                <CardContent style={styles.cardContent}>
                    <View style={styles.itemRow}>
                    <Checkbox checked disabled />
                    <View style={styles.itemBody}>
                      <View style={styles.itemHeader}>
                        <View style={styles.itemHeaderLeft}>
                          <Text style={[styles.itemTitle, styles.purchasedText]}>{item.name}</Text>
                          {item.quantity ? (
                            <Text style={[styles.itemSubtitle, styles.purchasedText]}>{item.quantity}</Text>
                          ) : null}
                        </View>

                        <View style={styles.itemHeaderRight}>
                          {item.estimatedPrice ? (
                            <Text style={styles.itemPrice}>{item.estimatedPrice.toFixed(2)} zł</Text>
                          ) : null}
                          {item.addedBy === user?.id ? (
                            <Pressable
                              onPress={() => handleDelete(item.id, item.name)}
                              style={styles.deleteButton}
                              hitSlop={8}
                            >
                              <Ionicons name="trash-outline" size={20} color="#dc2626" />
                            </Pressable>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        ) : null}
      </ScrollView>

      {/* <BottomNav
        activeTab="shopping"
        onTabChange={handleTabChange}
      /> */}
    </View>
  );
}

