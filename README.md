
# 🦉 FotoOwl Gallery


FotoOwl Gallery demonstrates user authentication, session persistence, profile management, centralized state management, API integration, image search and filtering, infinite scrolling, persistent favorites, full-screen image viewing, device gallery downloads, and native image sharing.

The application is built with **React Native, Expo, TypeScript, Expo Router, NativeWind, Zustand, AsyncStorage, and Axios**, with images fetched from the **Lorem Picsum API**.

---

## 🎯 Objectives

The application was developed to demonstrate:

- React Native fundamentals
- Mobile application architecture
- Functional components and React Hooks
- Centralized state management
- Local data persistence
- API integration
- Navigation
- Search and filtering
- Infinite scrolling
- Image favorites
- Profile management
- Reusable and maintainable components
- Native device functionality


---

# 🌟 Features

## 🔐 Authentication & Session Persistence

### Registration

Users can create a local account with:

- Full Name
- Email Address
- Gender
- Mobile Number
- Address
- City
- Password
- Confirm Password

Registration includes validation for:

- Required fields
- Valid email format
- 10-digit mobile number
- Minimum 6-character password
- Matching password and confirmation

User information is stored locally using **AsyncStorage**.

### Login

Users can log in using the credentials registered locally.

The application validates the entered credentials against the locally stored user data.

### Session Persistence

The application restores the logged-in session when the application is launched again.

Users do not need to log in repeatedly unless they explicitly log out.

### Demo Login

A demo credential auto-fill option is provided for easier testing:

