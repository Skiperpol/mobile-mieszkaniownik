import { create } from 'zustand';


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
    const mockUser: User = {
      id: 'user-1',
      email,
      name: 'Anna Kowalska',
      avatar: '👩',
    };
    
    // Mock group with sample data
    const mockGroup: Group = {
      id: 'group-1',
      name: 'Mieszkanie przy Parkowej 12',
      code: 'PARK12',
      createdBy: 'user-1',
      members: ['user-1', 'user-2', 'user-3'],
      createdAt: new Date('2024-01-01'),
    };
    
    // Mock expenses
    const mockExpenses: Expense[] = [
      // Bieżący miesiąc (Listopad 2024)
      {
        id: 'exp-1',
        groupId: 'group-1',
        title: 'Zakupy spożywcze - Biedronka',
        amount: 234.50,
        paidBy: 'user-1',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'food',
        date: new Date('2024-11-05'),
        description: 'Zakupy na cały tydzień',
      },
      {
        id: 'exp-2',
        groupId: 'group-1',
        title: 'Rachunki za prąd',
        amount: 180.00,
        paidBy: 'user-2',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'utilities',
        date: new Date('2024-11-01'),
      },
      {
        id: 'exp-6',
        groupId: 'group-1',
        title: 'Internetowy + TV',
        amount: 99.00,
        paidBy: 'user-1',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'utilities',
        date: new Date('2024-11-01'),
        description: 'Abonament Orange',
      },
      {
        id: 'exp-7',
        groupId: 'group-1',
        title: 'Gaz',
        amount: 145.30,
        paidBy: 'user-3',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'utilities',
        date: new Date('2024-11-02'),
      },
      {
        id: 'exp-8',
        groupId: 'group-1',
        title: 'Woda i ścieki',
        amount: 87.50,
        paidBy: 'user-2',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'utilities',
        date: new Date('2024-11-03'),
      },
      {
        id: 'exp-9',
        groupId: 'group-1',
        title: 'Zakupy spożywcze - Lidl',
        amount: 156.80,
        paidBy: 'user-2',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'food',
        date: new Date('2024-11-03'),
      },
      {
        id: 'exp-10',
        groupId: 'group-1',
        title: 'Kino - Dune 2',
        amount: 75.00,
        paidBy: 'user-1',
        splitBetween: ['user-1', 'user-2'],
        category: 'entertainment',
        date: new Date('2024-11-04'),
      },
      {
        id: 'exp-11',
        groupId: 'group-1',
        title: 'Spotify Premium Family',
        amount: 29.99,
        paidBy: 'user-3',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'entertainment',
        date: new Date('2024-11-01'),
      },
      {
        id: 'exp-12',
        groupId: 'group-1',
        title: 'Detergenty i proszek do prania',
        amount: 89.40,
        paidBy: 'user-1',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'shopping',
        date: new Date('2024-11-05'),
      },
      {
        id: 'exp-13',
        groupId: 'group-1',
        title: 'IKEA - nowe talerze i kubki',
        amount: 124.50,
        paidBy: 'user-2',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'shopping',
        date: new Date('2024-11-02'),
      },
      {
        id: 'exp-14',
        groupId: 'group-1',
        title: 'Restauracja - sushi',
        amount: 189.00,
        paidBy: 'user-3',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'food',
        date: new Date('2024-11-06'),
      },
      {
        id: 'exp-15',
        groupId: 'group-1',
        title: 'Kebab na wynos',
        amount: 42.00,
        paidBy: 'user-2',
        splitBetween: ['user-2', 'user-3'],
        category: 'food',
        date: new Date('2024-11-04'),
      },
      
      // Poprzedni miesiąc (Październik 2024)
      {
        id: 'exp-3',
        groupId: 'group-1',
        title: 'Netflix i Spotify',
        amount: 59.99,
        paidBy: 'user-3',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'entertainment',
        date: new Date('2024-10-30'),
        description: 'Subskrypcje miesięczne',
      },
      {
        id: 'exp-4',
        groupId: 'group-1',
        title: 'Pizza na wieczór filmowy',
        amount: 89.90,
        paidBy: 'user-1',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'food',
        date: new Date('2024-10-28'),
      },
      {
        id: 'exp-5',
        groupId: 'group-1',
        title: 'Środki czystości',
        amount: 67.50,
        paidBy: 'user-2',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'shopping',
        date: new Date('2024-10-25'),
      },
      {
        id: 'exp-16',
        groupId: 'group-1',
        title: 'Rachunki za prąd',
        amount: 165.00,
        paidBy: 'user-1',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'utilities',
        date: new Date('2024-10-01'),
      },
      {
        id: 'exp-17',
        groupId: 'group-1',
        title: 'Internet',
        amount: 99.00,
        paidBy: 'user-2',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'utilities',
        date: new Date('2024-10-01'),
      },
      {
        id: 'exp-18',
        groupId: 'group-1',
        title: 'Zakupy spożywcze',
        amount: 198.50,
        paidBy: 'user-3',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'food',
        date: new Date('2024-10-15'),
      },
      {
        id: 'exp-19',
        groupId: 'group-1',
        title: 'Zakupy spożywcze',
        amount: 145.20,
        paidBy: 'user-1',
        splitBetween: ['user-1', 'user-2', 'user-3'],
        category: 'food',
        date: new Date('2024-10-08'),
      },
      {
        id: 'exp-20',
        groupId: 'group-1',
        title: 'Koncert',
        amount: 150.00,
        paidBy: 'user-2',
        splitBetween: ['user-1', 'user-2'],
        category: 'entertainment',
        date: new Date('2024-10-20'),
      },
    ];
    
    // Mock shopping list
    const mockShopping: ShoppingItem[] = [
      {
        id: 'shop-1',
        groupId: 'group-1',
        name: 'Mleko 2%',
        quantity: '2 litry',
        addedBy: 'user-2',
        purchased: false,
        estimatedPrice: 7.50,
        createdAt: new Date('2024-11-06'),
      },
      {
        id: 'shop-2',
        groupId: 'group-1',
        name: 'Chleb',
        quantity: '2 sztuki',
        addedBy: 'user-1',
        claimedBy: 'user-3',
        purchased: false,
        estimatedPrice: 9.00,
        createdAt: new Date('2024-11-06'),
      },
      {
        id: 'shop-3',
        groupId: 'group-1',
        name: 'Papier toaletowy',
        quantity: '1 opakowanie (12 rolek)',
        addedBy: 'user-3',
        purchased: false,
        estimatedPrice: 24.99,
        createdAt: new Date('2024-11-05'),
      },
      {
        id: 'shop-4',
        groupId: 'group-1',
        name: 'Pomidory',
        quantity: '1kg',
        addedBy: 'user-1',
        purchased: false,
        estimatedPrice: 12.00,
        createdAt: new Date('2024-11-06'),
      },
    ];
    
    // Mock tasks
    const mockTasks: Task[] = [
      {
        id: 'task-1',
        groupId: 'group-1',
        title: 'Odkurzanie całego mieszkania',
        description: 'Pamiętaj o narożnikach i pod meblami',
        assignedTo: 'user-1',
        frequency: 'weekly',
        completed: false,
        dueDate: new Date('2024-11-08'),
        rotationOrder: ['user-1', 'user-2', 'user-3'],
      },
      {
        id: 'task-2',
        groupId: 'group-1',
        title: 'Sprzątanie łazienki',
        assignedTo: 'user-2',
        frequency: 'weekly',
        completed: false,
        dueDate: new Date('2024-11-09'),
        rotationOrder: ['user-2', 'user-3', 'user-1'],
      },
      {
        id: 'task-3',
        groupId: 'group-1',
        title: 'Wyniesienie śmieci',
        assignedTo: 'user-3',
        frequency: 'daily',
        completed: false,
        dueDate: new Date('2024-11-07'),
        rotationOrder: ['user-3', 'user-1', 'user-2'],
      },
      {
        id: 'task-4',
        groupId: 'group-1',
        title: 'Mycie okien',
        assignedTo: 'user-1',
        frequency: 'monthly',
        completed: false,
        dueDate: new Date('2024-11-15'),
        rotationOrder: ['user-1', 'user-2', 'user-3'],
      },
    ];
    
    // Mock board posts
    const mockPosts: BoardPost[] = [
      {
        id: 'post-1',
        groupId: 'group-1',
        authorId: 'user-2',
        title: 'Impreza w piątek! 🎉',
        content: 'Hej! W piątek wieczorem zorganizuję małe spotkanie z przyjaciółmi. Będzie nas około 8 osób. Postaram się nie robić za dużo hałasu po 22:00. Dajcie znać jeśli macie jakieś pytania!',
        createdAt: new Date('2024-11-05T14:30:00'),
        comments: [
          {
            id: 'comment-1',
            authorId: 'user-1',
            content: 'Super! Mogę coś przynieść?',
            createdAt: new Date('2024-11-05T15:00:00'),
          },
          {
            id: 'comment-2',
            authorId: 'user-3',
            content: 'Brzmi świetnie, miłej zabawy! 🎊',
            createdAt: new Date('2024-11-05T16:20:00'),
          },
        ],
      },
      {
        id: 'post-2',
        groupId: 'group-1',
        authorId: 'user-3',
        title: 'Naprawa pralki w środę',
        content: 'Przyjedzie serwisant w środę między 14:00 a 16:00. Ktoś będzie w domu?',
        createdAt: new Date('2024-11-04T10:15:00'),
        comments: [
          {
            id: 'comment-3',
            authorId: 'user-1',
            content: 'Ja mogę być, pracuję zdalnie tego dnia',
            createdAt: new Date('2024-11-04T11:00:00'),
          },
        ],
      },
      {
        id: 'post-3',
        groupId: 'group-1',
        authorId: 'user-1',
        title: 'Nowy sklep w okolicy',
        content: 'Otworzyła się nowa Żabka naprzeciwko - mają promocje!',
        createdAt: new Date('2024-11-03T18:00:00'),
        comments: [],
      },
    ];
    
    // Mock calendar events
    const mockEvents: CalendarEvent[] = [
      {
        id: 'event-1',
        groupId: 'group-1',
        title: 'Wyjazd do rodziny',
        type: 'absence',
        userId: 'user-2',
        startDate: new Date('2024-11-15'),
        endDate: new Date('2024-11-17'),
        description: 'Wracam w niedzielę wieczorem',
      },
      {
        id: 'event-2',
        groupId: 'group-1',
        title: 'Remont łazienki',
        type: 'event',
        userId: 'user-1',
        startDate: new Date('2024-11-20'),
        endDate: new Date('2024-11-22'),
        description: 'Hydraulik będzie wymieniał baterie',
      },
    ];
    
    // Mock bathroom reservations
    const mockBathroomReservations: BathroomReservation[] = [
      {
        id: 'bath-1',
        groupId: 'group-1',
        userId: 'user-2',
        startTime: new Date(Date.now() + 3600000), // 1 hour from now
        endTime: new Date(Date.now() + 5400000), // 1.5 hours from now
        occupied: false,
      },
    ];
    
    // Mock dishwasher status
    const mockDishwasher: DishwasherStatus = {
      groupId: 'group-1',
      status: 'loading',
      contributors: ['user-1', 'user-3'],
    };
    
    set({ 
      user: mockUser, 
      isAuthenticated: true,
      currentGroup: mockGroup,
      expenses: mockExpenses,
      shoppingList: mockShopping,
      tasks: mockTasks,
      boardPosts: mockPosts,
      calendarEvents: mockEvents,
      bathroomReservations: mockBathroomReservations,
      dishwasherStatus: mockDishwasher,
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
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    const group: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      code,
      createdBy: get().user?.id || '',
      members: [get().user?.id || ''],
      createdAt: new Date(),
    };
    set({ currentGroup: group });
    return code;
  },
  
  joinGroup: async (code: string) => {
    // Mock join - replace with real backend call
    const group: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Mock Group',
      code,
      createdBy: 'other-user',
      members: ['other-user', get().user?.id || ''],
      createdAt: new Date(),
    };
    set({ currentGroup: group });
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