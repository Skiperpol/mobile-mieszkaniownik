import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { getUserName, getUserAvatar, getUserColor } from '../utils/userNames';

interface GroupMembersScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function GroupMembersScreen({ onNavigate, onBack }: GroupMembersScreenProps) {
  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (currentGroup?.code) {
      navigator.clipboard.writeText(currentGroup.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!currentGroup) return null;

  const isAdmin = currentGroup.createdBy === user?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Członkowie grupy"
        showBack
        onBack={onBack ? onBack : () => onNavigate('dashboard')}
      />

      <div className="pt-14 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Group Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-xl">{currentGroup.name}</h2>
                  <p className="text-sm text-gray-600">
                    {currentGroup.members.length} członków
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Kod grupy</p>
                  <p className="font-mono text-lg">{currentGroup.code}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Skopiowano
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Kopiuj
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Members List */}
          <div className="space-y-3">
            <h3 className="text-lg">Członkowie</h3>

            {currentGroup.members.map((memberId, index) => {
              const isSelf = memberId === user?.id;
              const isMemberAdmin = memberId === currentGroup.createdBy;
              const memberName = getUserName(memberId);

              return (
                <Card key={memberId}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${getUserColor(memberId)} flex items-center justify-center text-2xl shadow-md`}
                        >
                          <span>{getUserAvatar(memberId)}</span>
                        </div>
                        <div>
                          <p className="mb-1">
                            {isSelf ? `${memberName} (Ty)` : memberName}
                          </p>
                          <div className="flex gap-2">
                            {isMemberAdmin && (
                              <Badge variant="secondary" className="text-xs">
                                Admin
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              Członek #{index + 1}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Invite Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="mb-2">Zaproś współlokatorów</h3>
              <p className="text-sm text-gray-700 mb-3">
                Udostępnij kod grupy <span className="font-mono font-semibold">{currentGroup.code}</span> swoim współlokatorom, aby mogli dołączyć.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}