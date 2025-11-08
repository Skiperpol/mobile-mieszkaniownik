// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/use-color-scheme';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         {/* Dodane: Główny plik index (do obsługi Redirect) musi być zdefiniowany 
//              i nie może mieć nagłówka, ponieważ jest tylko logicznym punktem wejścia. */}
//         <Stack.Screen name="index" options={{ headerShown: false }} /> 
        
//         {/* Grupa Uwierzytelniania */}
//         <Stack.Screen name="(auth)" options={{ headerShown: false }} /> 
        
//         {/* Ekran wyboru/tworzenia grupy */}
//         <Stack.Screen name="join-or-create" options={{ title: 'Dołącz/Utwórz Grupę' }} /> 
        
//         {/* Główna Aplikacja (Tab Navigator) */}
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }