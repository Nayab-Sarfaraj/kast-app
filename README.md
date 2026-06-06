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
| Device Identity | `expo-application` (reads Android ID / iOS IDFV for stable device fingerprint) |
| Animations | `react-native-reanimated` 4 |
| Scroll / Keyboard | `react-native-keyboard-aware-scroll-view` |
| Slider | `@react-native-community/slider` |
| Fonts | `@expo-google-fonts/outfit`, `@expo-google-fonts/inter` |
| Icons | `lucide-react-native` |
| Gradients | `expo-linear-gradient` |
| Image | `expo-image` |
| Clipboard | `expo-clipboard` |
| Sharing | `expo-sharing`, `expo-media-library` |
| Build | Expo Application Services (EAS) |
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
│   │   ├── _layout.js          # Tab bar layout
│   │   ├── home.js             # Main generation screen with random prompt button
│   │   ├── history.js          # Past generations grid (pull-to-refresh, focus invalidation)
│   │   └── credits.js          # Credit balance + upgrade CTA
│   ├── advanced-settings.js    # Modal: model selector, aspect ratio, CFG scale, steps, seed, negative prompt
│   ├── loading.js              # Polling screen shown during generation
│   ├── paywall.js              # Upgrade screen (mocked for MVP)
│   ├── result.js               # Image viewer with save / copy / share / regenerate
│   └── styles-picker.js        # Full-screen style preset grid
├── src/
│   ├── components/
│   │   ├── Button.js           # Primary / outline / gradient variants
│   │   ├── Card.js
│   │   ├── GradientPill.js
│   │   ├── InAppToast.js       # Animated top toast (success / error / info)
│   │   ├── NoiseOverlay.js
│   │   ├── ScreenHeader.js
│   │   ├── Skeleton.js         # Loading skeleton components for all main screens
│   │   └── Typography.js
│   ├── constants/              # Theme tokens (theme.js — colors, spacing, typography)
│   ├── services/
│   │   ├── api.js              # Axios instance + interceptors + all API wrappers
│   │   └── deviceIdentity.js   # Reads stable platform device ID, falls back to generated UUID
│   └── store/                  # Zustand global state (useAppStore.js)
├── android/                    # Native Android project (scaffolded via EAS)
├── ios/                        # Native iOS project (Synox.xcodeproj)
├── assets/
│   ├── images/
│   │   └── tabIcons/           # Custom bottom tab bar icons
│   └── noise.png               # Subtle noise overlay texture
├── eas.json                    # EAS Build configuration (dev / preview / production)
└── app.json                    # Expo config with EAS project ID
```

## Setup

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo`
- For native builds: Xcode (iOS) or Android Studio (Android)
- EAS CLI for cloud builds: `npm install -g eas-cli`

### Local Development

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

### EAS Builds

```bash
# Development build (install on device, use with dev server)
eas build --profile development --platform ios

# Preview build (internal distribution)
eas build --profile preview --platform all

# Production build (App Store / Play Store)
eas build --profile production --platform all
```

## Environment Variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Base URL of the Synox API (e.g., `http://localhost:3000/api`) |

## App Flows

### First Launch & Device Identity
1. App calls `getOrCreateDeviceId()` from `deviceIdentity.js`.
2. On Android, reads the stable Android ID via `expo-application`. On iOS, reads the IDFV. Falls back to a generated UUID if neither is available.
3. The device ID is persisted in `expo-secure-store` (Keychain/Keystore) under `synox_device_id` — survives app reinstalls on most devices.
4. If no JWT exists: show onboarding → show paywall → register device with backend → receive JWT + 10 free credits → save to Keychain and MMKV → go to Home.
5. If JWT exists: validate with backend → go to Home directly.

### Generation
1. User enters a prompt on the Home screen (or taps the dice icon to get an AI-generated random prompt from `GET /api/random-prompt`).
2. Optionally picks a style and opens Advanced Settings (aspect ratio, CFG scale, steps, seed, negative prompt, model).
3. Taps **Generate** — the backend refines the prompt via Gemini/Grok before sending to Replicate.
4. App navigates to the Loading screen and polls `GET /api/job/:jobId` every 2.5 seconds via TanStack Query.
5. On completion, navigates to the Result screen with the final Supabase-hosted image URL.

### Result Screen
- **Save** — saves image to camera roll via `expo-media-library`
- **Copy** — copies the image URL to clipboard via `expo-clipboard`
- **Share** — opens native share sheet via `expo-sharing`
- **Regenerate** — re-polls the same job or triggers a new generation

### History Screen
- Infinite scroll pagination (`GET /api/history?page=X&limit=20`)
- Pull-to-refresh support
- Automatically invalidates and refetches when the tab comes back into focus

### Credit Costs
| Model | Credits |
|---|---|
| Flux Schnell (fast) | 2 |
| Flux Dev (quality) | 6 |

## New Components

**`InAppToast`** (`src/components/InAppToast.js`)
A lightweight animated toast that slides in from the top of the screen. Supports `success`, `error`, and `info` types with distinct colors. Auto-dismisses after a configurable duration (default 2.2s). Used for credit deduction notifications, copy confirmations, and errors.

**`Skeleton`** (`src/components/Skeleton.js`)
Loading skeleton placeholders used across Home, History, and Credits screens while data is being fetched. Matches the layout of the real content to prevent layout shift.

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

- **[synox-api](../synox-api)** — The Express.js backend this app connects to
- **[Architecture Doc](../synox-api/docs/ARCHITECTURE.md)** — Full API contract, DB schema, and flow diagrams
- **[PRD](../synox-api/docs/PRD.md)** — Product requirements and feature list
- **[Brand Identity](../synox-api/docs/BRAND_IDENTITY.md)** — Full design system and brand guidelines