```text
Email: demo@fotoowl.ai
````

---

# 🖼️ Home Gallery

The Home screen provides a two-column image gallery using React Native's `FlatList`.

Images are fetched from the **Lorem Picsum API**.

### Image Information

Each gallery item displays:

* Image thumbnail
* Author name
* Image ID
* Image dimensions
* Favorite button

### Infinite Scrolling

The gallery implements infinite scrolling using `FlatList` and `onEndReached`.

Images are loaded incrementally as the user reaches the end of the currently displayed list.

The gallery maintains pagination state using Zustand.

### Pull-to-Refresh

Users can pull down on the gallery to reload the first page of images.

The refresh logic prevents duplicate refresh requests and prevents pagination from running simultaneously with a refresh.

### Search

Users can search images by photographer/author name.

Search is:

* Case-insensitive
* Real-time
* Debounced by 300ms

### Author Filters

The gallery provides three author filters:

```text
All
A - M
N - Z
```

Search and filtering work together on the gallery dataset.

---

# ❤️ Favorites

Users can favorite or unfavorite images directly from:

* Home gallery
* Image Details screen
* Full-screen image viewer

Favorites are stored persistently using AsyncStorage.

Favorite IDs are stored locally under:

```text
@fotowl/favorites
```

Favorites remain available after restarting the application.

## Favorites Screen

The dedicated Favorites screen allows users to:

* View all favorite images
* Search favorite images
* Remove images from favorites
* Open image details

An empty-state UI is displayed when no favorites have been saved.

---

# 🔍 Image Details

Tapping an image opens a dedicated Image Details screen.

The screen displays:

* Full-size image
* Author name
* Image ID
* Image dimensions
* Aspect ratio
* Favorite status
* Download action
* Share action

The details screen uses the Picsum image information endpoint when additional image information is required.

---

# 🖥️ Full-Screen Image Viewer

The selected image can be opened in a full-screen lightbox viewer.

The viewer provides:

* High-resolution image display
* Full-screen presentation
* Favorite/unfavorite action
* Download action
* Native sharing
* Close/back navigation

Images are rendered using `expo-image` with memory/disk caching.

---

# 📥 Image Download

Images can be downloaded directly to the device gallery.

The application uses:

* `expo-file-system`
* `expo-media-library`

The centralized `mediaService` handles:

1. Downloading the image
2. Requesting media-library permissions
3. Saving the downloaded image
4. Handling permission denial
5. Providing a sharing fallback where appropriate

---

# 📤 Image Sharing

The application supports native image sharing using:

```text
expo-sharing
```

Users can share image content through the device's available sharing options.


---

# 👤 Profile Management

The Profile screen displays the currently logged-in user's information:

* Full Name
* Email Address
* Mobile Number
* Gender
* Address
* City

Users can enter an edit mode and update their profile information.

Updated information is:

* Saved locally
* Updated in the Zustand authentication store
* Reflected immediately throughout the application

The Profile screen also provides a logout option with confirmation.

---

# 📱 Native Navigation

The application uses **Expo Router** with native stack and tab navigation.

Navigation includes:

* Authentication routes
* Tab navigation
* Image detail routes
* Full-screen modal navigation

Android hardware back navigation is handled for detail and full-screen views so users can return to the previous screen without unexpectedly exiting the application.

---

# ⭐ Bonus Features Implemented


FotoOwl Gallery implements the following:

### ✅ Debounced Search

Author search uses a 300ms debounce to reduce unnecessary filtering updates while the user is typing.

### ✅ Reusable Components

Reusable UI components have been created for common functionality:

* `ImageCard`
* `FavoriteCard`
* `SearchBar`
* `FilterPills`
* `InputField`
* `FullScreenImageViewer`

### ✅ Custom Hooks

Reusable hooks are used for:

* Debounced values
* Search state and behavior

```text
useDebounce
useSearch
```

### ✅ Image Sharing

Images can be shared through the device's native sharing functionality using `expo-sharing`.

### ✅ Pull-to-Refresh Optimization

Refresh and pagination operations are guarded against duplicate or conflicting API requests.

---

# ⚡ Performance & Architecture

The application focuses on maintainable architecture and efficient list rendering.

### FlatList Optimization

The gallery uses:

* Two-column rendering
* Fixed card dimensions
* `getItemLayout`
* Memoized image cards

This allows FlatList to calculate row positions efficiently and reduces unnecessary layout measurements.

### Component Memoization

`ImageCard` uses `React.memo` to reduce unnecessary component re-renders when unrelated gallery state changes.

### Image Caching

Images are rendered using `expo-image` with:

```text
memory-disk
```

caching for improved repeated image loading.

### Debounced Search

Search input is debounced by 300ms before filtering is applied.

### Centralized State Management

Zustand manages shared application state including:

* Authentication
* Session state
* Gallery images
* Pagination
* Favorites
* Search query
* Author filters
* Loading states

---

# 🛠️ Technology Stack

| Category          | Technology                    |
| ----------------- | ----------------------------- |
| Framework         | React Native 0.86.2           |
| Platform          | Expo ~57.0.12                 |
| Language          | TypeScript ~6.0.3             |
| Navigation        | Expo Router ~57.0.12          |
| Styling           | NativeWind ^4.2.6             |
| CSS Framework     | Tailwind CSS ^3.4.17          |
| State Management  | Zustand ^5.0.14               |
| Local Persistence | AsyncStorage 2.2.0            |
| HTTP Client       | Axios ^1.19.0                 |
| Image Rendering   | expo-image                    |
| File Downloads    | expo-file-system              |
| Gallery Access    | expo-media-library            |
| Sharing           | expo-sharing                  |
| Icons             | @expo/vector-icons / Ionicons |
| API               | Lorem Picsum                  |

---

# 📁 Project Structure

```text
FotoOwlGallery/
│
├── assets/
│   └── # App icons, splash screen and static assets
│
├── src/
│   │
│   ├── app/
│   │   ├── _layout.tsx
│   │   │   # Root navigation, session restoration and auth routing
│   │   │
│   │   ├── index.tsx
│   │   │   # Entry route / authentication redirect
│   │   │
│   │   ├── login.tsx
│   │   │   # Login screen
│   │   │
│   │   ├── register.tsx
│   │   │   # Registration screen and validation
│   │   │
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   │   # Tab navigation
│   │   │   │
│   │   │   ├── home.tsx
│   │   │   │   # Gallery, search, filtering and pagination
│   │   │   │
│   │   │   ├── favorites.tsx
│   │   │   │   # Favorite images
│   │   │   │
│   │   │   └── profile.tsx
│   │   │       # Profile viewing, editing and logout
│   │   │
│   │   └── image/
│   │       └── [id].tsx
│   │           # Image details and full-screen viewer
│   │
│   ├── components/
│   │   ├── ImageCard.tsx
│   │   ├── FavoriteCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterPills.tsx
│   │   ├── InputField.tsx
│   │   └── FullScreenImageViewer.tsx
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── useSearch.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── mediaService.ts
│   │   └── storage.ts
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   └── galleryStore.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   └── image.ts
│   │
│   └── utils/
│       └── validation.ts
│
├── app.json
├── package.json
├── eas.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

# 🔗 API Integration

FotoOwl Gallery uses the public **Lorem Picsum API**.

## Paginated Image List

```text
GET https://picsum.photos/v2/list?page={page}&limit={limit}
```

Used to fetch gallery images incrementally.

## Image Information

