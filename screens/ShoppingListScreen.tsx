import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BottomNav } from '../components/BottomNav';
import { Header } from '../components/Header';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { useAppStore } from '../store/useAppStore';

interface ShoppingListScreenProps {
  onNavigate: (screen: string) => void;
  onTabChange: (tab: string) => void;
  onBack?: () => void;
}

export function ShoppingListScreen({ onNavigate, onTabChange, onBack }: ShoppingListScreenProps) {
  const shoppingList = useAppStore((state) => state.shoppingList);
  const user = useAppStore((state) => state.user);
  const claimShoppingItem = useAppStore((state) => state.claimShoppingItem);
  const markAsPurchased = useAppStore((state) => state.markAsPurchased);
  const expenses = useAppStore((state) => state.expenses);
  const tasks = useAppStore((state) => state.tasks);
  const boardPosts = useAppStore((state) => state.boardPosts);
  const calendarEvents = useAppStore((state) => state.calendarEvents);

  const activeShoppingItems = shoppingList.filter((item) => !item.purchased).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const upcomingEvents = calendarEvents.filter((event) => new Date(event.endDate) >= new Date()).length;

  const activeItems = shoppingList.filter((item) => !item.purchased);
  const purchasedItems = shoppingList.filter((item) => item.purchased);

  const handleClaim = (itemId: string) => {
    if (!user) return;
    claimShoppingItem(itemId, user.id);
  };

  const handlePurchase = (itemId: string) => {
    markAsPurchased(itemId);
  };

  const renderEmptyState = () => (
    <Card style={styles.card}>
      <CardContent style={[styles.cardContent, styles.centerContent]}>
        <Ionicons name="cart-outline" size={48} color="#9ca3af" style={styles.emptyIcon} />
        <Text style={styles.emptyTitle}>Lista zakupów jest pusta</Text>
        <Text style={styles.emptySubtitle}>Dodaj produkty, które trzeba kupić</Text>
        <Button style={styles.fullWidthButton} onPress={() => onNavigate('add-shopping-item')}>
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
        onBack={onBack || (() => onNavigate('dashboard'))}
        rightAction={
          <View style={styles.headerAction}>
            <Ionicons
              name="add"
              size={24}
              color="#2563eb"
              onPress={() => onNavigate('add-shopping-item')}
            />
          </View>
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
                          <View>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            {item.quantity ? <Text style={styles.itemSubtitle}>{item.quantity}</Text> : null}
                          </View>

                          {item.estimatedPrice ? (
                            <Text style={styles.itemPrice}>{item.estimatedPrice.toFixed(2)} zł</Text>
                          ) : null}
                        </View>

                        <View style={styles.itemFooter}>
                          {item.claimedBy ? (
                            <Badge
                              variant="secondary"
                              style={styles.badge}
                              textProps={{ style: styles.badgeText }}
                            >
                              <View style={styles.badgeContent}>
                                <Ionicons name="person-outline" size={14} color="#1d4ed8" style={styles.badgeIcon} />
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
                        <View>
                          <Text style={[styles.itemTitle, styles.purchasedText]}>{item.name}</Text>
                          {item.quantity ? (
                            <Text style={[styles.itemSubtitle, styles.purchasedText]}>{item.quantity}</Text>
                          ) : null}
                        </View>
                        {item.estimatedPrice ? (
                          <Text style={styles.itemPrice}>{item.estimatedPrice.toFixed(2)} zł</Text>
                        ) : null}
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <BottomNav
        activeTab="shopping"
        onTabChange={onTabChange}
        badges={{
          expenses: expenses.length,
          shopping: activeShoppingItems,
          tasks: pendingTasks,
          calendar: upcomingEvents,
          board: boardPosts.length,
        }}
      />
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
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  purchasedCard: {
    opacity: 0.7,
  },
  cardContent: {
    padding: 16,
  },
  centerContent: {
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemBody: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  claimButton: {
    paddingHorizontal: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#1d4ed8',
  },
  badgeTextStrong: {
    fontWeight: '600',
  },
  purchasedText: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  fullWidthButton: {
    width: '100%',
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe',
  },
});