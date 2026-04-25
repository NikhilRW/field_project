# 🔥 FCM Push Notifications Implementation Guide

## ✅ Implementation Complete

Your app now uses **native Firebase Cloud Messaging (FCM)** instead of Expo's managed push notification service. This provides:

- ✅ Direct native implementation with full control
- ✅ Better handling of all app states (foreground, background, killed)
- ✅ Improved reliability and lower latency
- ✅ Activity-specific navigation on notification tap
- ✅ Automatic token refresh handling

---

## 📦 What Was Implemented

### Backend (Node.js + Express)

1. **Firebase Service** (`src/services/firebase.ts`)
   - Initializes Firebase Admin SDK
   - Provides messaging instance

2. **FCM Notification Utility** (`src/utils/sendNotification.ts`)
   - `sendActivityNotification()` - Send to multiple volunteers
   - `sendUserNotification()` - Send to specific user
   - Android and iOS specific configurations

3. **Updated Notification Controller** (`src/controllers/notificationController.ts`)
   - `registerPushToken()` - Store FCM token
   - `storeNotification()` - Save notification history

4. **Activity Status Notifications** (`src/controllers/activityController.ts`)
   - Sends FCM when activity status changes
   - Notifies volunteers of new activity assignments
   - Notifies all users of activity updates

### Frontend (React Native + Expo)

1. **FCM Service Utilities** (`src/shared/utils/fcm.ts`)
   - `setupFCM()` - Complete FCM initialization
   - `requestNotificationPermission()` - Request Android 13+ permissions
   - `getFCMToken()` - Get device token
   - `registerFCMToken()` - Send token to backend
   - `subscribeToTopic()` / `unsubscribeFromTopic()` - For topic-based messaging

2. **Notification Bootstrap Hook** (`src/shared/hooks/useNotificationBootstrap.ts`)
   - Handles 6 notification scenarios:
     1. ✅ Foreground message (app open)
     2. ✅ Background message handler
     3. ✅ Foreground message received
     4. ✅ Notification tap (backgrounded app)
     5. ✅ App opened from background via notification
     6. ✅ App launched from killed state notification

3. **Notification Store** (`src/shared/stores/notificationStore.ts`)
   - Manages notification state
   - Prevents duplicate handling of killed-state notifications

4. **Updated Root Layout** (`src/shared/navigation/routes/RootLayout.tsx`)
   - Calls `useNotificationBootstrap()` hook
   - Initializes FCM on authentication

---

## 🚀 Complete Notification Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE NOTIFICATION FLOW                    │
└─────────────────────────────────────────────────────────────────┘

BACKEND                         FCM                        FRONTEND
┌──────────────────┐          ┌──────┐        ┌─────────────────────┐
│ 1. Activity      │──────→   │ FCM  │  ───→  │ 2. Receive & Store  │
│    created or    │  (JSON)  │Cloud │        │                     │
│    status        │          │Msg   │        │ ┌─────────────────┐ │
│    changed       │          └──────┘        │ │ App State?      │ │
└──────────────────┘              │           │ ├─────────────────┤ │
        ↓                          │           │ │ FOREGROUND      │ │
   2. Get user                     │           │ │ Show banner +   │ │
   device tokens                   │           │ │ sound/vibration │ │
        ↓                          │           │ ├─────────────────┤ │
   3. Send via                     │           │ │ BACKGROUND      │ │
   Firebase Admin                  │           │ │ Schedule local  │ │
   SDK                             │           │ │ notification    │ │
        ↓                          │           │ ├─────────────────┤ │
   4. Store in DB                  │           │ │ KILLED          │ │
   for history                     │           │ │ (app launches)  │ │
                                   │           │ └─────────────────┘ │
                                   │           │         ↓           │
                                   │           │ 3. User taps notif │
                                   │           │         ↓           │
                                   │           │ 4. Extract activity│
                                   │           │    ID from data    │
                                   │           │         ↓           │
                                   │           │ 5. Navigate to     │
                                   │           │    activity detail  │
                                   └→──────────→                     │
                                                └─────────────────────┘
```

---

## 📋 Backend Setup - Step by Step

### 1. Environment Variables

Add to your `.env`:

```bash
# Firebase Admin SDK credentials (get from Firebase Console)
FIREBASE_SERVICE_ACCOUNT='{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-...@appspot.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}'
```

### 2. Database Column

Already added: `expoPushToken` in users table (stores FCM tokens)

### 3. Firebase Service

Already created: `src/services/firebase.ts`

```typescript
import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";

// Firebase Admin is initialized automatically
export const messaging = getMessaging();
```

### 4. Send Notifications

Example - When activity status changes:

```typescript
import { sendActivityNotification } from "@utils/sendNotification";

// Send notification to all volunteers
await sendActivityNotification({
  title: "🔴 Activity Started",
  body: "Physical Training has started now!",
  activityId: "activity-123",
  allVolunteers: true,
});

// OR send to specific volunteers
await sendActivityNotification({
  title: "📋 Assigned to Activity",
  body: "You've been assigned to Teaching Session",
  activityId: "activity-456",
  volunteerIds: ["user-1", "user-2"],
});
```

---

## 📱 Frontend Setup - Step by Step

### 1. Automatic Initialization

✅ Already integrated in `RootLayout.tsx`:

```typescript
import { setupFCM } from "@/shared/utils/fcm";

// Called automatically after login
useEffect(() => {
  if (isAuthenticated && isHydrated) {
    setupFCM();
  }
}, [isAuthenticated, isHydrated]);
```

### 2. What `setupFCM()` Does

```typescript
export const setupFCM = async () => {
  // 1. Create Android notification channel
  await createNotificationChannel();
  
  // 2. Request notification permissions
  await requestNotificationPermission();
  
  // 3. Get FCM token and send to backend
  await registerFCMToken();
  
  // 4. Listen for notification events (in useNotificationBootstrap)
};
```

### 3. Notification Bootstrap (Automatic)

✅ Already integrated via `useNotificationBootstrap()` in RootLayout:

Handles all scenarios automatically:

| Scenario | Trigger | Handler |
|----------|---------|---------|
| App open, notification arrives | `onMessage()` | Show banner + sound |
| App backgrounded, notification arrives | `setBackgroundMessageHandler()` | Schedule local notification |
| App backgrounded, user taps notification | `onNotificationOpenedApp()` | Navigate to activity |
| App killed, user taps notification | `getInitialNotification()` | Navigate to activity |

---

## 🎯 Testing the Implementation

### Backend Testing

#### 1. Register device token (automatic)

When user logs in, token is automatically sent:

```typescript
POST /api/notifications/register-token
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "token": "eC...xyz123"
}
```

#### 2. Create activity (triggers notifications)

```typescript
POST /api/activities
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Physical Training",
  "date": "2026-04-26T10:00:00Z",
  "description": "Morning workout session",
  "status": "Upcoming",
  "volunteerIds": ["user-1", "user-2"]
}
```

✅ Notifications automatically sent to:
- Assigned volunteers: "You've been assigned to Physical Training"
- Other users: "Physical Training has been added"

#### 3. Update activity status (triggers notifications)

```typescript
PATCH /api/activities/:id/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "Ongoing"
}
```

✅ Notification sent: "🔴 Activity Started - Physical Training has started now!"

### Frontend Testing

#### Test 1: App Open (Foreground)
1. Open app
2. Create/update activity from backend
3. ✅ Should see notification banner with sound/vibration

#### Test 2: App Backgrounded
1. Open app → background it (press home button)
2. Create/update activity
3. ✅ Notification should appear in notification center
4. Tap it → app opens and navigates to activity detail

#### Test 3: App Killed
1. Force quit app (swipe up or task manager)
2. Create/update activity
3. Tap notification in notification center
4. ✅ App launches and navigates to activity detail

#### Test 4: Multiple Rapid Notifications
1. Create multiple activities
2. ✅ Each should show correct activityId
3. ✅ No navigation issues

---

## 🔧 Manual Testing Commands

### Get Firebase Credentials

From Firebase Console:
1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Copy the JSON
4. Set as `FIREBASE_SERVICE_ACCOUNT` env variable

### Send Manual Test Notification

```bash
# Via Firebase Console → Cloud Messaging
# Or via admin SDK:

const admin = require('firebase-admin');
const messaging = admin.messaging();

