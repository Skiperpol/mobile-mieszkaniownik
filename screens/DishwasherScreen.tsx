import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { UtensilsCrossed, Play, Plus, Check } from 'lucide-react';

interface DishwasherScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function DishwasherScreen({ onNavigate, onBack }: DishwasherScreenProps) {
  const dishwasherStatus = useAppStore((state) => state.dishwasherStatus);
  const user = useAppStore((state) => state.user);
  const currentGroup = useAppStore((state) => state.currentGroup);
  const updateDishwasherStatus = useAppStore((state) => state.updateDishwasherStatus);

  const status = dishwasherStatus?.status || 'empty';

  const getStatusInfo = () => {
    switch (status) {
      case 'empty':
        return {
          color: 'bg-gray-100 border-gray-200',
          iconColor: 'text-gray-400',
          title: 'Pusta',
          description: 'Można zacząć wkładać naczynia',
        };
      case 'loading':
        return {
          color: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-500',
          title: 'Dorzucam naczynia',
          description: 'Jeszcze nie uruchamiaj!',
        };
      case 'running':
        return {
          color: 'bg-green-50 border-green-200',
          iconColor: 'text-green-500',
          title: 'Zmywa',
          description: 'W toku...',
        };
      case 'clean':
        return {
          color: 'bg-purple-50 border-purple-200',
          iconColor: 'text-purple-500',
          title: 'Czyste naczynia',
          description: 'Trzeba wyładować',
        };
      default:
        return {
          color: 'bg-gray-100 border-gray-200',
          iconColor: 'text-gray-400',
          title: 'Nieznany status',
          description: '',
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleAddDishes = () => {
    if (!user) return;
    updateDishwasherStatus('loading', user.id);
  };

  const handleStart = () => {
    if (!user) return;
    updateDishwasherStatus('running', user.id);
  };

  const handleUnload = () => {
    updateDishwasherStatus('empty');
  };

  const canStart = status === 'loading';
  const canUnload = status === 'clean';
  const canAddDishes = status === 'empty' || status === 'loading';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Status zmywarki"
        showBack
        onBack={onBack || (() => onNavigate('dashboard'))}
      />

      <div className="pt-14 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Status Card */}
          <Card className={statusInfo.color}>
            <CardContent className="p-6 text-center">
              <UtensilsCrossed className={`w-20 h-20 mx-auto mb-4 ${statusInfo.iconColor}`} />
              <h2 className="text-2xl mb-2">{statusInfo.title}</h2>
              <p className="text-gray-700">{statusInfo.description}</p>

              {status === 'running' && dishwasherStatus?.startedAt && (
                <p className="text-sm text-gray-600 mt-3">
                  Uruchomiona: {new Date(dishwasherStatus.startedAt).toLocaleString('pl-PL')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {canAddDishes && (
              <Button
                onClick={handleAddDishes}
                className="w-full"
                size="lg"
                variant={status === 'loading' ? 'outline' : 'default'}
              >
                <Plus className="w-5 h-5 mr-2" />
                Dorzucam naczynia
              </Button>
            )}

            {canStart && (
              <Button
                onClick={handleStart}
                className="w-full"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Uruchom zmywarkę
              </Button>
            )}

            {status === 'running' && (
              <Button
                onClick={() => updateDishwasherStatus('clean')}
                className="w-full"
                size="lg"
                variant="outline"
              >
                <Check className="w-5 h-5 mr-2" />
                Zmywanie zakończone
              </Button>
            )}

            {canUnload && (
              <Button
                onClick={handleUnload}
                className="w-full"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Wyładowałem naczynia
              </Button>
            )}
          </div>

          {/* Contributors */}
          {status === 'loading' && dishwasherStatus?.contributors && dishwasherStatus.contributors.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm mb-3">Dorzucają naczynia:</h3>
                <div className="flex flex-wrap gap-2">
                  {dishwasherStatus.contributors.map((contributorId, index) => (
                    <Badge key={index} variant="secondary">
                      {contributorId === user?.id ? 'Ty' : contributorId}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-3">Jak to działa?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Kliknij "Dorzucam naczynia" gdy wkładasz brudne naczynia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Gdy zmywarka jest pełna, kliknij "Uruchom zmywarkę"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Po zakończeniu cyklu, oznacz jako "Czyste naczynia"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Wyładuj zmywarkę i kliknij "Wyładowałem naczynia"</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}