# 🦉 FotoOwl Gallery

A modern, high-performance, and feature-rich Mobile & Web Gallery application built with **React Native**, **Expo (v57)**, **TypeScript**, **Expo Router**, **NativeWind (Tailwind CSS)**, and **Zustand**.

FotoOwl Gallery connects to the **Lorem Picsum API** to deliver a seamless photo-browsing experience featuring infinite scrolling, instant search and author filtering, persistent user authentication, persistent local favorites management, image spec inspection, direct device gallery downloads, native hardware back navigation, and a full-screen lightbox viewer.

---

## 🌟 Key Features

### 🔐 User Authentication & Session Persistence

- **Sign Up & Profile Creation**: Complete registration flow with form validation for full name, email, gender, 10-digit mobile number, address, and city selection.
- **Secure Login & Session Persistence**: Local authentication backed by `@react-native-async-storage/async-storage` to keep users signed in across app launches.
- **Demo Auto-fill**: Quick one-tap credential auto-fill for testing (`demo@fotoowl.ai`).
- **Profile Management**: Editable user profile details with instant local state & storage sync, plus safe logout confirmation.

### 🖼️ High-Performance Photo Gallery

- **2-Column Fixed Grid**: Pre-calculated card heights and row offsets for smooth FlatList virtualization.
- **Infinite Scrolling & Pagination**: Dynamically loads 20 photos per page from the Picsum API.
- **Pull-to-Refresh**: Reloads the first page of images from the Picsum API.
- **Debounced Search**: Real-time 300ms debounced search by photographer/author name.
- **Author Filtering Pills**: Instant filtering by author initial ranges (`All`, `A – M`, `N – Z`).

### ❤️ Unified Favorites Management

- **One-Tap Favoriting**: Toggle favorite status on any photo from the gallery feed, detail view, or lightbox.
- **Persistent Favorites**: Saved locally to device storage via `@fotowl/favorites`.
- **Dedicated Favorites Screen**: Quick access tab utilizing the unified `ImageCard` grid to search and filter your curated collection.

### 🔍 Photo Details & Lightbox Viewer

- **Detailed Photo Specs**: Displays photographer info, pixel dimensions (width/height), and dynamic aspect ratios.
- **Centralized Media Service**: Dedicated `mediaService` handles native permissions (`expo-media-library`), file downloads (`expo-file-system`), fallback URL retries, and native sharing (`expo-sharing`).
- **Full-Screen Lightbox**: Modal viewer with high-resolution image render, memory/disk caching (`expo-image`), and native sharing support.

### 📱 Native Device Hardware Back Navigation

- **Native Stack Routing**: Root layout uses Expo Router's `<Stack>` navigator for full native history tracking.
- **Tab History Support**: Configured `backBehavior="firstRoute"` so pressing back on secondary tabs returns to the main Home feed.
- **Android BackHandler**: Device back button is intercepted on detail and full-screen modal views to pop screens or close modals gracefully without exiting the app.

---

## ⚡ Performance Highlights & Architecture

- **Optimized FlatList Virtualization**: Fixed card dimensions and `getItemLayout` allow deterministic row-position calculations and reduce dynamic layout measurement.
- **Memoized Components (`React.memo`)**: Component rendering in `ImageCard` is memoized to prevent re-renders of offscreen rows during store updates.
- **Debounced State Updates**: Photographer search queries are debounced by 300ms using `useDebounce`, preventing main-thread lag during fast keyboard typing.
- **Native Memory & Disk Caching**: Images rendered via `expo-image` leverage `memory-disk` cache policies for instant load times on repeated views.

---

## 🛠️ Technology Stack

