import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Plus, CheckCircle2, Clock, User } from 'lucide-react';
import { getUserName, getUserAvatar } from '../utils/userNames';

interface TasksScheduleScreenProps {
  onNavigate: (screen: string) => void;
  onTabChange: (tab: string) => void;
  onBack?: () => void;
}

export function TasksScheduleScreen({ onNavigate, onTabChange, onBack }: TasksScheduleScreenProps) {
  const tasks = useAppStore((state) => state.tasks);
  const user = useAppStore((state) => state.user);
  const completeTask = useAppStore((state) => state.completeTask);
  const expenses = useAppStore((state) => state.expenses);
  const shoppingList = useAppStore((state) => state.shoppingList);
  const boardPosts = useAppStore((state) => state.boardPosts);
  const calendarEvents = useAppStore((state) => state.calendarEvents);

  // Calculate badges
  const activeShoppingItems = shoppingList.filter((item) => !item.purchased).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const upcomingEvents = calendarEvents.filter(
    (event) => new Date(event.endDate) >= new Date()
  ).length;

  const myTasks = tasks.filter((task) => task.assignedTo === user?.id);
  const otherTasks = tasks.filter((task) => task.assignedTo !== user?.id);

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      daily: 'Codziennie',
      weekly: 'Co tydzień',
      monthly: 'Co miesiąc',
    };
    return labels[frequency] || frequency;
  };

  const getFrequencyColor = (frequency: string) => {
    const colors: Record<string, string> = {
      daily: 'bg-red-100 text-red-700',
      weekly: 'bg-blue-100 text-blue-700',
      monthly: 'bg-green-100 text-green-700',
    };
    return colors[frequency] || 'bg-gray-100 text-gray-700';
  };

  const handleComplete = (taskId: string) => {
    completeTask(taskId);
  };

  const isOverdue = (dueDate: Date) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header
        title="Harmonogram sprzątania"
        showBack
        onBack={onBack || (() => onNavigate('dashboard'))}
        rightAction={
          <button
            onClick={() => onNavigate('add-task')}
            className="flex items-center justify-center w-10 h-10 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        }
      />

      <div className="pt-14 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* My Tasks */}
          <div className="space-y-3">
            <h3 className="text-lg">Twoje zadania ({myTasks.length})</h3>

            {myTasks.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p className="text-gray-600">Nie masz żadnych zadań do wykonania</p>
                </CardContent>
              </Card>
            ) : (
              myTasks.map((task) => (
                <Card
                  key={task.id}
                  className={isOverdue(task.dueDate) ? 'border-red-200 bg-red-50' : ''}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="mb-1">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getFrequencyColor(task.frequency)}>
                            {getFrequencyLabel(task.frequency)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString('pl-PL')}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleComplete(task.id)}
                      className="w-full"
                      variant={isOverdue(task.dueDate) ? 'default' : 'outline'}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Oznacz jako wykonane
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Other Tasks */}
          {otherTasks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg">Zadania innych ({otherTasks.length})</h3>

              {otherTasks.map((task) => (
                <Card key={task.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="mb-1">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getFrequencyColor(task.frequency)}>
                            {getFrequencyLabel(task.frequency)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <User className="w-3 h-3 mr-1" />
                            {getUserName(task.assignedTo)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString('pl-PL')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tasks.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">Brak zadań w harmonogramie</p>
                <Button onClick={() => onNavigate('add-task')}>
                  Dodaj pierwsze zadanie
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <BottomNav 
        activeTab="tasks" 
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