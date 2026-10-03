import { MilestoneStatus, ResourceType, ICodeSnippet, IQuizQuestion } from '../models/roadmap.model';

export interface ISeedMilestone {
  milestoneId: string;
  title: string;
  description: string;
  estimatedHours: number;
  skills: string[];
  resources: Array<{
    title: string;
    url: string;
    type: ResourceType;
  }>;
  summary: string;
  keyTopics: string[];
  codeSnippet: ICodeSnippet;
  quiz: IQuizQuestion[];
  taskPrompt: string;
}

export interface ISeedPhase {
  phaseId: string;
  phaseTitle: string;
  order: number;
  milestones: ISeedMilestone[];
}

export interface ISeedRoadmap {
  role: string;
  domain: string;
  matchKeys: string[];
  description: string;
  phases: ISeedPhase[];
}

export const SEED_ROADMAPS: Record<string, ISeedRoadmap> = {
  mobile: {
    role: 'Mobile App Developer',
    domain: 'Mobile App Development',
    matchKeys: ['mobile', 'android', 'ios', 'flutter', 'react native', 'swift', 'kotlin'],
    description:
      'Architect native-grade mobile applications with smooth 60fps animations, hardware integrations, offline synchronization, and automated store deployments.',
    phases: [
      {
        phaseId: 'mob_p1',
        phaseTitle: 'Phase 1: Core Mobile Architecture & React Native Foundations',
        order: 1,
        milestones: [
          {
            milestoneId: 'mob_m1',
            title: 'React Native & Expo Architecture',
            description:
              'Master JSX components, StyleSheet primitives, Expo Router file-based stack navigation, and safe area handling across devices.',
            estimatedHours: 25,
            skills: ['React Native', 'Expo', 'File-based Routing', 'TypeScript'],
            summary:
              'Modern cross-platform mobile engineering centers on declarative UI components coupled to native platform views via the React Native runtime. With Expo Router and the New Architecture (Fabric renderer and TurboModules), developers structure applications with file-based routing and synchronous C++ JSI bindings, eliminating bridge serializations and ensuring strict 60fps render pipelines across iOS and Android.',
            keyTopics: [
              'Fabric rendering pipeline and synchronous JSI C++ layout calculation via Yoga',
              'Expo Router file-system convention with dynamic route segments and modal stacks',
              'Edge-to-edge safe area insets and adaptive layout with React Native StyleSheet primitives',
              'Cross-platform platform-specific extensions (.ios.tsx, .android.tsx) and design tokens',
            ],
            codeSnippet: {
              title: 'Expo Router Stack Layout with Typed Screen Options',
              language: 'typescript',
              code: `import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
        },
        headerTintColor: isDark ? '#f8fafc' : '#0f172a',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="modal/details"
        options={{
          presentation: 'modal',
          title: 'Milestone Execution',
          headerBackTitle: 'Dismiss',
        }}
      />
    </Stack>
  );
}`,
            },
            resources: [
              {
                title: 'Expo Router Official Documentation',
                url: 'https://docs.expo.dev/router/introduction/',
                type: 'DOCS',
              },
              {
                title: 'React Native New Architecture: Fabric & TurboModules',
                url: 'https://reactnative.dev/docs/the-new-architecture/landing-page',
                type: 'ARTICLE',
              },
              {
                title: 'Building Universal React Native Apps with Expo',
                url: 'https://docs.expo.dev/guides/overview/',
                type: 'DOCS',
              },
            ],
            quiz: [
              {
                question: 'Which rendering engine replaces the legacy asynchronous JSON bridge in React Native?',
                options: ['Fabric & TurboModules (JSI)', 'WebKit WebView', 'V8 IPC Channel', 'Skia Canvas 2D'],
                correctIndex: 0,
              },
              {
                question: 'In Expo Router, how do you define a modal presentation screen in stack navigation?',
                options: [
                  'Set presentation: "modal" in Stack.Screen options',
                  'Wrap with HTML <dialog> tag',
                  'Invoke navigator.openModal() imperative call',
                  'Include modal="true" in index.html',
                ],
                correctIndex: 0,
              },
              {
                question: 'Why should SafeAreaProvider from react-native-safe-area-context wrap the app root?',
                options: [
                  'To measure physical display cutouts, notches, and home indicator insets dynamically',
                  'To prevent users from taking screenshots',
                  'To enforce landscape-only orientation',
                  'To compress native image assets',
                ],
                correctIndex: 0,
              },
            ],
            taskPrompt:
              'Scaffold an Expo Router application with a bottom tab navigator and a nested details modal screen. Apply dark/light theme tokens and protect header safe-area insets.',
          },
          {
            milestoneId: 'mob_m2',
            title: 'Navigation & Native Device State',
            description:
              'Implement deep linking, bottom tabs, drawer navigation, modal sheets, and global client state synchronization.',
            estimatedHours: 20,
            skills: ['React Navigation', 'Deep Linking', 'Zustand', 'Context API'],
            summary:
              'Production mobile applications require seamless deep linking to handle universal links and push notification routes. Combining React Navigation with a lightweight reactive state store like Zustand guarantees predictable client state synchronization, immediate hydration from persistent storage, and decoupled business logic outside the UI render tree.',
            keyTopics: [
              'Custom deep linking schemes (myapp://) and universal iOS/Android web links',
              'Atomic reactive state management with Zustand and AsyncStorage persistence middleware',
              'Nested navigation hierarchies (Tabs within Stacks with independent navigation guards)',
              'Handling hardware back buttons on Android with BackHandler listeners',
            ],
            codeSnippet: {
              title: 'Zustand Persistent Mobile Store with Typed Selectors',
              language: 'typescript',
              code: `import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  userToken: string | null;
  activeTrackId: string;
  setToken: (token: string | null) => void;
  setActiveTrack: (trackId: string) => void;
  logout: () => Promise<void>;
}

export const useMobileStore = create<AuthState>()(
  persist(
    (set) => ({
      userToken: null,
      activeTrackId: 'mobile-eng',
      setToken: (token) => set({ userToken: token }),
      setActiveTrack: (trackId) => set({ activeTrackId: trackId }),
      logout: async () => {
        await AsyncStorage.removeItem('mobile_vault_token');
        set({ userToken: null });
      },
    }),
    {
      name: 'nexora_mobile_vault',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);`,
            },
            resources: [
              {
                title: 'React Navigation Deep Linking Architecture',
                url: 'https://reactnavigation.org/docs/deep-linking/',
                type: 'DOCS',
              },
              {
                title: 'Zustand State Management for React Native',
                url: 'https://docs.pmnd.rs/zustand/getting-started/introduction',
                type: 'DOCS',
              },
              {
                title: 'Universal Linking on iOS & Android Deep Link Verification',
                url: 'https://docs.expo.dev/guides/deep-linking/',
                type: 'ARTICLE',
              },
            ],
            quiz: [
              {
                question: 'Which component is required to handle deep links seamlessly across cold and warm app starts?',
                options: [
                  'A linking configuration with prefixes and path-to-screen mappings',
                  'An HTTP proxy server running locally on the device',
                  'A native C++ background daemon',
                  'A dedicated Android Service in Java only',
                ],
                correctIndex: 0,
              },
              {
                question: 'What is the primary benefit of Zustand over React Context for frequently updated mobile state?',
                options: [
                  'Selective re-rendering via selector functions prevents unnecessary component re-renders',
                  'Zustand runs in a web worker thread',
                  'Zustand compiles to WebAssembly',
                  'Context cannot store objects or arrays',
                ],
                correctIndex: 0,
              },
              {
                question: 'How does Android handle back navigation when hardware back button is pressed?',
                options: [
                  'It triggers hardware BackHandler event which can be intercepted and prevented',
                  'It terminates the entire operating system',
                  'It immediately clears the entire SQLite database',
                  'It triggers a browser page refresh',
                ],
                correctIndex: 0,
              },
            ],
            taskPrompt:
              'Configure a custom linking config supporting paths like "nexora://roadmap/:milestoneId". Connect it to a persistent Zustand auth slice with AsyncStorage.',
          },
        ],
      },
      {
        phaseId: 'mob_p2',
        phaseTitle: 'Phase 2: Hardware Integrations, Biometrics & Security',
        order: 2,
        milestones: [
          {
            milestoneId: 'mob_m3',
            title: 'Camera, GPS & Hardware Sensors',
            description:
              'Integrate device camera viewfinders, background GPS geolocation tracking, accelerometer telemetry, and runtime permission flows.',
            estimatedHours: 30,
            skills: ['Expo Camera', 'Expo Location', 'Sensors API', 'Permissions API'],
            summary:
              'Accessing native hardware requires strict compliance with platform permission models, privacy declarations (Info.plist / AndroidManifest.xml), and battery-conscious background location geofencing. Building resilient camera capture components with optical bar-code scanning or photo processing requires managing camera sessions and surface hardware lifecycle.',
            keyTopics: [
              'Runtime permission handling with rationales for iOS NSCameraUsageDescription and Android ACCESS_FINE_LOCATION',
              'Expo Camera Next implementation with custom torch, exposure, and photo capture hooks',
              'Background geofencing and task manager registration using TaskManager.defineTask',
              'Battery throttling strategies when streaming sensor telemetry (accelerometer, gyroscope)',
            ],
            codeSnippet: {
              title: 'Robust Hardware Permission & Camera Capture Component',
              language: 'typescript',
              code: `import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export function HardwareScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.prompt}>NEXORA Lab requires camera access to scan engineering badges.</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={(result) => setScannedCode(result.data)}
      />
      {scannedCode && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Scanned: {scannedCode}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  prompt: { color: '#f8fafc', textAlign: 'center', marginBottom: 16 },
  btn: { backgroundColor: '#4f46e5', paddingHorizontal: 20, paddingVertical: 12, rounded: 12 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  banner: { position: 'absolute', bottom: 40, left: 20, right: 20, padding: 16, backgroundColor: 'rgba(15,23,42,0.9)', borderRadius: 12 },
  bannerText: { color: '#38bdf8', textAlign: 'center', fontWeight: '600' },
});`,
            },
            resources: [
              {
                title: 'Expo Camera Documentation & Best Practices',
                url: 'https://docs.expo.dev/versions/latest/sdk/camera/',
                type: 'DOCS',
              },
              {
                title: 'Expo Location: Geofencing & Battery-Conscious Tracking',
                url: 'https://docs.expo.dev/versions/latest/sdk/location/',
                type: 'DOCS',
              },
              {
                title: 'OWASP Mobile Security: Hardware Sensor Permissions',
                url: 'https://mas.owasp.org/MASTG/',
                type: 'ARTICLE',
              },
            ],
            quiz: [
              {
                question: 'What is required on iOS before calling any Camera or Location native APIs?',
                options: [
                  'Declaring user-facing usage descriptions in Info.plist and requesting runtime permissions',
                  'Registering an Apple Developer Enterprise certificate',
                  'Restarting the physical iPhone hardware',
                  'Converting JSX files to Objective-C headers',
                ],
                correctIndex: 0,
              },
              {
                question: 'Which API allows executing background location coordinates even when the app is suspended?',
                options: [
                  'Expo Location background tracking with TaskManager.defineTask',
                  'Standard window.setInterval() in JavaScript',
                  'CSS keyframe animations',
                  'Redux dispatch inside setTimeout()',
                ],
                correctIndex: 0,
              },
              {
                question: 'How should sensor sampling frequency (e.g. Accelerometer) be configured to preserve battery?',
                options: [
                  'Set update interval to sensor-appropriate thresholds (e.g., 200-500ms) and unsubscribe on unmount',
                  'Poll at 10,000 Hz continuously in an infinite while loop',
                  'Never unsubscribe when screen is turned off',
                  'Store each coordinate in global window object without bounds',
                ],
                correctIndex: 0,
              },
            ],
            taskPrompt:
              'Construct a hardware telemetry module that checks location permissions, streams GPS coordinates to a reactive map view, and captures photo milestones with battery telemetry checks.',
          },
          {
            milestoneId: 'mob_m4',
            title: 'Biometrics & Keychain Storage',
            description:
              'Secure user sessions with FaceID / TouchID biometric challenges, iOS Keychain, and Android Keystore hardware-backed encryption.',
            estimatedHours: 20,
            skills: ['LocalAuthentication', 'Expo SecureStore', 'Hardware Keystore', 'Biometrics'],
            summary:
              'Enterprise-grade mobile security demands that sensitive tokens, cryptographic keys, and refresh secrets reside strictly within hardware-isolated vaults (iOS Secure Enclave / Android Trusted Execution Environment Keystore). Standard AsyncStorage stores plaintext on the device flash storage; replacing it with SecureStore guarded by biometric authentication shields users from memory dumping and physical attacks.',
            keyTopics: [
              'Hardware Secure Enclave vs. plaintext AsyncStorage security vulnerabilities',
              'Expo LocalAuthentication: Biometric capability auditing (hasHardwareAsync, isEnrolledAsync)',
              'Hardware-backed AES-256 encrypted storage using expo-secure-store',
              'Graceful biometric fallback to device passcode authentication',
            ],
            codeSnippet: {
              title: 'Biometric Authenticator with Hardware Keychain Encryption',
              language: 'typescript',
              code: `import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export async function unlockDeviceVault(): Promise<string | null> {
  // 1. Audit hardware capabilities
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    throw new Error('Biometric hardware unavailable or no biometrics enrolled.');
  }

  // 2. Prompt biometric challenge
  const authResult = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock NEXORA Developer Credentials',
    fallbackLabel: 'Enter Passcode',
    disableDeviceFallback: false,
    cancelLabel: 'Cancel',
  });

  if (!authResult.success) {
    return null;
  }

  // 3. Decrypt token from hardware-backed Keychain / Keystore
  const sessionToken = await SecureStore.getItemAsync('nexora_jwt_vault', {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });

  return sessionToken;
}`,
            },
            resources: [
              {
                title: 'Expo LocalAuthentication API Documentation',
                url: 'https://docs.expo.dev/versions/latest/sdk/local-authentication/',
                type: 'DOCS',
              },
              {
                title: 'Expo SecureStore: Hardware-Backed Keychain & Keystore',
                url: 'https://docs.expo.dev/versions/latest/sdk/securestore/',
                type: 'DOCS',
              },
              {
                title: 'OWASP Mobile Security Testing Guide: Cryptography & Key Storage',
                url: 'https://mas.owasp.org/MASTG/tests/android/MASVS-CRYPTO/MASTG-TEST-0017/',
                type: 'ARTICLE',
              },
            ],
            quiz: [
              {
                question: 'Why should user authentication tokens NEVER be placed in standard AsyncStorage?',
                options: [
                  'AsyncStorage is unencrypted plaintext on flash storage, making it accessible on rooted/jailbroken devices',
                  'AsyncStorage can only hold numbers under 100',
                  'AsyncStorage is cleared every 5 minutes automatically',
                  'AsyncStorage does not support string serialization',
                ],
                correctIndex: 0,
              },
              {
                question: 'Which iOS hardware component stores and validates FaceID/TouchID biometric data?',
                options: ['Secure Enclave', 'GPU Compute Unit', 'NAND Flash Controller', 'Baseband Modem'],
                correctIndex: 0,
              },
              {
                question: 'What accessibility flag in SecureStore prevents tokens from being backed up to iCloud or transferred to another device?',
                options: [
                  'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
                  'ALWAYS_PUBLIC',
                  'ICLOUD_GLOBAL_SHARE',
                  'NO_SECURITY_OVERRIDE',
                ],
                correctIndex: 0,
              },
            ],
            taskPrompt:
              'Implement a biometric lock screen component that challenges the user via FaceID/TouchID before decrypting and hydrating sensitive JWT session tokens from Expo SecureStore.',
          },
        ],
      },
      {
        phaseId: 'mob_p3',
        phaseTitle: 'Phase 3: Offline-First Architecture & Data Persistence',
        order: 3,
        milestones: [
          {
            milestoneId: 'mob_m5',
            title: 'SQLite, WatermelonDB & Local Persistence',
            description:
              'Design local embedded database schemas with SQLite, schema migrations, batch indexing, and high-performance querying.',
            estimatedHours: 35,
            skills: ['Expo SQLite', 'WatermelonDB', 'Local Schemas', 'Indexing'],
            summary:
              'World-class mobile apps maintain immediate sub-10ms response times by operating on local SQLite database replicas rather than waiting on network waterfalls. Expo SQLite with typed WAL (Write-Ahead Logging) mode and PRAGMA indexing allows apps to store tens of thousands of records locally and execute complex joins with zero UI stutter.',
            keyTopics: [
              'Embedded SQLite database lifecycle with expo-sqlite/next modern async API',
              'Write-Ahead Logging (WAL) configuration and foreign key constraint enforcement',
              'Database schema migrations with version tracking tables',
              'Batch indexing strategies for ultra-fast full-text and ID lookups',
            ],
            codeSnippet: {
              title: 'Expo SQLite Next Typed Migration & Query Runner',
              language: 'typescript',
              code: `import * as SQLite from 'expo-sqlite';

export async function initializeDatabase() {
  const db = await SQLite.openDatabaseAsync('nexora_local.db');

  // Configure high-performance WAL mode & foreign keys
  await db.execAsync(\`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    
    CREATE TABLE IF NOT EXISTS milestones (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('LOCKED','AVAILABLE','IN_PROGRESS','COMPLETED')),
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones (status);
  \`);

  return db;
}

export async function upsertMilestone(db: SQLite.SQLiteDatabase, id: string, title: string, status: string) {
  const statement = await db.prepareAsync(\`
    INSERT INTO milestones (id, title, status, updated_at)
    VALUES ($id, $title, $status, $updatedAt)
    ON CONFLICT(id) DO UPDATE SET
      status = excluded.status,
      updated_at = excluded.updated_at;
  \`);

  try {
    await statement.executeAsync({
      $id: id,
      $title: title,
      $status: status,
      $updatedAt: Date.now(),
    });
  } finally {
    await statement.finalizeAsync();
  }
}`,
            },
            resources: [
              {
                title: 'Expo SQLite Next Modern API Guide',
                url: 'https://docs.expo.dev/versions/latest/sdk/sqlite/',
                type: 'DOCS',
              },
              {
                title: 'High-Performance Local DB with WatermelonDB & SQLite',
                url: 'https://watermelondb.dev/docs',
                type: 'DOCS',
              },
              {
                title: 'Designing Offline-First Mobile Architectures',
                url: 'https://martinfowler.com/articles/patterns-of-distributed-systems/',
                type: 'ARTICLE',
              },
            ],
            quiz: [
              {
                question: 'What is the primary advantage of SQLite Write-Ahead Logging (WAL) mode in mobile apps?',
                options: [
                  'Readers do not block writers and writers do not block readers, drastically improving concurrent performance',
                  'It stores database rows in HTML tables',
                  'It automatically backs up data to Facebook servers',
                  'It compiles SQL statements directly into Swift',
                ],
                correctIndex: 0,
              },
              {
                question: 'Why are prepared statements (db.prepareAsync) recommended for frequent database writes?',
                options: [
                  'They compile and optimize the SQL query plan once and prevent SQL injection vulnerabilities',
                  'They prevent JavaScript garbage collection',
                  'They compress images to WebP',
                  'They enforce HTTPS certificates',
                ],
                correctIndex: 0,
              },
              {
                question: 'How do index tables (CREATE INDEX) optimize queries on status columns?',
                options: [
                  'By establishing a B-Tree structure allowing O(log N) lookups instead of expensive full table scans',
                  'By deleting uncompleted tasks automatically',
                  'By converting text to uppercase',
                  'By generating CSS stylesheets',
                ],
                correctIndex: 0,
              },
            ],
            taskPrompt:
              'Create an Expo SQLite database migration service that sets up a local milestones table, creates B-Tree indexes, and performs batch upserts with transaction safety.',
          },
          {
            milestoneId: 'mob_m6',
            title: 'Background Synchronization & Conflict Resolution',
            description:
              'Orchestrate background mutations, offline write-ahead queues, optimistic UI reconciliation, and CRDT / timestamp conflict resolution.',
            estimatedHours: 30,
            skills: ['Offline Sync', 'TanStack Query', 'NetInfo', 'CRDTs'],
            summary:
              'An offline-first application writes mutations immediately to an idempotent local write-ahead queue, updates the UI optimistically, and listens to network connectivity changes via NetInfo. Once connectivity resumes, background workers drain the queue and reconcile conflicts using Last-Write-Wins (LWW) or Conflict-Free Replicated Data Types (CRDTs).',
            keyTopics: [
              'Idempotent mutation queue design with exponential backoff retries',
              'Network connectivity monitoring with @react-native-community/netinfo',
              'TanStack Query mutation caching and offline persist-client plugins',
              'Conflict resolution strategies (Last-Write-Wins timestamps vs. 3-way vector clock merges)',
            ],
            codeSnippet: {
              title: 'Resilient Offline Mutation Sync Worker',
              language: 'typescript',
              code: `import NetInfo from '@react-native-community/netinfo';

interface QueuedMutation {
  id: string;
  endpoint: string;
  payload: Record<string, any>;
  timestamp: number;
}

export class OfflineSyncQueue {
  private queue: QueuedMutation[] = [];
  private isProcessing = false;

  constructor() {
    NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        this.drainQueue();
      }
    });
  }

  public enqueue(endpoint: string, payload: Record<string, any>) {
    const item: QueuedMutation = {
      id: Math.random().toString(36).substring(2, 9),
      endpoint,
      payload,
      timestamp: Date.now(),
    };
    this.queue.push(item);
  }

  public async drainQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue[0];
      try {
        await fetch(item.endpoint, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item.payload, clientTimestamp: item.timestamp }),
        });
        this.queue.shift(); // Successfully flushed
      } catch (err) {
        console.warn('Network sync interrupted, backing off:', err);
        break; // Retry when network fires again
      }
    }
    this.isProcessing = false;
  }
}`,
            },
            resources: [
              {
                title: 'TanStack Query Offline Persistence & Cache Resumption',
                url: 'https://tanstack.com/query/latest/docs/framework/react/guides/offline-mutations',
                type: 'DOCS',
              },
              {
                title: 'Offline-First Web & Mobile Synchronization Strategies',
                url: 'https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline',
                type: 'ARTICLE',
              },
              {
                title: 'Conflict-Free Replicated Data Types (CRDT) Primer',
                url: 'https://crdt.tech/',
                type: 'DOCS',
              },
            ],
            quiz: [
              {
                question: 'What is the primary role of an idempotent mutation queue in offline mobile apps?',
                options: [
                  'To buffer local actions during network dropouts and execute them in order without duplicate effects upon reconnect',
                  'To bypass user authentication checks',
                  'To prevent users from navigating between screens',
                  'To format dates to UTC',
                ],
                correctIndex: 0,
              },
              {
                question: 'Which network property from NetInfo confirms actual HTTP communication rather than merely WiFi connection?',
                options: ['isInternetReachable', 'isConnected', 'type', 'isWifiEnabled'],
                correctIndex: 0,
              },
              {
                question: 'In Last-Write-Wins (LWW) conflict resolution, how is a conflicting record updated?',
                options: [
                  'The mutation with the higher monotonic or server-verified timestamp takes precedence',
                  'The user is prompted to delete their account',
                  'Both records are permanently deleted',
                  'The shortest string value is selected',
                ],
                correctIndex: 0,
              },
            ],
            taskPrompt:
              'Build an offline mutation queue that wraps the PATCH milestone endpoint, caches failed network attempts locally, and automatically flushes them when NetInfo detects connectivity.',
          },
        ],
      },
      {
        phaseId: 'mob_p4',
        phaseTitle: 'Phase 4: High-Performance Animations & Native Bridges',
        order: 4,
        milestones: [
          {
            milestoneId: 'mob_m7',
            title: 'React Native Reanimated 3 & Gesture Handler',
            description:
              'Architect 120Hz physics-based fluid UI interactions using Reanimated 3 worklets, shared values, and pan gesture interpolations.',
            estimatedHours: 35,
            skills: ['Reanimated 3', 'Gesture Handler', 'UI Worklets', 'Micro-interactions'],
            summary:
              'Achieving buttery smooth 60fps and 120Hz ProMotion gesture interactions requires running animation frames directly on the native UI thread, bypassing JavaScript bridge communication completely. React Native Reanimated 3 uses JavaScript Worklets—small functions compiled to C++ runtimes—to evaluate spring dynamics and swipe interpolations with zero dropped frames.',
            keyTopics: [
              'Architecture of Reanimated worklets and the secondary UI JavaScript thread',
              'useSharedValue, useAnimatedStyle, and withSpring physics damping configs',
              'Gesture.Pan() chaining with onChange and onEnd velocity decels',
              'Shared element transitions between list view and milestone execution drawers',
            ],
            codeSnippet: {
              title: 'Fluid 120Hz Slide-Over Drawer with Reanimated 3 & Gestures',
              language: 'typescript',
              code: `import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

export function SlideOverDrawer({ isOpen, onClose, children }: any) {
  const translateX = useSharedValue(DRAWER_WIDTH);

  React.useEffect(() => {
    translateX.value = withSpring(isOpen ? 0 : DRAWER_WIDTH, {
      damping: 20,
      stiffness: 150,
      mass: 0.8,
    });
  }, [isOpen]);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      'worklet';
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      'worklet';
      if (event.translationX > DRAWER_WIDTH * 0.3 || event.velocityX > 500) {
        translateX.value = withSpring(DRAWER_WIDTH, { velocity: event.velocityX });
        runOnJS(onClose)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.drawer, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#0f172a',
    borderLeftWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 25,
  },
});`,
            },
            resources: [
              {
                title: 'React Native Reanimated 3 Official Docs',
                url: 'https://docs.swmansion.com/react-native-reanimated/',
                type: 'DOCS',
              },
              {
                title: 'React Native Gesture Handler v2 Gesture API',
                url: 'https://docs.swmansion.com/react-native-gesture-handler/',
                type: 'DOCS',
              },
              {
                title: 'Building 60FPS Fluid Gestures in Mobile Apps',
                url: 'https://blog.swmansion.com/',
                type: 'ARTICLE',
              },
            ],
            quiz: [
              {
                question: 'What is a Reanimated "worklet"?',
                options: [
                  'A JavaScript function flagged with "worklet" directive compiled to run synchronously on the native UI runtime',
                  'A web worker running on Node.js',
                  'A CSS stylesheet animation',
                  'A background audio player',
                ],
                correctIndex: 0,
              },
              {
                question: 'Why does animating standard React state cause dropped frames during complex swipes?',
                options: [
                  'State updates must cross the asynchronous bridge and wait for React reconcile cycle before native views update',
                  'Smartphones only support 10 frames per second',
                  'JSX cannot render on mobile screens',
                  'State is stored on cloud servers',
                ],
                correctIndex: 0,
              },
              {
                question: 'Which Reanimated function calls back to the JavaScript thread from an onEnd worklet handler?',
                options: ['runOnJS()', 'postMessage()', 'eval()', 'requestAnimationFrame()'],
                correctIndex: 0,
              },
            ],
            taskPrompt:
              'Implement an interactive slide-over drawer using Reanimated 3 and Gesture Handler that tracks finger position, supports fling-to-dismiss, and uses spring physics.',
          },
          {
            milestoneId: 'mob_m8',
            title: 'Native Modules (TurboModules & JSI)',
            description:
              'Author direct C++ / Swift / Kotlin native modules binding directly to the JavaScript runtime without bridge serialization.',
            estimatedHours: 35,
            skills: ['TurboModules', 'JSI', 'Swift', 'Kotlin', 'C++'],
            summary:
              'When high-throughput computation—such as image manipulation, audio DSP, or high-security cryptography—exceeds JavaScript speeds, mobile engineers build TurboModules. TurboModules compile against typed Codegen specs and hook directly into the JavaScript Interface (JSI), enabling JavaScript to hold direct C++ memory pointers to native host objects.',
            keyTopics: [
              'JSI (JavaScript Interface) architectural paradigms vs. legacy JSON bridge serialization',
              'TurboModule Codegen specifications using TypeScript or Flow interfaces',
              'Writing Swift and Objective-C++ implementations on iOS',
              'Writing Kotlin and modern Android NDK bindings on Android',
            ],
            codeSnippet: {
              title: 'Typed TurboModule TypeScript Specification',
              language: 'typescript',
              code: `import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // Synchronous JSI direct call returning native high-precision hardware timestamp
  getHighPrecisionTime(): number;

  // Cryptographic hardware hash generation
  sha256Digest(content: string): Promise<string>;

  // Native device thermal status (nominal, fair, serious, critical)
  getThermalState(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NexoraHardwareEngine');`,
            },
            resources: [
              {
                title: 'Creating a New Architecture TurboModule',
                url: 'https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules',
                type: 'DOCS',
              },
              {
                title: 'React Native Codegen Specification Guide',
                url: 'https://reactnative.dev/docs/the-new-architecture/what-is-codegen',
                type: 'DOCS',
              },
              {
                title: 'Understanding JSI and Direct C++ Binding Performance',
                url: 'https://formidable.com/blog/2019/jsi-cheatsheet/',
                type: 'ARTICLE',
              },
            ],
            quiz: [
              {
                question: 'What makes JSI (JavaScript Interface) calls orders of magnitude faster than the legacy bridge?',
                options: [
                  'JavaScript holds direct memory references to C++ HostObjects without stringifying JSON payloads across threads',
                  'It compiles everything into assembly language on the server',
                  'It runs only when connected to fast fiber internet',
                  'It skips type checking completely',
                ],
                correctIndex: 0,
              },
              {
                question: 'What is the role of Codegen in TurboModules?',
                options: [
                  'Generates typed C++ and Java/Objective-C boilerplate from TypeScript interface specs to enforce compile-time type safety',
                  'Generates app store marketing screenshots',
                  'Minifies CSS stylesheet files',
                  'Encrypts SQLite databases',
                ],
                correctIndex: 0,
              },
              {
                question: 'Which method retrieves an enforced TurboModule instance in React Native?',
                options: [
                  'TurboModuleRegistry.getEnforcing<Spec>("ModuleName")',
                  'document.getElementById("module")',
                  'window.requireNative("ModuleName")',
                  'process.env.NATIVE_MODULE',
                ],
                correctIndex: 0,
              },
            ],
            taskPrompt:
              'Write a typed TurboModule specification for an encryption module. Outline the corresponding Swift and Kotlin class headers implementing the JSI methods.',
          },
        ],
      },
      {
        phaseId: 'mob_p5',
        phaseTitle: 'Phase 5: Automated Testing, CI/CD & App Store Release',
        order: 5,
        milestones: [
          {
            milestoneId: 'mob_m9',
            title: 'End-to-End Testing with Maestro & Jest',
            description:
              'Implement automated end-to-end mobile user flow tests using Maestro UI automation, unit tests, and CI test matrices.',
            estimatedHours: 25,
            skills: ['Maestro UI', 'Jest', 'React Native Testing Library', 'E2E Testing'],
            summary:
              'Modern mobile teams maintain 99.9% crash-free sessions by gating releases with automated end-to-end user flows. Maestro has emerged as the industry standard for mobile UI testing—driving native iOS and Android apps with declarative YAML flows that handle animations, biometric simulations, and device permissions with zero flaky sleep timeouts.',
            keyTopics: [
              'Declarative UI testing with Maestro YAML flows across iOS Simulators and Android Emulators',
              'React Native Testing Library unit and component integration test standards',
              'Simulating deep links, network drops, and orientation changes in automated test runs',
              'Crashlytics telemetry and automated crash symbolication (dSYM / ProGuard mapping upload)',
            ],
            codeSnippet: {
              title: 'Maestro E2E Automated Verification Flow for Milestone Drawer',
              language: 'yaml',
              code: `appId: com.nexora.app
---
- launchApp
- assertVisible: "DAG Learning Sequence"

# Tap on first active milestone card
- tapOn: "React Native & Expo Architecture"
- assertVisible: "Milestone Execution Drawer"
- assertVisible: "Concept & Snippets"

# Verify tabs and code snippet copy
- tapOn: "Curated Resources"
- assertVisible: "Expo Router Official Documentation"

# Complete Mini Assessment
- tapOn: "Mini Assessment"
- assertVisible: "Knowledge Check"
- tapOn: "Fabric & TurboModules (JSI)"
- tapOn: "Submit Assessment"

# Validate status update and progress increment
- assertVisible: "Milestone Cleared"`,
            },
            resources: [
              {
                title: 'Maestro Mobile UI Testing Guide',
                url: 'https://maestro.mobile.dev/',
                type: 'DOCS',
              },
              {
                title: 'React Native Testing Library Best Practices',
                url: 'https://callstack.github.io/react-native-testing-library/',
                type: 'DOCS',
              },
              {
                title: 'Achieving 99.9% Crash-Free User Sessions in Mobile',
                url: 'https://firebase.google.com/products/crashlytics',
                type: 'ARTICLE',
              },
            ],
            quiz: [
              {
                question: 'Why is Maestro preferred over legacy Appium for mobile E2E automation?',
                options: [
                  'Maestro uses built-in smart waits for animations and network requests, eliminating flaky hardcoded sleep delays',
                  'Maestro only runs in the Google Chrome browser',
                  'Maestro requires rooting physical smartphones',
                  'Maestro does not support iOS devices',
                ],
                correctIndex: 0,
              },
              {
                question: 'What are dSYM files on iOS and ProGuard mappings on Android essential for in production?',
                options: [
                  'De-obfuscating and symbolicating crash stack traces into readable code files and line numbers',
                  'Decreasing the download size of the application',
                  'Translating strings into Spanish and German',
                  'Generating SVG vector graphics',
                ],
                correctIndex: 0,
              },
              {
                question: 'What is the recommended testing library for React Native component integration tests?',
                options: [
                  'React Native Testing Library (@testing-library/react-native)',
                  'Puppeteer',
                  'Selenium Web Driver',
                  'Mocha PhantomJS',
                ],
                correctIndex: 0,
              },
            ],
            taskPrompt:
              'Write a Maestro automation test file that launches the NEXORA mobile app, selects a milestone, inspects the drawer tabs, and validates the +50 XP telemetry grant.',
          },
          {
            milestoneId: 'mob_m10',
            title: 'EAS Build, Fastlane & App Store Distribution',
            description:
              'Configure cloud native build profiles, OTA updates, automated certificate provisioning, and Play Store / TestFlight pipelines.',
            estimatedHours: 30,
            skills: ['EAS Build', 'Fastlane', 'App Store Connect', 'Google Play Console', 'EAS Update'],
            summary:
              'Distributing production mobile software requires automated CI/CD pipelines that manage cryptographic signing identities (Apple Distribution Certificates, Provisioning Profiles, and Android Upload Keystores). With Expo Application Services (EAS) Build and Fastlane, engineers automate internal staging tracks, production releases, and Over-The-Air (OTA) runtime JavaScript patches.',
            keyTopics: [
              'EAS Build multi-environment configuration (eas.json for development, staging, production)',
              'Automated cryptographic signing with Match / Fastlane and Expo credentials manager',
              'OTA (Over-The-Air) update rollout strategies and channel management with EAS Update',
              'Apple App Store Review Guidelines and Google Play Data Safety declaration protocols',
            ],
            codeSnippet: {
              title: 'Production eas.json Build and Update Pipeline Configuration',
              language: 'json',
              code: `{
  "cli": {
    "version": ">= 10.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "android": { "buildType": "apk" }
    },
    "production": {
      "channel": "production",
      "autoIncrement": true,
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "enterpriseProvisioning": false
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-services-key.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "eng@nexora.io",
        "ascAppId": "1672390192"
      }
    }
  }
}`,
            },
            resources: [
              {
                title: 'EAS Build Configuration Guide (eas.json)',
                url: 'https://docs.expo.dev/build/eas-json/',
                type: 'DOCS',
              },
              {
                title: 'EAS Update: Over-The-Air (OTA) Deployment Protocol',
                url: 'https://docs.expo.dev/eas-update/introduction/',
                type: 'DOCS',
              },
              {
                title: 'Fastlane: Continuous Deployment for iOS and Android',
                url: 'https://fastlane.tools/',
                type: 'ARTICLE',
              },
            ],
            quiz: [
              {
                question: 'What can be updated instantly using EAS Update without submitting a new binary build to App Store review?',
                options: [
                  'JavaScript code, React components, and bundled asset files',
                  'New native C++ libraries and Android permissions in AndroidManifest.xml',
                  'Objective-C AppDelegate header files',
                  'Operating system iOS kernel version',
                ],
                correctIndex: 0,
              },
              {
                question: 'Why should Android production builds use the Android App Bundle (.aab) format instead of universal .apk?',
                options: [
                  'Google Play generates optimized device-specific APKs tailored to each user CPU architecture and screen density',
                  'App bundles bypass Google Play store fees',
                  'APKs cannot exceed 5 megabytes',
                  'AAB files do not require signing certificates',
                ],
                correctIndex: 0,
              },
              {
                question: 'Which tool securely syncs Apple Developer signing certificates across engineering teams using an encrypted Git repo?',
                options: ['Fastlane Match', 'Git LFS', 'npm install', 'Docker Desktop'],
                correctIndex: 0,
              },
            ],
            taskPrompt:
              'Configure an eas.json file with internal preview and production channels. Outline the GitHub Actions workflow that triggers an automated EAS build on tag release.',
          },
        ],
      },
    ],
  },

  fullstack: {
    role: 'Full Stack Developer',
    domain: 'Web Development',
    matchKeys: ['fullstack', 'full-stack', 'web', 'mern', 'react', 'node', 'frontend', 'backend'],
    description:
      'Master end-to-end full-stack engineering from modern Next.js/React architectures to distributed microservices, database tuning, and cloud deployments.',
    phases: [
      {
        phaseId: 'fs_p1',
        phaseTitle: 'Phase 1: Advanced Frontend & System Architecture',
        order: 1,
        milestones: [
          {
            milestoneId: 'fs_m1',
            title: 'Modern React Architecture & Component Patterns',
            description:
              'Master React 19 server components, concurrent mode, custom hooks, state machines, and compound component patterns.',
            estimatedHours: 25,
            skills: ['React 19', 'Server Components', 'Custom Hooks', 'Compound Components'],
            summary:
              'Modern enterprise frontends require deep comprehension of React 19 Server Components (RSC), Suspense streaming, and compound component architecture. RSC executes data fetching on the server, shipping zero client-side JavaScript for static subtree renders while maintaining seamless hydration for interactive components.',
            keyTopics: [
              'React Server Components vs. Client Hydration boundaries ("use client")',
              'Compound component architecture with React.Children and Context delegation',
              'Concurrent mode, useTransition, and non-blocking state updates',
              'Custom hook composition and deterministic cleanup protocols',
            ],
            codeSnippet: {
              title: 'Compound Component with Typed Context and Accessibility',
              language: 'typescript',
              code: `import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

export function Tabs({ defaultTab, children }: { defaultTab: string; children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="flex flex-col gap-4 w-full">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabTrigger({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabTrigger must be used inside Tabs');
  const isActive = ctx.activeTab === id;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => ctx.setActiveTab(id)}
      className={\`px-4 py-2 text-sm font-semibold rounded-lg transition-all \${
        isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
      }\`}
    >
      {children}
    </button>
  );
}`,
            },
            resources: [
              {
                title: 'React 19 Official Documentation & Architecture',
                url: 'https://react.dev/blog/2024/04/25/react-19',
                type: 'DOCS',
              },
              {
                title: 'Mastering Compound Components in React',
                url: 'https://kentcdodds.com/blog/compound-components-with-react-hooks',
                type: 'ARTICLE',
              },
              {
                title: 'Deep Dive: React Server Components Mental Model',
                url: 'https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md',
                type: 'DOCS',
              },
            ],
            quiz: [
              {
                question: 'What is the main bundle-size advantage of React Server Components (RSC)?',
                options: [
                  'Server Component dependencies never get bundled into client-side JavaScript, reducing browser download size to zero for those components',
                  'They compress HTML files into ZIP archives',
                  'They replace CSS with SVG images',
                  'They force clients to download WebAssembly runtimes',
                ],
                correctIndex: 0,
              },
              {
                question: 'Which hook marks state transitions as non-blocking to prevent UI freezes during heavy re-renders?',
                options: ['useTransition()', 'useEffect()', 'useLayoutEffect()', 'useRef()'],
                correctIndex: 0,
              },
              {
                question: 'What pattern allows subcomponents like Tabs.Trigger and Tabs.Content to share state implicitly?',
                options: [
                  'Compound Component pattern backed by React Context',
                  'Global window variables',
                  'Writing to localStorage on every keypress',
                  'Calling eval() on props',
                ],
                correctIndex: 0,
              },
            ],
            taskPrompt:
              'Build a reusable Tabs compound component supporting accessible keyboard navigation (arrow keys), active indicator pill animation, and lazy mounting.',
          },
          {
            milestoneId: 'fs_m2',
            title: 'Design Systems & Responsive Layouts',
            description:
              'Architect production-grade CSS design systems using Tailwind CSS, CSS Variables, glassmorphism, and responsive breakpoints.',
            estimatedHours: 20,
            skills: ['Tailwind CSS', 'CSS Architecture', 'Responsive Design', 'Accessibility'],
            summary:
              'Scalable design systems rely on semantic token abstractions (colors, typography, spacing, elevations) defined as CSS variables that adapt dynamically across dark/light themes. Pairing utility-first CSS with strict WCAG 2.1 AA accessibility guidelines produces visually breathtaking interfaces that remain accessible to all users.',
            keyTopics: [
              'Semantic CSS design tokens, HSL color ramps, and dynamic CSS custom properties',
              'Tailwind responsive utility layering (sm, md, lg, xl, 2xl) and container queries',
              'Glassmorphism techniques using backdrop-filter: blur() with subtle alpha borders',
              'WCAG 2.1 AA color contrast compliance and screen reader aria semantics',
            ],
            codeSnippet: {
              title: 'Ultra-Modern Glassmorphic Card Token System',
              language: 'css',
              code: `:root {
  --bg-primary: #090d16;
  --bg-card: rgba(15, 23, 42, 0.75);
  --border-glass: rgba(99, 102, 241, 0.18);
  --glow-accent: rgba(99, 102, 241, 0.25);
  --text-primary: #f8fafc;
  --text-muted: #94a3b8;
}

.glass-panel {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-glass);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.glass-panel:hover {
  border-color: rgba(99, 102, 241, 0.35);
  box-shadow: 0 12px 40px 0 var(--glow-accent);
}`,
            },
            resources: [
              {
                title: 'Tailwind CSS Official Design System Guide',
                url: 'https://tailwindcss.com/docs',
                type: 'DOCS',
              },
              {
                title: 'W3C Web Content Accessibility Guidelines (WCAG) 2.1',
                url: 'https://www.w3.org/TR/WCAG21/',
                type: 'DOCS',
              },
              {
                title: 'Modern CSS Fluid Typography & Container Queries',
                url: 'https://web.dev/learn/design/',
                type: 'ARTICLE',
              },
            ],
            quiz: [
              {
                question: 'Which CSS property creates frosted-glass translucent blur effects on underlying content?',
                options: ['backdrop-filter: blur()', 'filter: invert()', 'opacity: 0.5', 'box-shadow: inset'],
                correctIndex: 0,
              },
              {
                question: 'What is the minimum WCAG 2.1 AA contrast ratio required for normal body text against background?',
                options: ['4.5:1', '2:1', '10:1', '1:1'],
                correctIndex: 0,
              },
              {
                question: 'Why are CSS custom properties (--variable) preferred over SASS variables for theming?',
                options: [
                  'CSS custom properties resolve at runtime and can be overridden dynamically by theme classes without recompiling',
                  'CSS variables can only store numbers',
                  'SASS variables are faster in Chrome',
                  'CSS variables run in Node.js',
                ],
                correctIndex: 0,
              },
            ],
            taskPrompt:
              'Create a dark/light responsive layout with a glassmorphic sidebar and data cards utilizing semantic CSS variables and responsive grid auto-fit columns.',
          },
        ],
      },
    ],
  },
};

