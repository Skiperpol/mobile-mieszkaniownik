// Helper function to get user display name
export const getUserName = (userId: string): string => {
  const userNames: Record<string, string> = {
    'user-1': 'Anna Kowalska',
    'user-2': 'Marek Nowak',
    'user-3': 'Kasia Wiśniewska',
  };
  
  return userNames[userId] || userId;
};

// Helper function to get user avatar/emoji
export const getUserAvatar = (userId: string): string => {
  const userAvatars: Record<string, string> = {
    'user-1': '👩',
    'user-2': '👨',
    'user-3': '👩‍🦰',
  };
  
  return userAvatars[userId] || '👤';
};

// Helper function to get user gradient colors
export const getUserColor = (userId: string): readonly [string, string] => {
  const userColors: Record<string, readonly [string, string]> = {
    'user-1': ['#a855f7', '#ec4899'],
    'user-2': ['#38bdf8', '#6366f1'],
    'user-3': ['#fb923c', '#ef4444'],
  };

  return userColors[userId] || ['#9ca3af', '#6b7280'];
};
