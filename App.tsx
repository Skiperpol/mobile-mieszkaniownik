// import { useAppStore, AppState } from './app/store/useAppStore';

// // Auth Screens
// import { LoginScreen } from './app/screens/LoginScreen';
// import { RegisterScreen } from './app/screens/RegisterScreen';
// import { JoinOrCreateGroupScreen } from './app/screens/JoinOrCreateGroupScreen';

// // Main Screens
// import { GroupDashboard } from './app/screens/GroupDashboard';
// import { GroupMembersScreen } from './app/screens/GroupMembersScreen';

// // Expenses
// import { ExpensesListScreen } from './app/screens/ExpensesListScreen';
// import { AddExpenseScreen } from './app/screens/AddExpenseScreen';
// import { SettleDebtScreen } from './app/screens/SettleDebtScreen';
// import { MonthlyReportScreen } from './app/screens/MonthlyReportScreen';

// // Shopping
// import { ShoppingListScreen } from './app/screens/ShoppingListScreen';
// import { AddShoppingItemScreen } from './app/screens/AddShoppingItemScreen';

// // Tasks
// import { TasksScheduleScreen } from './app/screens/TasksScheduleScreen';
// import { AddTaskScreen } from './app/screens/AddTaskScreen';

// // Board
// import { BoardPostsScreen } from './app/screens/BoardPostsScreen';
// import { AddBoardPostScreen } from './app/screens/AddBoardPostScreen';

// // Calendar
// import { CalendarScreen } from './app/screens/CalendarScreen';
// import { AddAbsenceScreen } from './app/screens/AddAbsenceScreen';

// // Other
// import { BathroomStatusScreen } from './app/screens/BathroomStatusScreen';
// import { DishwasherScreen } from './app/screens/DishwasherScreen';
// import { UserProfileScreen } from './app/screens/UserProfileScreen';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const isAuthenticated = useAppStore((s: AppState) => s.isAuthenticated);
//   const currentGroup = useAppStore((s: AppState) => s.currentGroup);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {!isAuthenticated ? (
//           <>
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Register" component={RegisterScreen} />
//           </>
//         ) : !currentGroup ? (
//           <Stack.Screen name="JoinOrCreate" component={JoinOrCreateGroupScreen} />
//         ) : (
//           <>
//             <Stack.Screen name="Dashboard" component={GroupDashboard} />
//             <Stack.Screen name="Expenses" component={ExpensesListScreen} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }