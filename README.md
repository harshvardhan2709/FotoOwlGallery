# 🦉 FotoOwl Gallery

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.86.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo_SDK-57.0.12-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-4.2.6-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0.14-4338CA?style=for-the-badge&logo=react&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br />

**FotoOwl Gallery** is a high-performance, production-ready cross-platform mobile image gallery and discovery application built with **React Native**, **Expo SDK 57**, **Expo Router**, **TypeScript**, **NativeWind (Tailwind CSS)**, and **Zustand**. It integrates with the **Lorem Picsum REST API** to deliver seamless photo browsing, debounced search, initial filtering, alphabetical sorting, per-user scoped favorites persistence, high-resolution full-screen lightbox viewing, native device gallery downloading, and native social sharing.

</div>

---

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
  - [🔐 Authentication & Session Persistence](#-authentication--session-persistence)
  - [🖼️ Dynamic Image Gallery & Infinite Scrolling](#️-dynamic-image-gallery--infinite-scrolling)
  - [🔍 Search, Filter & Alphabetical Sorting](#-search-filter--alphabetical-sorting)
  - [❤️ Per-User Scoped Favorites System](#️-per-user-scoped-favorites-system)
  - [🔍 Image Details & Metadata Inspector](#-image-details--metadata-inspector)
  - [🖥️ Full-Screen Lightbox Viewer](#️-full-screen-lightbox-viewer)
  - [📥 Native Device Download & Social Sharing](#-native-device-download--social-sharing)
  - [👤 Profile Management & Live Updates](#-profile-management--live-updates)
  - [📱 Native Stack & Tab Navigation](#-native-stack--tab-navigation)
- [🏗️ Architecture & State Management](#️-architecture--state-management)
  - [Centralized Zustand Stores](#centralized-zustand-stores)
  - [Multi-User Local Storage Architecture](#multi-user-local-storage-architecture)
  - [Data Flow Diagram](#data-flow-diagram)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Structure](#-project-structure)
- [🔗 API Integration & Endpoints](#-api-integration--endpoints)
- [⚡ Performance Optimizations](#-performance-optimizations)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
  - [Running on Devices & Emulators](#running-on-devices--emulators)
  - [Available NPM Scripts](#available-npm-scripts)
- [📦 Building the Android APK (EAS Build)](#-building-the-android-apk-eas-build)
- [📌 Implementation Assumptions](#-implementation-assumptions)
- [🔒 Data & Privacy](#-data--privacy)
- [📄 License & Author](#-license--author)

---

## ✨ Key Features

### 🔐 Authentication & Session Persistence
- **Local Account Registration**: Full user registration supporting Full Name, Email, Gender (`Male`, `Female`, `Other`), 10-digit Mobile Number, Address, City picker (`Pune`, `Mumbai`, `Nashik`, `Nagpur`, `Thane`, `Aurangabad`), and Password confirmation.
- **Client-Side Validation**: Robust RFC-compliant email formatting, strict 10-digit phone checking, password length enforcement (>= 6 chars), and real-time mismatch indicators.
- **Persistent Session Gating**: Auto-restores the logged-in session on application cold launches using `AsyncStorage`. Gated routing automatically protects authenticated tab screens and redirects logged-out users to `/login`.
- **One-Tap Demo Credentials**: "Auto-fill Credentials" helper button allows instantaneous login with pre-configured credentials (`demo@fotoowl.ai` / `password123`) or existing registered local credentials for swift testing.
- **Multi-User Directory**: Preserves multiple local user accounts under `@fotowl/users_list`, allowing multiple registered users to switch and login on the same device.

### 🖼️ Dynamic Image Gallery & Infinite Scrolling
- **Two-Column Responsive Grid**: Rendered via an optimized `FlatList` layout with consistent aspect ratios and fixed dimension calculations.
- **Lorem Picsum API Integration**: Fetches real-world photography dynamically with author credits, image IDs, and source dimensions.
- **Infinite Scrolling with Concurrency Guards**: Fetches 20 images per batch on reaching threshold (`onEndReachedThreshold={0.5}`). Features race-condition guards preventing multiple simultaneous fetch requests.
- **Pull-to-Refresh**: Non-destructive refresh re-fetches the initial batch while preserving or updating the user's persisted favorites.
- **Item De-duplication**: Automatic Set-based ID deduplication to prevent key collisions across sequential page loads.

### 🔍 Search, Filter & Alphabetical Sorting
- **Debounced Search**: 300ms debounce buffer (`useDebounce` hook) to ensure responsive typing without lagging the list render pipeline.
- **Author Initial Filtering**: Segmented filter pills allowing users to filter authors by initial letter ranges:
  - `All` — Displays all loaded photographers.
  - `A – M` — Filters photographers with names starting from A through M.
  - `N – Z` — Filters photographers with names starting from N through Z.
- **Alphabetical Sorting**: Non-destructive sorting engine supporting:
  - `Default` — Original API pagination sequence.
  - `Author A → Z` — Ascending alphabetical sort by author name.
  - `Author Z → A` — Descending alphabetical sort by author name.
- **Real-Time Photo Counter & Filter Reset**: Interactive count badge showing the active filtered result count with a one-tap "Reset Filters & Sort" empty state action.

### ❤️ Per-User Scoped Favorites System
- **Cross-Screen Instant Sync**: Favorite/unfavorite photos directly from the Gallery grid, the Photo Details screen, or the Lightbox viewer with instant optimistic UI feedback.
- **User-Isolated Persistence**: Favorites are scoped by user email (`@fotowl/favorites_<email>`) in AsyncStorage. Switching between user accounts seamlessly loads each user's unique favorites list.
- **Dedicated Favorites Screen**: Displays all bookmarked photos in a 2-column grid with live search filtering within the favorites list and an empty-state quick navigation button.

### 🔍 Image Details & Metadata Inspector
- **Dynamic Route Navigation**: Accessible via `/image/[id]` with smooth native transition animations.
- **Specs & Aspect Ratio**: Calculates aspect ratios (e.g., `1.50:1`) and displays exact pixel dimensions (`width × height`).
- **Remote Fallback Hydration**: Fetches image metadata directly via the Picsum `/id/{id}/info` endpoint if the image is navigated to directly.
- **Direct Actions**: Instant download to native gallery and one-tap trigger for the full-screen lightbox.

### 🖥️ Full-Screen Lightbox Viewer
- **Immersive Dark Canvas**: Modal presentation with dark status bar theming for an undistracted visual experience.
- **High-Resolution Rendering**: Utilizes `expo-image` with `memory-disk` cache policies and cross-fade animations (`transition={200}`).
- **Native Modal Back Handling**: Android hardware back button cleanly dismisses the lightbox before navigating back to previous screens.

### 📥 Native Device Download & Social Sharing
- **Device Gallery Saving**: Downloads high-resolution images via `expo-file-system` and saves them to the device's native photo library using `expo-media-library`.
- **Runtime Permission Handling**: Prompts user for media library permissions on first save, with a fallback notification and local cache storage if permissions are denied.
- **Native Social Sharing**: Uses `expo-sharing` to launch the device's native share sheet for direct sharing to WhatsApp, Instagram, Telegram, Drive, and Email.

### 👤 Profile Management & Live Updates
- **Profile Hero Card**: Displays user avatar initials, full name, email, city, active status badge, and total favorite count.
- **In-Place Profile Editor**: Edit Full Name, Mobile Number, Gender, City, and Address directly within the screen.
- **Immediate State Synchronization**: Updates `AsyncStorage` and propagates changes instantaneously to the Zustand `authStore`.
- **Confirmed Logout**: Alert dialog confirmation to prevent accidental logouts.

### 📱 Native Stack & Tab Navigation
- **Expo Router (File-Based)**: Typed routes enabled for strict type safety.
- **Custom Bottom Tab Bar**: Styled tabs with active accent colors, responsive safe-area insets, and badges.
- **Android Hardware Back Handling**: Custom hardware back-press handlers integrated into registration, image details, and modal screens.

---

## 🏗️ Architecture & State Management

FotoOwl Gallery follows a modular, layer-separated architecture ensuring maintainability, separation of concerns, and optimal rendering performance.

```
┌─────────────────────────────────────────────────────────────┐
│                       UI / Screens                          │
│   (tabs)/home.tsx  •  (tabs)/favorites.tsx  •  profile.tsx  │
│         login.tsx  •  register.tsx  •  image/[id].tsx       │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│         authStore           │ │        galleryStore         │
│  • user profile state       │ │  • paginated images list    │
│  • session state (isAuth)   │ │  • per-user favorites       │
│  • login / register actions │ │  • search & author filters  │
│  • updateProfile / logout   │ │  • alphabetical sorting     │
└──────────────┬──────────────┘ └──────────────┬──────────────┘
               │                               │
               ├───────────────────────────────┤
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│       storage service       │ │      api & mediaService     │
│  • AsyncStorage persistence │ │  • Axios (Picsum API)       │
│  • Multi-user accounts      │ │  • expo-file-system         │
│  • Scoped favorites keys    │ │  • expo-media-library       │
│  • Session token storage    │ │  • expo-sharing             │
└─────────────────────────────┘ └─────────────────────────────┘
```

### Centralized Zustand Stores

1. **`useAuthStore`** (`src/store/authStore.ts`):
   - `user`: Current active `User` object or `null`.
   - `isAuthenticated`: Boolean determining route gating.
   - `isLoading`: Initial session hydration indicator.
   - Actions: `register()`, `login()`, `logout()`, `loadSession()`, `updateProfile()`.

2. **`useGalleryStore`** (`src/store/galleryStore.ts`):
   - `images`: Array of `PicsumImage` objects.
   - `favorites`: Array of favorite image IDs (`string[]`).
   - `page`, `hasMore`, `isLoading`, `isLoadingMore`, `isRefreshing`, `error`.
   - `searchQuery`, `authorFilter` (`ALL` | `A-M` | `N-Z`), `sortOrder` (`NONE` | `A-Z` | `Z-A`).
   - Actions: `loadInitialImages()`, `loadMoreImages()`, `refreshImages()`, `setSearchQuery()`, `setAuthorFilter()`, `setSortOrder()`, `toggleFavorite()`, `loadFavorites()`.

### Multi-User Local Storage Architecture

The storage layer (`src/services/storage.ts`) organizes data under dedicated keys:

| Key Pattern | Description |
| :--- | :--- |
| `@fotowl/user` | Currently authenticated user profile JSON |
| `@fotowl/users_list` | Array of all registered user profiles on the device |
| `@fotowl/session` | Boolean session flag for auto-login hydration |
| `@fotowl/favorites_<email>` | Scoped favorites array for the specific user account |
| `@fotowl/favorites` | Legacy fallback favorites key |

---

## 🛠️ Technology Stack

| Category | Technology / Library | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [React Native](https://reactnative.dev/) | `0.86.2` | Core mobile application framework |
| **Runtime & SDK** | [Expo SDK](https://expo.dev/) | `~57.0.12` | Managed mobile SDK & native modules |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `~6.0.3` | Static type safety and developer tooling |
| **Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) | `~57.0.12` | File-based typed routing & tab navigation |
| **Styling** | [NativeWind](https://www.nativewind.dev/) | `^4.2.6` | Tailwind CSS utility styling for React Native |
| **CSS Engine** | [Tailwind CSS](https://tailwindcss.com/) | `^3.4.17` | Utility class design system |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | `^5.0.14` | High-performance, lightweight state management |
| **Persistence** | [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | `2.2.0` | Local asynchronous key-value data storage |
| **HTTP Client** | [Axios](https://axios-http.com/) | `^1.19.0` | Promise-based REST API consumer |
| **Image Rendering** | [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) | `~57.0.2` | Optimized image component with caching |
| **File System** | [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/) | `~57.0.2` | File downloading and local asset handling |
| **Media Library** | [expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/) | `~57.0.3` | Saving images to the device photo gallery |
| **Sharing** | [expo-sharing](https://docs.expo.dev/versions/latest/sdk/sharing/) | `~57.0.11` | Native device share sheet integration |
| **Icons** | [@expo/vector-icons](https://icons.expo.fyi/) | `^15.1.1` | Ionicons vector icon set |
| **Animations** | [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) | `4.5.1` | Smooth gesture and transition animations |
| **Image API** | [Lorem Picsum](https://picsum.photos/) | Public REST API | High-resolution image provider |

---

## 📁 Project Structure

```text
FotoOwlGallery/
├── assets/                          # Static assets, icons, adaptive icons, and splash
│   └── images/
├── src/
│   ├── app/                         # Expo Router file-based route definitions
│   │   ├── (tabs)/                  # Main authenticated tab navigation group
│   │   │   ├── _layout.tsx          # Bottom tab bar configuration and styling
│   │   │   ├── favorites.tsx        # Saved favorites screen with in-list search
│   │   │   ├── home.tsx             # Main gallery with search, filter, sort & pagination
│   │   │   └── profile.tsx          # Profile screen with in-place editable details
│   │   ├── image/
│   │   │   └── [id].tsx             # Photo detail screen with specs & actions
│   │   ├── _layout.tsx              # Root layout with session gating & Stack config
│   │   ├── index.tsx                # Initial entry route redirector
│   │   ├── login.tsx                # Sign-in screen with demo credentials auto-fill
│   │   └── register.tsx             # User registration with comprehensive validation
│   │
│   ├── components/                  # Reusable, modular UI components
│   │   ├── FilterPills.tsx          # Author & sort selection pill buttons
│   │   ├── FullScreenImageViewer.tsx # Immersive dark-mode lightbox modal
│   │   ├── ImageCard.tsx            # Memoized 2-column gallery card component
│   │   ├── InputField.tsx           # Reusable form field with icon, focus & errors
│   │   ├── SearchBar.tsx            # Debounced search bar with clear button
│   │   └── index.ts                 # Barrel exports
│   │
│   ├── hooks/                       # Custom reusable React hooks
│   │   ├── useDebounce.ts           # Generic debounce hook for search inputs
│   │   └── useSearch.ts             # Search state and debouncing manager
│   │
│   ├── services/                    # Core business logic & API services
│   │   ├── api.ts                   # Axios service for Picsum API requests
│   │   ├── mediaService.ts          # File downloading, gallery save & native share
│   │   └── storage.ts               # AsyncStorage abstraction with multi-user support
│   │
│   ├── store/                       # Zustand centralized state stores
│   │   ├── authStore.ts             # Auth, session, and profile state store
│   │   └── galleryStore.ts          # Photos, favorites, filters, and pagination store
│   │
│   ├── types/                       # TypeScript interfaces and type definitions
│   │   ├── auth.ts                  # User, RegistrationData, and AuthState types
│   │   └── image.ts                 # PicsumImage, AuthorFilter, SortOrder & State
│   │
│   ├── utils/                       # Utility helper functions
│   │   └── validation.ts            # Form validation logic
│   │
│   └── global.css                   # Tailwind base styles and imports
│
├── app.json                         # Expo configuration (permissions, plugins, schemes)
├── babel.config.js                  # Babel compiler configuration with NativeWind
├── eas.json                         # EAS Build configuration for Android APK
├── metro.config.js                  # Metro bundler config with NativeWind wrapper
├── package.json                     # Dependencies and npm scripts
├── tailwind.config.js               # Tailwind CSS theme and content paths
├── tsconfig.json                    # TypeScript compiler options and path aliases
└── README.md                        # Project documentation
```

---

## 🔗 API Integration & Endpoints

FotoOwl Gallery consumes the public **Lorem Picsum REST API**:

### 1. Paginated Image List
```http
GET https://picsum.photos/v2/list?page={page}&limit={limit}
```
- **Query Params**: `page` (number, default: 1), `limit` (number, default: 20).
- **Response**: Array of `PicsumImage` objects:
```json
[
  {
    "id": "10",
    "author": "Paul Jarvis",
    "width": 2500,
    "height": 1667,
    "url": "https://unsplash.com/photos/6H-KafdFOR8",
    "download_url": "https://picsum.photos/id/10/2500/1667"
  }
]
```

### 2. Image Metadata Details
```http
GET https://picsum.photos/id/{id}/info
```
- **Path Param**: `id` (string).
- **Response**: Complete metadata including original resolution and download link.

### 3. Dynamic Resolution Image Delivery
```http
GET https://picsum.photos/id/{id}/{width}/{height}.jpg
```
- Used for delivering size-optimized grid thumbnails (`400x300`) and responsive fullscreen images (`1200x800`).

---

## ⚡ Performance Optimizations

1. **`FlatList` Windowing & Batching**:
   - `initialNumToRender={10}`: Fast initial mount without blocking the JS thread.
   - `maxToRenderPerBatch={10}`: Incremental item painting during fast scrolls.
   - `windowSize={10}`: Constrains off-screen rendering memory consumption.
   - `updateCellsBatchingPeriod={50}`: Smooth 60 FPS scrolling responsiveness.

2. **Component Memoization**:
   - `ImageCard` is wrapped with `React.memo` to prevent re-renders when unrelated parent states (like filter changes or other cards being toggled) change.

3. **Debounced Search Querying**:
   - 300ms debounce ensures that filtering and sorting algorithms do not trigger repeatedly on every keystroke.

4. **Multi-Tier Image Caching**:
   - `expo-image` uses `cachePolicy="memory-disk"`, ensuring already-viewed images load instantaneously from local disk cache without repeated network requests.

5. **Concurrency-Guarded Actions**:
   - Simultaneous `loadMoreImages()` and `refreshImages()` requests are automatically locked out to avoid race conditions and redundant network payload transfers.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:
- **Node.js**: `v18.x` or higher (LTS recommended)
- **Package Manager**: `npm` or `yarn`
- **Mobile Environment**:
  - **Physical Device**: Install [Expo Go](https://expo.dev/go) on iOS or Android.
  - **Android Emulator**: [Android Studio](https://developer.android.com/studio) with an Android Virtual Device (AVD).
  - **iOS Simulator**: macOS with [Xcode](https://developer.apple.com/xcode/).

---

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/harshvardhan2709/FotoOwlGallery.git
   cd FotoOwlGallery
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

---

### Running on Devices & Emulators

| Target | Command | Notes |
| :--- | :--- | :--- |
| **Android Device / Emulator** | `npm run android` or press `a` in Expo CLI | Starts on connected Android emulator or device |
| **iOS Simulator** | `npm run ios` or press `i` in Expo CLI | Starts on active Xcode iOS Simulator (macOS only) |
| **Web Browser** | `npm run web` or press `w` in Expo CLI | Runs web build on `http://localhost:8081` |
| **Expo Go (Physical Device)** | `npx expo start` | Scan QR code with Expo Go (Android) or Camera (iOS) |

---

### Available NPM Scripts

```bash
# Start the interactive Expo development server
npm start

# Run on Android emulator / connected device
npm run android

# Run on iOS simulator (macOS required)
npm run ios

# Run web version in browser
npm run web

# Run ESLint validation checks
npm run lint

# Reset the project starter template (if needed)
npm run reset-project
```

---

## 📦 Building the Android APK (EAS Build)

The project includes pre-configured `eas.json` profiles for building standalone Android APKs via **Expo Application Services (EAS)**:

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Log in to your Expo account**:
   ```bash
   eas login
   ```

3. **Build the Android APK**:
   ```bash
   eas build -p android --profile preview
   ```

4. Once the cloud build completes, download the generated `.apk` file directly from the Expo build dashboard and install it on any Android device.

---

## 📌 Implementation Assumptions

1. **Local Authentication**: As per specifications, user accounts and credentials are registered, stored, and validated locally using `AsyncStorage` without requiring a third-party remote authentication backend.
2. **Per-User Scoped Favorites**: Favorites are isolated by user email to maintain independent bookmark lists across different user accounts on the same device.
3. **Public Data Source**: Image content, authors, and dimensions are sourced dynamically from the public Lorem Picsum REST API.
4. **Platform Permissions**: Saving photos to the device gallery requires media library write permissions. If denied by the user, a graceful sharing fallback is provided.
5. **Debounce Threshold**: A 300ms debounce interval provides the ideal balance between typing responsiveness and list rendering performance.

---

## 🔒 Data & Privacy

- All user profile credentials, password hashes, session states, and favorite bookmarks remain strictly local on the device inside `AsyncStorage`.
- No personal user data is transmitted to any external server.
- Image requests to Lorem Picsum are read-only HTTP GET requests for public domain photography.

---

## 📄 License & Author

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more details.

**Author**: **Harshvardhan Sawant**  
GitHub: [https://github.com/harshvardhan2709/FotoOwlGallery](https://github.com/harshvardhan2709/FotoOwlGallery)
