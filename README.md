# Mieszkaniownik 📱

Aplikacja mobilna do zarządzania wspólnym mieszkaniem i współlokatorami. Umożliwia zarządzanie wydatkami, zadaniami domowymi, listą zakupów, rezerwacjami oraz komunikacją między mieszkańcami.

## 🌟 Funkcjonalności

### 👥 Zarządzanie grupą
- Tworzenie i dołączanie do grup mieszkaniowych
- Skanowanie kodów QR do szybkiego dołączania
- Zarządzanie członkami grupy
- Generowanie kodów QR dla grup

### 💰 Skarbonka (Wydatki)
- Dodawanie wydatków wspólnych
- Niestandardowy podział kosztów między członków
- Automatyczne rozliczanie długów
- Raporty miesięczne
- Kategoryzacja wydatków (jedzenie, zakupy, rachunki, rozrywka, inne)

### 🛒 Lista zakupów
- Wspólna lista zakupów
- Przypisywanie produktów do członków
- Śledzenie kupionych produktów
- Szacunkowe ceny produktów
- Usuwanie produktów

### ✅ Zadania domowe
- Zarządzanie zadaniami z rotacją
- Częstotliwość zadań (dziennie, tygodniowo, miesięcznie)
- Przypisywanie zadań do członków
- Usuwanie zadań

### 📅 Kalendarz
- Dodawanie wydarzeń i absencji
- Przeglądanie wydarzeń grupy
- Usuwanie wydarzeń

### 📋 Tablica ogłoszeń
- Publikowanie ogłoszeń
- Dodawanie zdjęć do ogłoszeń
- Komentarze pod ogłoszeniami
- Usuwanie własnych ogłoszeń

### 🚿 Łazienka
- Rezerwacja czasu w łazience
- Automatyczne zwalnianie wygasłych rezerwacji
- Status zajętości łazienki
- Usuwanie rezerwacji

### 🍽️ Zmywarka
- Status zmywarki (pusta, ładowanie, pracuje, czysta)
- Wspólne użytkowanie zmywarki
- Wizualne wskaźniki statusu

### 👤 Profil użytkownika
- Zarządzanie profilem
- Informacje o użytkowniku

## 🛠️ Technologie

### Framework i biblioteki główne
- **React Native** (0.81.5) - Framework do tworzenia aplikacji mobilnych
- **React** (19.1.0) - Biblioteka UI
- **Expo** (54.0.23) - Platforma do rozwoju aplikacji React Native
- **Expo Router** (6.0.14) - Routing oparty na strukturze plików
- **TypeScript** (5.9.2) - Typowanie statyczne

### Zarządzanie stanem
- **Zustand** (5.0.8) - Lekka biblioteka do zarządzania stanem globalnym

### Nawigacja
- **Expo Router** (6.0.14) - Routing oparty na strukturze plików
- **React Navigation** (7.x) - Biblioteka nawigacji (zależność Expo Router)
  - `@react-navigation/native`
  - `@react-navigation/stack`
  - `@react-navigation/bottom-tabs`
  - `@react-navigation/elements`

### UI i komponenty
- **Expo Vector Icons** (15.0.3) - Ikony (Ionicons)
- **Expo Linear Gradient** (15.0.7) - Gradienty
- **Expo Image** (3.0.10) - Optymalizacja obrazów
- **React Native Safe Area Context** (5.6.0) - Obsługa safe area

### Funkcjonalności
- **Expo Camera** (17.0.9) - Skanowanie kodów QR
- **Expo Image Picker** (17.0.8) - Wybór zdjęć z galerii
- **Expo Clipboard** (8.0.7) - Kopiowanie do schowka
- **React Native Community DateTimePicker** (8.4.4) - Wybór daty i czasu
- **React Native QR Code SVG** (6.3.20) - Generowanie kodów QR
- **React Native Reanimated** (4.1.1) - Animacje (zależność Expo Router)
- **React Native Gesture Handler** (2.28.0) - Obsługa gestów (zależność Expo Router)
- **Expo Haptics** (15.0.7) - Wibracje

### Narzędzia deweloperskie
- **ESLint** (9.25.0) - Linting kodu
- **TypeScript** (5.9.2) - Typowanie statyczne
- **Expo Lint** - Konfiguracja ESLint dla Expo

## 📋 Wymagania

- Node.js (wersja zgodna z Expo 54)
- npm lub yarn
- Expo CLI (opcjonalnie)
- Android Studio (dla Android)
- Xcode (dla iOS, tylko na macOS)

## 🚀 Instalacja i uruchomienie

1. **Sklonuj repozytorium**
   ```bash
   git clone <url-repozytorium>
   cd mobile-mieszkaniownik
   ```

2. **Zainstaluj zależności**
   ```bash
   npm install
   ```

3. **Uruchom aplikację**
   ```bash
   npm start
   # lub
   npx expo start
   ```

4. **Uruchom na urządzeniu**
   - **Android**: `npm run android`
   - **iOS**: `npm run ios`
   - **Web**: `npm run web`

## 🎨 Stylowanie

Aplikacja używa **React Native StyleSheet** do stylowania komponentów. Każdy ekran ma własny plik stylów (`.style.ts`) z wyeksportowanymi stylami.

## 📱 Platformy

- ✅ Android
- ✅ iOS
- ✅ Web (Expo Web)

## 🔧 Konfiguracja

### Permissions (Android)
- `CAMERA` - Skanowanie kodów QR
- `READ_EXTERNAL_STORAGE` - Czytanie zdjęć
- `READ_MEDIA_IMAGES` - Czytanie zdjęć (Android 13+)

### Permissions (iOS)
- `NSPhotoLibraryUsageDescription` - Dostęp do galerii
- `NSPhotoLibraryAddUsageDescription` - Zapisywanie zdjęć

## 📝 Uwagi

- Aplikacja obecnie używa mock danych (pliki w `store/mockData.ts`)
- W przyszłości planowana integracja z backendem API
- Typed routes są włączone (`typedRoutes: true` w `app.json`)
- React Compiler jest włączony (`reactCompiler: true` w `app.json`)

## 📄 Licencja

Prywatny projekt

## 👤 Autor

Dawid

---

**Wersja**: 1.0.0
