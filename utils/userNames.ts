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

// Helper function to get user color
export const getUserColor = (userId: string): string => {
  const userColors: Record<string, string> = {
    'user-1': 'from-purple-400 to-pink-500',
    'user-2': 'from-blue-400 to-indigo-500',
    'user-3': 'from-orange-400 to-red-500',
  };
  
  return userColors[userId] || 'from-gray-400 to-gray-500';
};
