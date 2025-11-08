import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Plus, ShoppingBag, User } from 'lucide-react';

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

  // Calculate badges
  const activeShoppingItems = shoppingList.filter((item) => !item.purchased).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const upcomingEvents = calendarEvents.filter(
    (event) => new Date(event.endDate) >= new Date()
  ).length;

  const activeItems = shoppingList.filter((item) => !item.purchased);
  const purchasedItems = shoppingList.filter((item) => item.purchased);

  const handleClaim = (itemId: string) => {
    if (!user) return;
    claimShoppingItem(itemId, user.id);
  };

  const handlePurchase = (itemId: string) => {
    markAsPurchased(itemId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header
        title="Lista zakupów"
        showBack
        onBack={onBack || (() => onNavigate('dashboard'))}
        rightAction={
          <button
            onClick={() => onNavigate('add-shopping-item')}
            className="flex items-center justify-center w-10 h-10 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        }
      />

      <div className="pt-14 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Active Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg">Do kupienia ({activeItems.length})</h3>
            </div>

            {activeItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 mb-4">Lista zakupów jest pusta</p>
                  <Button onClick={() => onNavigate('add-shopping-item')}>
                    Dodaj pierwszy produkt
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={item.purchased}
                        onCheckedChange={() => handlePurchase(item.id)}
                        disabled={!item.claimedBy}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h4>{item.name}</h4>
                            {item.quantity && (
                              <p className="text-sm text-gray-600">{item.quantity}</p>
                            )}
                          </div>
                          {item.estimatedPrice && (
                            <p className="text-sm">{item.estimatedPrice.toFixed(2)} zł</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          {item.claimedBy ? (
                            <Badge variant="secondary" className="text-xs">
                              <User className="w-3 h-3 mr-1" />
                              {item.claimedBy === user?.id ? 'Ty kupisz' : 'Ktoś kupuje'}
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleClaim(item.id)}
                            >
                              Ja kupię
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Purchased Items */}
          {purchasedItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg">Kupione ({purchasedItems.length})</h3>

              {purchasedItems.map((item) => (
                <Card key={item.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked disabled />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="line-through">{item.name}</h4>
                            {item.quantity && (
                              <p className="text-sm text-gray-600 line-through">{item.quantity}</p>
                            )}
                          </div>
                          {item.estimatedPrice && (
                            <p className="text-sm">{item.estimatedPrice.toFixed(2)} zł</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
}