import { create } from 'zustand';
import { createMockData } from '../store/mockData';
import type {
  AppState,
  User,
  Group,
  Expense,
  ShoppingItem,
  Task,
  BoardPost,
  Comment,
  CalendarEvent,
  BathroomReservation,
  DishwasherStatus,
} from '../types/app';

export const useAppStore = create<AppState>((set, get) => ({
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
  
  login: async (email: string, password: string) => {
    const userId = 'user-1';
    const mockUser: User = {
      id: userId,
      email,
      name: 'Anna Kowalska',
      avatar: '👩',
    };
    
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
  
  createGroup: async (name: string) => {
    const userId = get().user?.id || '';
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    const groupId = Math.random().toString(36).substr(2, 9);
    const otherUsers = ['user-2', 'user-3'];
    const allMembers = [userId, ...otherUsers];
    const group: Group = {
      id: groupId,
      name,
      code,
      createdBy: userId,
      members: allMembers,
      createdAt: new Date(),
    };
    
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
    return code;
  },
  
  joinGroup: async (code: string) => {
    const userId = get().user?.id || '';
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
  
  deleteShoppingItem: (itemId) => {
    set({
      shoppingList: get().shoppingList.filter(item => item.id !== itemId),
    });
  },
  
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
      const currentIndex = task.rotationOrder.indexOf(task.assignedTo);
      const nextIndex = (currentIndex + 1) % task.rotationOrder.length;
      const nextAssignee = task.rotationOrder[nextIndex];
      
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
  
  deleteTask: (taskId) => {
    set({
      tasks: get().tasks.filter(task => task.id !== taskId),
    });
  },
  
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
  
  addCalendarEvent: (event) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
    };
    set({ calendarEvents: [...get().calendarEvents, newEvent] });
  },
  
  deleteCalendarEvent: (eventId) => {
    set({
      calendarEvents: get().calendarEvents.filter(event => event.id !== eventId),
    });
  },
  
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
  
  deleteBathroomReservation: (reservationId) => {
    set({
      bathroomReservations: get().bathroomReservations.filter(r => r.id !== reservationId),
    });
  },
  
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