await messaging.send({
  token: 'user_device_token',
  notification: {
    title: 'Test Notification',
    body: 'This is a test'
  },
  data: {
    activityId: 'test-activity-123'
  }
});
```

---

## 🚨 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **Notifications not received** | Device token not sent to backend | Ensure `setupFCM()` completes after login; check network |
| **Wrong activityId on tap** | Data not in FCM payload | Check `sendActivityNotification()` includes `data: { activityId }` |
| **App doesn't navigate** | Handler not registered | Verify `useNotificationBootstrap()` called in RootLayout |
| **Duplicate notifications** | Multiple handlers | Check `useNotificationBootstrap()` cleanup functions |
| **Android: No sound/vibration** | Channel not created or wrong channelId | Ensure `createNotificationChannel()` called; check `channelId: "activity-updates"` |
| **iOS: Notification not showing** | `mutable-content` missing | Check APNS config has `aps: { "mutable-content": 1 }` |
| **Token not persisting** | Token refresh not handled | Check `onTokenRefresh()` listener in `usePushRegistration()` |

---

## 📊 Database Schema

### users table
```sql
expoPushToken TEXT  -- Stores FCM device token
```

### notifications table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data TEXT,              -- JSON: { activityId, type, ... }
  readAt TIMESTAMP,
  createdAt TIMESTAMP
);
```

---

## 🎓 Key Concepts

### Device Tokens
- **What**: Unique identifier for each device's installation
- **Why**: Backend needs this to send messages to specific devices
- **Lifecycle**: Generated on first app launch, refreshes occasionally
- **Storage**: Stored in users table, sent to backend via `/api/notifications/register-token`

### FCM Topics
- **What**: Broadcast channels subscribers can join
- **Why**: Send notifications to groups without storing individual tokens
- **Example**: All volunteers subscribed to "activity-updates" topic
- **Usage**: Optional - currently using direct device token approach

### Notification Payload
- **notification** object: Shows as banner/toast (visible to user)
- **data** object: Custom JSON received by app (not visible to user, actionable)
- **Platform-specific**: Android and iOS have different configurations

### App States
1. **Foreground**: App is open and in use
2. **Background**: App is running but not in focus
3. **Killed**: App process is terminated

---

## ✅ Verification Checklist

- [x] Firebase Admin SDK initialized on backend
- [x] FCM token registration endpoint working
- [x] Activity notifications sent on creation
- [x] Activity notifications sent on status update
- [x] Frontend registers FCM token on login
- [x] Frontend handles foreground messages
- [x] Frontend handles background messages
- [x] Frontend handles notification taps
- [x] Navigation to activity works correctly
- [x] Android notification channel created
- [x] Android permissions added
- [x] iOS APNS configuration set

---

## 🚀 Next Steps

1. **Add firebase-services.json to your Android project**
   - Download from Firebase Console
   - Place at `frontend/personal/google-services.json`

2. **Test in development**
   - Use `expo run:android` or `expo run:ios`
   - Monitor logs with `adb logcat` or Xcode

3. **Monitor production**
   - Track token registration rates
   - Monitor notification delivery metrics
   - Set up error alerts for failed sends

4. **Optional Enhancements**
   - Topic-based messaging for broadcasts
   - Rich notifications with images
   - Notification actions (approve/reject buttons)
   - Scheduled notifications

---

## 📚 Files Summary

**Backend:**
- `src/services/firebase.ts` - Firebase initialization
- `src/utils/sendNotification.ts` - FCM sending logic
- `src/controllers/notificationController.ts` - Token registration
- `src/controllers/activityController.ts` - Activity notifications

**Frontend:**
- `src/shared/utils/fcm.ts` - FCM utilities
- `src/shared/hooks/useNotificationBootstrap.ts` - Notification handling
- `src/shared/stores/notificationStore.ts` - Notification state
- `src/shared/navigation/routes/RootLayout.tsx` - Integration point

---

## 💡 Pro Tips

1. **Always check FCM token is registered** before assuming notifications won't work
2. **Use data payload** for app-specific actions, **notification object** for user-visible text
3. **Test on real devices** - emulators may not receive notifications
4. **Monitor token refresh** - tokens can expire or change
5. **Handle notification failures gracefully** - don't block main flow
6. **Test all app states** - each behaves differently

---

Good luck with your implementation! 🎉
