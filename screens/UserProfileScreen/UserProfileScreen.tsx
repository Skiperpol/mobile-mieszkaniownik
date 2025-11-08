import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui2/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, Users, LogOut, Home } from 'lucide-react';
import { router } from 'expo-router';

export default function UserProfileScreen() {
  const user = useAppStore((state) => state.user);
  const currentGroup = useAppStore((state) => state.currentGroup);
  const logout = useAppStore((state) => state.logout);
  const leaveGroup = useAppStore((state) => state.leaveGroup);

  const handleLogout = () => {
    logout();
    router.push('/(auth)/login');
  };

  const handleLeaveGroup = () => {
    leaveGroup();
    router.push('/join-or-create');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Profil"
        showBack
        onBack={() => router.back()}
      />

      <div className="pt-14 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* User Info */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl mx-auto mb-4">
                {user?.name[0]?.toUpperCase()}
              </div>
              <h2 className="text-2xl mb-1">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </CardContent>
          </Card>

          {/* Group Info */}
          {currentGroup && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Home className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Twoja grupa</p>
                    <p className="text-lg">{currentGroup.name}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/group/members')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Zobacz członków
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Account Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p>{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">ID użytkownika</p>
                  <p className="text-sm font-mono">{user?.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            {currentGroup && (
              <Button
                variant="outline"
                className="w-full text-orange-600 hover:bg-orange-50"
                onClick={handleLeaveGroup}
              >
                Opuść grupę
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Wyloguj się
            </Button>
          </div>

          {/* App Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="mb-2">O aplikacji</h3>
              <p className="text-sm text-gray-700">
                <strong>Mieszkaniownik</strong> - aplikacja do zarządzania wspólnym mieszkaniem
              </p>
              <p className="text-xs text-gray-600 mt-2">Wersja 1.0.0</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}