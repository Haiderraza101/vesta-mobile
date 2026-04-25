# Vesta - Home Service Application

Vesta is a mobile application platform for home services, built using React Native and the Expo SDK. This project implements a modular architecture with a focus on type safety, scalable UI components, and integrated Firebase services.

---

## Installation and Setup

### 1. System Requirements
The following dependencies must be installed:
- Node.js (LTS)
- Git
- Java Development Kit (JDK)
- Android Studio / Android SDK (for local Android builds)
- Expo Go (for physical device testing)

### 2. Project Initialization
Clone the repository and install the required node modules:
```bash
git clone https://github.com/Haiderraza101/vesta-mobile.git
cd vesta-mobile
npm install --legacy-peer-deps
```

### 3. Environment Configuration
Environment variables are managed through a `.env` file in the root directory. 
Reference `.env.example` for the required configuration keys.
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
...
```

### 4. Execution
To launch the Metro Bundler with a clean cache, execute:
```bash
npx expo start --clear
```
- Press 'a' to target a connected Android device.
- Scan the QR code with Expo Go to target a physical device.

---

## Technical Stack
- Framework: React Native (Expo SDK 54)
- Routing: Expo Router (File-based)
- Styling: NativeWind v4 (Tailwind CSS)
- Backend: Firebase (Authentication and Firestore)
- Iconography: Lucide React Native

---

## Project Architecture
- /app: Application routing and screen implementations.
- /components/ui: Atomic UI components (Button, Input, Text, etc.).
- /services: Service layer for third-party integrations (Firebase).
- /utils: Utility functions and style helpers.
- /types: Global TypeScript definitions and library overrides.

---

## Known Issues and Troubleshooting
In the event of a `Cannot find module 'react-native-worklets/plugin'` error during bundling:
1. Verify the installation of the `react-native-worklets` package.
2. Execute `npx expo start --clear` to invalidate the cache.
3. Ensure the Babel configuration points to the correct plugin path.

---

## Development Standards
- Design: Shadowless, high-contrast, institutional UI.
- Type Safety: Global type overrides are utilized in the /types directory; avoid the use of @ts-ignore.
- Modularity: Maintain a component-driven development approach.