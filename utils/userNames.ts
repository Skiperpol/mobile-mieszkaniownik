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

// Helper function to generate gradient colors based on user ID or name
const generateGradientColors = (identifier: string): readonly [string, string] => {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Predefined gradient color palettes
  const gradients: readonly [string, string][] = [
    ['#a855f7', '#ec4899'], // Purple to Pink
    ['#38bdf8', '#6366f1'], // Sky to Indigo
    ['#fb923c', '#ef4444'], // Orange to Red
    ['#10b981', '#059669'], // Green
    ['#f59e0b', '#d97706'], // Amber
    ['#8b5cf6', '#7c3aed'], // Violet
    ['#ec4899', '#be185d'], // Pink to Rose
    ['#06b6d4', '#0891b2'], // Cyan
    ['#14b8a6', '#0d9488'], // Teal
    ['#f97316', '#ea580c'], // Orange
    ['#6366f1', '#4f46e5'], // Indigo
    ['#84cc16', '#65a30d'], // Lime
  ];
  
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

// Helper function to get user gradient colors
export const getUserColor = (userId: string): readonly [string, string] => {
  const userColors: Record<string, readonly [string, string]> = {
    'user-1': ['#a855f7', '#ec4899'],
    'user-2': ['#38bdf8', '#6366f1'],
    'user-3': ['#fb923c', '#ef4444'],
  };

  // Return predefined color if exists, otherwise generate based on userId
  return userColors[userId] || generateGradientColors(userId);
};
