import { create } from 'zustand';
import { createMockData } from './mockData';

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
  splitAmounts?: Record<string, number>; // Niestandardowy podział: userId -> kwota
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
  
  // Actions - Tasks
  addTask: (task: Omit<Task, 'id'>) => void;
  completeTask: (taskId: string) => void;
  
  // Actions - Board
  addBoardPost: (post: Omit<BoardPost, 'id' | 'createdAt' | 'comments'>) => void;
  deleteBoardPost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  
  // Actions - Calendar
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  
  // Actions - Bathroom
  reserveBathroom: (reservation: Omit<BathroomReservation, 'id'>) => void;
  releaseBathroom: (reservationId: string) => void;
  
  // Actions - Dishwasher
  updateDishwasherStatus: (status: DishwasherStatus['status'], userId?: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  currentGroup: null,
  expenses: [],
  shoppingList: [],
  tasks: [],
  boardPosts: [],
  calendarEvents: [],
  bathroomReservations: [],
  dishwasherStatus: null,
  
  // Auth actions
  login: async (email: string, password: string) => {
    // Mock login - replace with real Firebase/Supabase auth
    const userId = 'user-1';
    const mockUser: User = {
      id: userId,
      email,
      name: 'Anna Kowalska',
      avatar: '👩',
    };
    
    // Mock group with sample data
    const groupId = 'group-1';
    const otherUsers = ['user-2', 'user-3'];
    const mockGroup: Group = {
      id: groupId,
      name: 'Mieszkanie przy Parkowej 12',
      code: 'PARK12',
      createdBy: userId,
      members: [userId, ...otherUsers],
      createdAt: new Date('2024-01-01'),
    };
    
    // Use createMockData to generate all mock data
    const mockData = createMockData(groupId, userId, otherUsers);
    
    set({ 
      user: mockUser, 
      isAuthenticated: true,
      currentGroup: mockGroup,
      expenses: mockData.expenses,
      shoppingList: mockData.shoppingList,
      tasks: mockData.tasks,
      boardPosts: mockData.boardPosts,
      calendarEvents: mockData.calendarEvents,
      bathroomReservations: mockData.bathroomReservations,
      dishwasherStatus: mockData.dishwasherStatus,
    });
  },
  
  register: async (email: string, password: string, name: string) => {
    // Mock registration
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
    };
    set({ user: mockUser, isAuthenticated: true });
  },
  
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      currentGroup: null,
      expenses: [],
      shoppingList: [],
      tasks: [],
      boardPosts: [],
      calendarEvents: [],
      bathroomReservations: [],
      dishwasherStatus: null,
    });
  },
  
  // Group actions
  createGroup: async (name: string) => {
    const userId = get().user?.id || '';
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    const groupId = Math.random().toString(36).substr(2, 9);
    const group: Group = {
      id: groupId,
      name,
      code,
      createdBy: userId,
      members: [userId],
      createdAt: new Date(),
    };
    
    // Add mock data for the new group
    const mockData = createMockData(groupId, userId);
    
    set({ 
      currentGroup: group,
      expenses: mockData.expenses,
      shoppingList: mockData.shoppingList,
      tasks: mockData.tasks,
      boardPosts: mockData.boardPosts,
      calendarEvents: mockData.calendarEvents,
      bathroomReservations: mockData.bathroomReservations,
      dishwasherStatus: mockData.dishwasherStatus,
    });
    return code;
  },
  
  joinGroup: async (code: string) => {
    const userId = get().user?.id || '';
    // Mock join - replace with real backend call
    const groupId = Math.random().toString(36).substr(2, 9);
    const otherUsers = ['user-2', 'user-3'];
    const group: Group = {
      id: groupId,
      name: 'Mieszkanie przy Parkowej 12',
      code,
      createdBy: otherUsers[0],
      members: [...otherUsers, userId],
      createdAt: new Date(),
    };
    
    // Add mock data for the joined group
    const mockData = createMockData(groupId, userId, otherUsers);
    
    set({ 
      currentGroup: group,
      expenses: mockData.expenses,
      shoppingList: mockData.shoppingList,
      tasks: mockData.tasks,
      boardPosts: mockData.boardPosts,
      calendarEvents: mockData.calendarEvents,
      bathroomReservations: mockData.bathroomReservations,
      dishwasherStatus: mockData.dishwasherStatus,
    });
  },
  
  leaveGroup: () => {
    set({ currentGroup: null });
  },
  
  // Expense actions
  addExpense: (expense) => {
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
    };
    set({ expenses: [...get().expenses, newExpense] });
  },
  
  settleDebt: (fromUser, toUser, amount) => {
    const settlement: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      groupId: get().currentGroup?.id || '',
      title: 'Rozliczenie',
      amount,
      paidBy: fromUser,
      splitBetween: [toUser],
      category: 'settlement',
      date: new Date(),
      description: `Przelew od ${fromUser} do ${toUser}`,
    };
    set({ expenses: [...get().expenses, settlement] });
  },
  
  // Shopping actions
  addShoppingItem: (item) => {
    const newItem: ShoppingItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      purchased: false,
    };
    set({ shoppingList: [...get().shoppingList, newItem] });
  },
  
  claimShoppingItem: (itemId, userId) => {
    set({
      shoppingList: get().shoppingList.map(item =>
        item.id === itemId ? { ...item, claimedBy: userId } : item
      ),
    });
  },
  
  markAsPurchased: (itemId) => {
    const item = get().shoppingList.find(i => i.id === itemId);
    if (item && item.estimatedPrice && item.claimedBy) {
      // Create expense automatically
      get().addExpense({
        groupId: item.groupId,
        title: `Zakup: ${item.name}`,
        amount: item.estimatedPrice,
        paidBy: item.claimedBy,
        splitBetween: get().currentGroup?.members || [],
        category: 'shopping',
        date: new Date(),
      });
    }
    
    set({
      shoppingList: get().shoppingList.map(i =>
        i.id === itemId ? { ...i, purchased: true } : i
      ),
    });
  },
  
  // Task actions
  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
    };
    set({ tasks: [...get().tasks, newTask] });
  },
  
  completeTask: (taskId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (task) {
      // Rotate assignment
      const currentIndex = task.rotationOrder.indexOf(task.assignedTo);
      const nextIndex = (currentIndex + 1) % task.rotationOrder.length;
      const nextAssignee = task.rotationOrder[nextIndex];
      
      // Calculate next due date
      const nextDueDate = new Date(task.dueDate);
      if (task.frequency === 'daily') nextDueDate.setDate(nextDueDate.getDate() + 1);
      if (task.frequency === 'weekly') nextDueDate.setDate(nextDueDate.getDate() + 7);
      if (task.frequency === 'monthly') nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      
      set({
        tasks: get().tasks.map(t =>
          t.id === taskId
            ? { ...t, completed: false, assignedTo: nextAssignee, dueDate: nextDueDate }
            : t
        ),
      });
    }
  },
  
  // Board actions
  addBoardPost: (post) => {
    const newPost: BoardPost = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      comments: [],
    };
    set({ boardPosts: [...get().boardPosts, newPost] });
  },
  
  deleteBoardPost: (postId) => {
    set({
      boardPosts: get().boardPosts.filter(post => post.id !== postId),
    });
  },
  
  addComment: (postId, comment) => {
    const newComment: Comment = {
      ...comment,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    set({
      boardPosts: get().boardPosts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ),
    });
  },
  
  // Calendar actions
  addCalendarEvent: (event) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
    };
    set({ calendarEvents: [...get().calendarEvents, newEvent] });
  },
  
  // Bathroom actions
  reserveBathroom: (reservation) => {
    const newReservation: BathroomReservation = {
      ...reservation,
      id: Math.random().toString(36).substr(2, 9),
    };
    set({ bathroomReservations: [...get().bathroomReservations, newReservation] });
  },
  
  releaseBathroom: (reservationId) => {
    set({
      bathroomReservations: get().bathroomReservations.map(r =>
        r.id === reservationId ? { ...r, occupied: false } : r
      ),
    });
  },
  
  // Dishwasher actions
  updateDishwasherStatus: (status, userId) => {
    const current = get().dishwasherStatus;
    const newStatus: DishwasherStatus = {
      groupId: get().currentGroup?.id || '',
      status,
      startedBy: status === 'running' ? userId : current?.startedBy,
      startedAt: status === 'running' ? new Date() : current?.startedAt,
      contributors: status === 'loading' && userId
        ? [...(current?.contributors || []), userId]
        : status === 'empty'
        ? []
        : current?.contributors || [],
    };
    set({ dishwasherStatus: newStatus });
  },
}));