| Category                   | Technologies                                                                                            |
| :------------------------- | :------------------------------------------------------------------------------------------------------ |
| **Framework**              | [React Native](https://reactnative.dev/) `0.86.2` & [Expo](https://expo.dev/) `~57.0.12`                |
| **Language**               | [TypeScript](https://www.typescriptlang.org/) `~6.0.3`                                                  |
| **Routing**                | [Expo Router](https://docs.expo.dev/router/introduction/) `~57.0.12` (Native Stack & Tab Navigators)    |
| **Styling**                | [NativeWind](https://www.nativewind.dev/) `^4.2.6` & [Tailwind CSS](https://tailwindcss.com/) `^3.4.17` |
| **State Management**       | [Zustand](https://zustand-demo.pmnd.rs/) `^5.0.14`                                                      |
| **Storage & Persistence**  | [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) `2.2.0`                     |
| **Networking & Services**  | [Axios](https://axios-http.com/) `^1.19.0` & Centralized `mediaService`                                 |
| **Media & Native Modules** | `expo-image`, `expo-file-system`, `expo-media-library`, `expo-sharing`                                  |
| **Iconography**            | `@expo/vector-icons` (`Ionicons`)                                                                       |

---

## 📁 Project Architecture

```text
FotoOwlGallery/
├── assets/                   # App icons, splash screens, and adaptive assets
├── src/
│   ├── app/                  # Expo Router file-based route definitions
│   │   ├── _layout.tsx       # Root layout with Native Stack Navigator & Auth guards
│   │   ├── index.tsx         # Entry redirect router
│   │   ├── login.tsx         # Authentication Login screen with demo auto-fill
│   │   ├── register.tsx      # User Registration screen with full validation & BackHandler
│   │   ├── (tabs)/           # Main Tab Navigator
│   │   │   ├── _layout.tsx   # Tab bar layout with backBehavior="firstRoute"
│   │   │   ├── home.tsx      # Main Gallery feed with search & filter
│   │   │   ├── favorites.tsx # Saved Favorites feed using unified ImageCard
│   │   │   └── profile.tsx   # User profile view & edit screen
│   │   └── image/
│   │       └── [id].tsx      # Dynamic Photo details screen with BackHandler
│   ├── components/           # Reusable UI Components
│   │   ├── ImageCard.tsx     # Unified gallery grid card component
│   │   ├── FavoriteCard.tsx  # Lightweight delegate to ImageCard
│   │   ├── FilterPills.tsx   # Author range filter selector
│   │   ├── FullScreenImageViewer.tsx # Fullscreen modal lightbox viewer
│   │   ├── InputField.tsx    # Styled form text input component
│   │   └── SearchBar.tsx     # Debounced search bar input
│   ├── hooks/                # Custom React Hooks
│   │   ├── useDebounce.ts    # Value debounce hook (300ms default)
│   │   └── useSearch.ts      # Search query management hook
│   ├── services/             # Core Services & APIs
│   │   ├── api.ts            # Lorem Picsum Axios client & endpoints
│   │   ├── mediaService.ts   # Central media downloader, gallery saver & native sharing
│   │   └── storage.ts        # AsyncStorage wrappers for session & favorites
│   ├── store/                # Zustand State Stores
│   │   ├── authStore.ts      # User auth state, login/logout, profile updates
│   │   └── galleryStore.ts   # Image list, pagination, favorites, filtering
│   ├── types/                # TypeScript Interface & Type Definitions
│   │   ├── auth.ts           # User & Auth state interfaces
│   │   └── image.ts          # Picsum Image & Gallery state interfaces
│   └── utils/                # Utility & Helper Functions
│       └── validation.ts     # Registration form validation functions
├── app.json                  # Expo project configuration
├── package.json              # Project dependencies & scripts
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript setup
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go app](https://expo.dev/go) on your mobile device OR Android Studio / Xcode for emulators.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/harshvardhan2709/FotoOwlGallery.git
   cd FotoOwlGallery
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Run on your platform of choice**
   - Press `a` to run on **Android Emulator**
   - Press `i` to run on **iOS Simulator**
   - Press `w` to run in **Web Browser**
   - Scan the QR code using **Expo Go** on Android/iOS to run on a physical device.

---

## 📜 Available NPM Scripts

- `npm start` — Starts the Expo development server.
- `npm run android` — Starts the app on a connected Android device or emulator.
- `npm run ios` — Starts the app on iOS simulator.
- `npm run web` — Runs the Expo web development server.
- `npm run lint` — Runs Expo ESLint checks.

---

## 🔗 External API Endpoints Used

FotoOwl Gallery connects to **Lorem Picsum** for image fetching:

| Endpoint                                                  | Method | Purpose                                                  |
| :-------------------------------------------------------- | :----- | :------------------------------------------------------- |
| `https://picsum.photos/v2/list?page={page}&limit={limit}` | `GET`  | Fetches paginated image list                             |
| `https://picsum.photos/id/{id}/info`                      | `GET`  | Fetches details & original dimensions for specific image |
| `https://picsum.photos/id/{id}/{width}/{height}`          | `GET`  | Fetches image binary at specific dimensions              |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
