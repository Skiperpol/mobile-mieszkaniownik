import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Plus, CalendarDays, User } from 'lucide-react';

interface CalendarScreenProps {
  onNavigate: (screen: string) => void;
  onTabChange: (tab: string) => void;
  onBack?: () => void;
}

export function CalendarScreen({ onNavigate, onTabChange, onBack }: CalendarScreenProps) {
  const calendarEvents = useAppStore((state) => state.calendarEvents);
  const user = useAppStore((state) => state.user);
  const expenses = useAppStore((state) => state.expenses);
  const shoppingList = useAppStore((state) => state.shoppingList);
  const tasks = useAppStore((state) => state.tasks);
  const boardPosts = useAppStore((state) => state.boardPosts);

  // Calculate badges
  const activeShoppingItems = shoppingList.filter((item) => !item.purchased).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const upcomingEventsCount = calendarEvents.filter(
    (event) => new Date(event.endDate) >= new Date()
  ).length;

  const sortedEvents = [...calendarEvents].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.endDate) >= new Date()
  );

  const pastEvents = sortedEvents.filter(
    (event) => new Date(event.endDate) < new Date()
  );

  const getEventTypeLabel = (type: string) => {
    return type === 'absence' ? 'Nieobecność' : 'Wydarzenie';
  };

  const getEventTypeColor = (type: string) => {
    return type === 'absence' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700';
  };

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = new Date(start).toLocaleDateString('pl-PL');
    const endStr = new Date(end).toLocaleDateString('pl-PL');
    return startStr === endStr ? startStr : `${startStr} - ${endStr}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header
        title="Kalendarz"
        showBack
        onBack={onBack || (() => onNavigate('dashboard'))}
        rightAction={
          <button
            onClick={() => onNavigate('add-absence')}
            className="flex items-center justify-center w-10 h-10 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        }
      />

      <div className="pt-14 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Upcoming Events */}
          <div className="space-y-3">
            <h3 className="text-lg">Nadchodzące ({upcomingEvents.length})</h3>

            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 mb-4">Brak nadchodzących wydarzeń</p>
                  <Button onClick={() => onNavigate('add-absence')}>
                    Dodaj nieobecność
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="mb-1">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getEventTypeColor(event.type)}>
                            {getEventTypeLabel(event.type)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <User className="w-3 h-3 mr-1" />
                            {event.userId === user?.id ? 'Ty' : event.userId}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {formatDateRange(event.startDate, event.endDate)}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg">Przeszłe ({pastEvents.length})</h3>

              {pastEvents.map((event) => (
                <Card key={event.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="mb-1">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getEventTypeColor(event.type)}>
                            {getEventTypeLabel(event.type)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <User className="w-3 h-3 mr-1" />
                            {event.userId === user?.id ? 'Ty' : event.userId}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {formatDateRange(event.startDate, event.endDate)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav 
        activeTab="calendar" 
        onTabChange={onTabChange}
        badges={{
          expenses: expenses.length,
          shopping: activeShoppingItems,
          tasks: pendingTasks,
          calendar: upcomingEventsCount,
          board: boardPosts.length,
        }}
      />
    </div>
  );
}