// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  createdBy: string;
  members: string[];
  createdAt: Date;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  splitAmounts?: Record<string, number>;
  category: string;
  date: Date;
  description?: string;
}

export interface ShoppingItem {
  id: string;
  groupId: string;
  name: string;
  quantity: string;
  addedBy: string;
  claimedBy?: string;
  purchased: boolean;
  estimatedPrice?: number;
  createdAt: Date;
}

export interface Task {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  assignedTo: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  dueDate: Date;
  rotationOrder: string[];
}

export interface BoardPost {
  id: string;
  groupId: string;
  authorId: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  groupId: string;
  title: string;
  type: 'absence' | 'event';
  userId: string;
  startDate: Date;
  endDate: Date;
  description?: string;
}

export interface BathroomReservation {
  id: string;
  groupId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  occupied: boolean;
}

export interface DishwasherStatus {
  groupId: string;
  status: 'empty' | 'loading' | 'running' | 'clean';
  startedBy?: string;
  startedAt?: Date;
  contributors: string[];
}

export interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Group
  currentGroup: Group | null;
  
  // Data
  expenses: Expense[];
  shoppingList: ShoppingItem[];
  tasks: Task[];
  boardPosts: BoardPost[];
  calendarEvents: CalendarEvent[];
  bathroomReservations: BathroomReservation[];
  dishwasherStatus: DishwasherStatus | null;
  
  // Actions - Auth
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  
  // Actions - Group
  createGroup: (name: string) => Promise<string>;
  joinGroup: (code: string) => Promise<void>;
  leaveGroup: () => void;
  
  // Actions - Expenses
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  settleDebt: (fromUser: string, toUser: string, amount: number) => void;
  
  // Actions - Shopping
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'createdAt'>) => void;
  claimShoppingItem: (itemId: string, userId: string) => void;
  markAsPurchased: (itemId: string) => void;
  deleteShoppingItem: (itemId: string) => void;
  
  // Actions - Tasks
  addTask: (task: Omit<Task, 'id'>) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  
  // Actions - Board
  addBoardPost: (post: Omit<BoardPost, 'id' | 'createdAt' | 'comments'>) => void;
  deleteBoardPost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  
  // Actions - Calendar
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (eventId: string) => void;
  
  // Actions - Bathroom
  reserveBathroom: (reservation: Omit<BathroomReservation, 'id'>) => void;
  releaseBathroom: (reservationId: string) => void;
  deleteBathroomReservation: (reservationId: string) => void;
  
  // Actions - Dishwasher
  updateDishwasherStatus: (status: DishwasherStatus['status'], userId?: string) => void;
}

