# Synox App

React Native / Expo frontend for Synox — a premium, dark-mode AI image generation app. Users open the app, type a prompt, pick a style, and get a high-quality image in seconds. No account required.

## Tech Stack

| Category | Library |
|---|---|
| Framework | React Native 0.83 + Expo SDK 55 |
| Routing | Expo Router (file-based) |
| State — UI | Zustand 5 |
| State — Server | TanStack Query (React Query) v5 |
| HTTP Client | Axios |
| Persistent Storage | `react-native-mmkv` (fast key-value) |
| Secure Storage | `expo-secure-store` (Keychain/Keystore for device UUID) |
| Animations | `react-native-reanimated` 4 |
| Fonts | `@expo-google-fonts/outfit`, `@expo-google-fonts/inter` |
| Icons | `lucide-react-native` |
| Gradients | `expo-linear-gradient` |
| Image | `expo-image` |
| Sharing | `expo-sharing`, `expo-media-library` |
| Styling | React Native `StyleSheet` (no CSS-in-JS) |

## Project Structure

```
synox-app/
├── app/                        # Expo Router screens
│   ├── _layout.js              # Root layout — QueryClient provider, font loading
│   ├── index.js                # Entry point — checks auth, redirects accordingly
│   ├── (onboarding)/
│   │   └── index.js            # 4-slide onboarding swiper (shown once)
│   ├── (tabs)/
│   │   ├── home.js             # Main generation screen
│   │   ├── history.js          # Past generations grid
│   │   └── credits.js          # Credit balance + upgrade CTA
│   ├── advanced-settings.js    # Modal: aspect ratio, CFG scale, steps, seed, negative prompt
│   ├── loading.js              # Polling screen shown during generation
│   ├── paywall.js              # Upgrade screen (mocked for MVP)
│   ├── result.js               # Generated image viewer with save/share/regenerate
│   └── styles-picker.js        # Full-screen style preset grid
├── src/
│   ├── components/             # Reusable UI: Button, Card, Typography, etc.
│   ├── constants/              # Theme tokens (theme.js — colors, spacing, typography)
│   ├── services/               # Axios instance and API wrappers (api.js)
│   └── store/                  # Zustand global state (useAppStore.js)
└── assets/
    ├── images/                 # App icon, splash, noise texture
    └── fonts/                  # Bundled font files
```

## Setup

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo`
- iOS Simulator (Xcode) or Android Emulator (Android Studio), or the [Expo Go](https://expo.dev/go) app on a physical device

### Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Set `EXPO_PUBLIC_API_URL` to your backend URL (e.g., `http://localhost:3000/api` for local dev).

3. Start the dev server:
   ```bash
   npx expo start
   ```

4. Open the app:
   - Press `i` — iOS Simulator
   - Press `a` — Android Emulator
   - Scan the QR code with Expo Go on a physical device

## Environment Variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Base URL of the Synox API (e.g., `http://localhost:3000/api`) |

## App Flows

### First Launch
1. App checks `expo-secure-store` for an existing device UUID.
2. If none found: show onboarding → show paywall → register device with backend → receive JWT + 10 free credits → save to Keychain and MMKV → go to Home.
3. If UUID exists: validate JWT → go to Home directly.

### Generation
1. User enters a prompt on the Home screen, optionally picks a style and opens Advanced Settings.
2. Taps **Generate** — credits are deducted on the backend atomically.
3. App navigates to the Loading screen and polls `GET /api/job/:jobId` every 2.5 seconds via TanStack Query.
4. On completion, navigates to the Result screen with the final Supabase-hosted image URL.

### Credit Costs
| Model | Credits |
|---|---|
| Flux Schnell (fast) | 2 |
| Flux Dev (quality) | 6 |

## Design System

The app follows a strict **"Plasma & Obsidian"** dark-mode design system. Key rules:

| Token | Value | Usage |
|---|---|---|
| Obsidian | `#0A0A0C` | App background |
| Carbon | `#18181C` | Cards, modals, inputs |
| Graphite | `#27272A` | Borders, dividers |
| Plasma Rose | `#FF2A5F` | Primary CTA, active states |
| Electric Violet | `#7000FF` | Gradients (Pro/premium only) |
| Pure White | `#FFFFFF` | Headings, primary text |
| Ash Gray | `#A1A1AA` | Subtitles, placeholders |

- **Fonts:** Outfit (headings) + Inter (body/UI)
- **Borders:** 1px `#27272A` — no drop shadows in dark mode
- **Border radius:** 16px containers, pill (`9999px`) buttons, 12px images
- **Gradients:** Plasma Rose → Electric Violet, used only for premium/Pro moments
- **Icons:** Lucide outline icons, 1.5px stroke weight

All theme tokens live in `src/constants/theme.js`.

## Zustand Store Shape

```js
// src/store/useAppStore.js
{
  // Auth
  deviceId, jwtToken, credits,

  // Generation builder
  currentPrompt, selectedModel, selectedStyle,

  // Advanced settings
  settings: { aspectRatio, cfgScale, steps, seed, negativePrompt },

  // Actions
  setCredentials, updateCredits, setPrompt,
  setStyle, setModel, updateSettings, resetGenerationState
}
```

History and model/style data are fetched and cached by TanStack Query, not stored in Zustand.

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run ios` | Start on iOS Simulator |
| `npm run android` | Start on Android Emulator |
| `npm run web` | Start in browser |
| `npm run lint` | Run Expo linter |

## Related

- **[synox-app](../synox-app)** — The Express.js backend this app connects to
- **[Architecture Doc](../synox-api/docs/ARCHITECTURE.md)** — Full API contract, DB schema, and flow diagrams
- **[PRD](../synox-api/docs/PRD.md)** — Product requirements and feature list
- **[Brand Identity](../synox-api/docs/BRAND_IDENTITY.md)** — Full design system and brand guidelines