```text
GET https://picsum.photos/id/{id}/info
```

Used to retrieve image information such as:

* ID
* Author
* Width
* Height
* Image URL
* Download URL

## Image URL

```text
GET https://picsum.photos/id/{id}/{width}/{height}
```

Used to request an image at a specific resolution.

---

# 💾 Local Storage

AsyncStorage is used for local application persistence.

The application stores:

### User

```text
@fotowl/user
```

### Session

```text
@fotowl/session
```

### Favorites

```text
@fotowl/favorites
```

The storage logic is centralized in:

```text
src/services/storage.ts
```

This keeps persistence logic separate from UI components.

---

# 🔄 Application Flow

```text
                    ┌──────────────┐
                    │   Register   │
                    └──────┬───────┘
                           │
                           ▼
                    Local User Data
                           │
                           ▼
                    ┌──────────────┐
                    │    Login     │
                    └──────┬───────┘
                           │
                           ▼
                  Persistent Session
                           │
                           ▼
                    ┌──────────────┐
                    │     Home     │
                    │    Gallery   │
                    └──────┬───────┘
                           │
             ┌─────────────┼──────────────┐
             ▼             ▼              ▼
          Search         Filter        Favorite
             │             │              │
             └─────────────┼──────────────┘
                           ▼
                    Image Details
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
             Full Screen         Download /
               Viewer              Share

                    │
                    ▼
              Favorites Screen

                    │
                    ▼
                Profile
                    │
             ┌──────┴──────┐
             ▼             ▼
         Edit Profile    Logout
```

---

# 🚀 Getting Started

## Prerequisites

Install the following:

* Node.js v18 or higher
* npm or yarn
* Expo Go for physical-device development
* Android Studio for Android emulator development
* Xcode for iOS development

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/harshvardhan2709/FotoOwlGallery.git
cd FotoOwlGallery
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the Expo development server

```bash
npx expo start
```

### 4. Run the application

For Android:

```bash
npm run android
```

For iOS:

```bash
npm run ios
```

For Web:

```bash
npm run web
```

Alternatively, scan the Expo QR code using Expo Go on a physical Android or iOS device.

---

# 📜 Available NPM Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm start`       | Start Expo development server |
| `npm run android` | Run Android application       |
| `npm run ios`     | Run iOS application           |
| `npm run web`     | Run web application           |
| `npm run lint`    | Run ESLint checks             |

---

# 🧪 Validation & Verification

Before submission, the following areas should be tested:

### Authentication

* Registration validation
* Successful registration
* Login with valid credentials
* Invalid login handling
* Session persistence
* Logout

### Gallery

* Initial image loading
* Loading state
* API failure handling
* Infinite scrolling
* Pull-to-refresh
* Author search
* Case-insensitive search
* A-M filter
* N-Z filter
* Search + filter combination

### Favorites

* Add favorite
* Remove favorite
* Favorites persistence after restart
* Favorites screen
* Favorites search

### Image Details

* Image details
* Author
* Image ID
* Dimensions
* Full-screen viewer
* Download
* Native sharing

### Profile

* Display user information
* Edit profile
* Save changes
* Immediate UI update
* Logout

---

# 📦 APK

The  prefers an Android APK for submission.

The application can be built using **EAS Build**.

Example:

```bash
eas build -p android --profile preview
```

The resulting APK can be downloaded from the Expo EAS build page and installed directly on an Android device.

---

# 📌 Assumptions

The following implementation assumptions were made:

1. Authentication is implemented locally because the  specifies validating credentials against registered user data stored locally.
2. AsyncStorage is used for user data, session state, and favorite IDs.
3. Images are fetched from the public Lorem Picsum API.
4. Pagination loads images incrementally as the user reaches the end of the current gallery.
5. Author filtering is implemented using the -provided `All`, `A-M`, and `N-Z` ranges.
6. Image download requires device media-library permission.
7. Native sharing availability depends on the capabilities of the user's device.
8. The application does not use a remote authentication backend because one is not required by the .

---

# 🔒 Data & Privacy

FotoOwl Gallery does not require a remote authentication server.

User profile information, session information, and favorite IDs are stored locally using AsyncStorage.

Images are retrieved from the public Lorem Picsum API.

---

# 📄 License

This project is available under the MIT License.

See [LICENSE](LICENSE) for details.

---

# 👨‍💻 Author

**Harshvardhan Sawant**

GitHub:

[https://github.com/harshvardhan2709/FotoOwlGallery](https://github.com/harshvardhan2709/FotoOwlGallery)