// --- Adaptive Seed Generator for Arbitrary Roles -------------------------------

export function resolveSeedForRole(role: string, domain: string): ISeedRoadmap {
  const query = `${role} ${domain}`.toLowerCase();

  for (const key of Object.keys(SEED_ROADMAPS)) {
    const seed = SEED_ROADMAPS[key];
    const match = seed.matchKeys.some((k) => {
      if (k.length <= 3) {
        return new RegExp(`\\b${k}\\b`, 'i').test(query);
      }
      return query.includes(k);
    });
    if (match) {
      return seed;
    }
  }

  // Fallback to Mobile App Developer curriculum as the primary anchor
  if (SEED_ROADMAPS.mobile) {
    return SEED_ROADMAPS.mobile;
  }

  // General Adaptive Fallback
  const resolvedRole = role.trim() || domain.trim() || 'Software Engineer';
  const resolvedDomain = domain.trim() || 'Engineering';

  return {
    role: resolvedRole,
    domain: resolvedDomain,
    matchKeys: [resolvedRole.toLowerCase()],
    description: `A custom-tailored DAG curriculum for mastering the core and advanced competencies expected of a modern ${resolvedRole}.`,
    phases: [
      {
        phaseId: 'adapt_p1',
        phaseTitle: `Phase 1: Foundations & Core Architecture for ${resolvedRole}`,
        order: 1,
        milestones: [
          {
            milestoneId: 'adapt_m1',
            title: `Foundations & Architectural Patterns`,
            description: 'Core concepts, syntax, architectural fundamentals, and clean code principles.',
            estimatedHours: 25,
            skills: ['Foundations', 'Git Collaboration', 'Clean Architecture'],
            summary: `Core principles and architecture standards governing high-velocity development for ${resolvedRole}. Master code organization, typed contracts, and testing disciplines.`,
            keyTopics: [
              `Core syntax, execution models, and runtime primitives in ${resolvedRole}`,
              'Separation of concerns, dependency injection, and clean architecture boundaries',
              'Git trunk-based development and pull request review standards',
            ],
            codeSnippet: {
              title: 'Clean Architecture Domain Entity & Service Contract',
              language: 'typescript',
              code: `export interface DomainEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseService<T extends DomainEntity> {
  abstract findById(id: string): Promise<T | null>;
  abstract save(entity: T): Promise<T>;
}`,
            },
            resources: [
              { title: `${resolvedRole} Overview & Standards`, url: 'https://roadmap.sh', type: 'DOCS' },
              { title: 'Clean Architecture: A Craftsman\'s Guide', url: 'https://martinfowler.com/architecture/', type: 'ARTICLE' },
            ],
            quiz: [
              {
                question: 'What is the primary objective of Clean Architecture in engineering systems?',
                options: [
                  'Decouple core business rules from external frameworks, databases, and UI dependencies',
                  'Maximize the lines of code in each file',
                  'Avoid writing any automated tests',
                  'Force all code to run synchronously on a single thread',
                ],
                correctIndex: 0,
              },
              {
                question: 'Why are typed contracts (interfaces) critical in large-scale codebases?',
                options: [
                  'They catch type mismatch defects at compile-time and serve as self-documenting code contracts',
                  'They make the JavaScript file size twice as big',
                  'They prevent code from running on Linux servers',
                  'They disable garbage collection',
                ],
                correctIndex: 0,
              },
              {
                question: 'What is the main practice of trunk-based development?',
                options: [
                  'Developers merge small, frequent updates directly into a core trunk branch rather than maintaining long-lived feature branches',
                  'Never using Git commits',
                  'Deploying to production only once every 3 years',
                  'Deleting the repository every week',
                ],
                correctIndex: 0,
              },
            ],
            taskPrompt: `Implement a clean architectural module for ${resolvedRole} featuring domain entities, repository interfaces, and unit tests verifying boundary isolation.`,
          },
        ],
      },
    ],
  };
}
