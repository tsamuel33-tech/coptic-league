# Mobile App Development Guide

## Three Options for iPhone Access

### Option 1: PWA (Progressive Web App) - EASIEST ⭐

**Best for:** Quick deployment, no App Store needed

✅ **Pros:**
- Works on iPhone immediately
- No App Store approval
- Shares code with web app
- Can be installed on home screen
- Push notifications possible

❌ **Cons:**
- Some native features limited
- Requires Safari on iOS

**Time to deploy: 1 hour**

---

### Option 2: React Native - RECOMMENDED 🚀

**Best for:** Full native experience, cross-platform

✅ **Pros:**
- True native app
- Works on iPhone AND Android
- Reuse React knowledge
- Good performance
- Large community

❌ **Cons:**
- Requires Mac for iOS development
- $99/year Apple Developer account for App Store
- More complex than PWA

**Time to build: 1-2 weeks**

---

### Option 3: Native Swift/SwiftUI - MOST POWERFUL 💪

**Best for:** Best performance, iOS-only

✅ **Pros:**
- Best iOS performance
- Full access to iOS features
- Native look and feel

❌ **Cons:**
- Only works on iOS (not Android)
- Requires learning Swift
- Requires Mac
- Most time-consuming

**Time to build: 2-4 weeks**

---

## EASIEST: Convert to PWA (30 Minutes!)

Let me make your React app work on iPhone instantly:

### Step 1: Install PWA Plugin

```bash
cd frontend
npm install vite-plugin-pwa workbox-window -D
```

### Step 2: Update vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'The Coptic League',
        short_name: 'Coptic League',
        description: 'Basketball League Management System',
        theme_color: '#2c5282',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/icon-96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/icon-128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '/icon-144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/icon-152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api-url\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

### Step 3: Create App Icons

Create icons in `frontend/public/`:
- icon-72.png
- icon-96.png
- icon-128.png
- icon-144.png
- icon-152.png
- icon-192.png
- icon-384.png
- icon-512.png
- apple-touch-icon.png

Use a tool like https://realfavicongenerator.net/ to generate all sizes.

### Step 4: Test PWA

```bash
npm run build
npm run preview
```

Open on your iPhone:
1. Visit your deployed URL in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"
5. Your app now appears on the home screen! 📱

**Done! Your app now works on iPhone like a native app!**

---

## RECOMMENDED: React Native App

### Initial Setup

```bash
# Install React Native CLI
npm install -g react-native-cli

# Create new project
npx react-native init CopticLeagueApp
cd CopticLeagueApp

# Install navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# Install utilities
npm install axios @react-native-async-storage/async-storage
npm install react-native-vector-icons

# iOS setup (on Mac)
cd ios && pod install && cd ..
```

### Project Structure

```
CopticLeagueApp/
├── src/
│   ├── api/
│   │   └── client.js          # API calls
│   ├── components/
│   │   ├── LeagueCard.js
│   │   ├── TeamCard.js
│   │   └── GameCard.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── LeaguesScreen.js
│   │   ├── TeamsScreen.js
│   │   ├── ScheduleScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── context/
│   │   └── AuthContext.js
│   └── utils/
│       └── storage.js
├── App.js
└── package.json
```

### Sample Code

**src/api/client.js:**
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://coptic-league.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/auth/me'),
};

export const leagueAPI = {
  getAll: () => apiClient.get('/leagues'),
  getOne: (id) => apiClient.get(`/leagues/${id}`),
};

export const teamAPI = {
  getAll: () => apiClient.get('/teams'),
  getOne: (id) => apiClient.get(`/teams/${id}`),
};

export const gameAPI = {
  getAll: () => apiClient.get('/games'),
  getOne: (id) => apiClient.get(`/games/${id}`),
};

export default apiClient;
```

**src/screens/LeaguesScreen.js:**
```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { leagueAPI } from '../api/client';

const LeaguesScreen = ({ navigation }) => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const response = await leagueAPI.getAll();
      setLeagues(response.data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLeague = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('LeagueDetail', { id: item._id })}
    >
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>{item.division}</Text>
      <Text style={styles.info}>Season: {item.season}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2c5282" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={leagues}
        renderItem={renderLeague}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5282',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#bee3f8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#2c5282',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default LeaguesScreen;
```

### Run React Native App

```bash
# iOS (requires Mac)
npx react-native run-ios

# Android
npx react-native run-android
```

---

## Native iOS Swift App

**src/API/NetworkManager.swift:**
```swift
import Foundation

class NetworkManager {
    static let shared = NetworkManager()
    private let baseURL = "https://coptic-league.onrender.com/api"

    private init() {}

    func login(email: String, password: String, completion: @escaping (Result<User, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/auth/login") else {
            completion(.failure(NetworkError.invalidURL))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = ["email": email, "password": password]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NetworkError.noData))
                return
            }

            do {
                let user = try JSONDecoder().decode(User.self, from: data)
                completion(.success(user))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    func fetchLeagues(completion: @escaping (Result<[League], Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/leagues") else {
            completion(.failure(NetworkError.invalidURL))
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NetworkError.noData))
                return
            }

            do {
                let leagues = try JSONDecoder().decode([League].self, from: data)
                completion(.success(leagues))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
}

enum NetworkError: Error {
    case invalidURL
    case noData
}
```

---

## Which Option Should You Choose?

### Choose PWA if:
- ✅ You want the fastest solution
- ✅ You don't need App Store presence
- ✅ Your users are okay with "Add to Home Screen"
- ✅ You want to save $99/year

### Choose React Native if:
- ✅ You want a real App Store app
- ✅ You need both iOS and Android
- ✅ You know React (reuse skills)
- ✅ You have a Mac for development

### Choose Native Swift if:
- ✅ iOS-only is fine
- ✅ You want absolute best performance
- ✅ You want to learn iOS development
- ✅ You have time for a longer project

---

## My Recommendation for You

Based on your requirements:

**1. Start with PWA (Today)**
- Get your app on iPhone immediately
- Test with real users
- No cost, no App Store hassle

**2. Build React Native Later (If Needed)**
- If users want App Store presence
- If you need more native features
- Can reuse most of your React code

**3. Use MongoDB Atlas + Render**
- Both free
- Works perfectly with mobile apps
- Scales as you grow

---

## Want Me to Build the Mobile App?

I can create:

1. ✅ **PWA version** (30 minutes)
2. ✅ **React Native starter** (2 hours)
3. ✅ **Full React Native app** (1 day)

Just let me know which option you prefer!

---

## Testing on iPhone

**For PWA:**
1. Deploy to Render
2. Visit URL in Safari on iPhone
3. Add to Home Screen
4. Done!

**For React Native:**
1. Use Xcode Simulator
2. Or connect physical iPhone
3. Run: `npx react-native run-ios`

**Remote Testing (No Mac needed):**
- Use Expo Go app
- Scan QR code
- Test on any iPhone

---

## Questions?

- Need help setting up?
- Want me to convert to PWA?
- Want a React Native version?
- Need iOS Swift code?

Let me know and I'll help! 🚀
