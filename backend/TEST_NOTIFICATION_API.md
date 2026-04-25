# 🧪 Test Notification API Documentation

## Overview

Two new test endpoints have been added to send push notifications to specific device tokens for testing and debugging purposes.

**Base URL**: `http://localhost:5000/api/notifications`

**Authentication**: Required (Bearer token)

---

## 1. Send Single Notification

### Endpoint

```
POST /api/notifications/test/send
```

### Authentication

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Request Body

```json
{
  "deviceToken": "eC...xyz123...",
  "title": "Test Notification",
  "body": "This is a test notification from backend",
  "data": {
    "activityId": "test-activity-123",
    "type": "test"
  }
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `deviceToken` | string | Yes | FCM device token (get from app logs or user device) |
| `title` | string | Yes | Notification title (shown in banner) |
| `body` | string | Yes | Notification body/message |
| `data` | object | No | Custom JSON data (not shown to user, actionable) |

### Response - Success (200)

```json
{
  "success": true,
  "message": "Notification sent successfully",
  "messageId": "0:1234567890123456%abcdef1234567890abcdef123",
  "details": {
    "deviceToken": "eC...xyz123...",
    "title": "Test Notification",
    "body": "This is a test notification from backend",
    "data": {
      "activityId": "test-activity-123",
      "type": "test"
    }
  }
}
```

### Response - Errors

**Invalid token format (400)**
```json
{
  "success": false,
  "error": "Invalid device token format",
  "details": "Malformed registration token provided"
}
```

**Token not registered/expired (404)**
```json
{
  "success": false,
  "error": "Device token not registered or expired",
  "details": "Registration token is invalid"
}
```

**Missing required field (400)**
```json
{
  "success": false,
  "error": "deviceToken is required."
}
```

**Unauthorized (401)**
```json
{
  "success": false,
  "error": "Unauthorized."
}
```

---

## 2. Send Bulk Notification

### Endpoint

```
POST /api/notifications/test/send-bulk
```

### Authentication

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Request Body

```json
{
  "deviceTokens": [
    "eC...token1...",
    "eC...token2...",
    "eC...token3..."
  ],
  "title": "Bulk Test Notification",
  "body": "Sending to multiple devices",
  "data": {
    "activityId": "bulk-test-456",
    "type": "bulk_test"
  }
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `deviceTokens` | string[] | Yes | Array of FCM device tokens (min 1) |
| `title` | string | Yes | Notification title |
| `body` | string | Yes | Notification body/message |
| `data` | object | No | Custom JSON data |

### Response - Success (200)

```json
{
  "success": true,
  "message": "Bulk notification sent",
  "stats": {
    "total": 3,
    "successful": 2,
    "failed": 1
  },
  "failureReasons": [
    {
      "token": "eC...token3...",
      "error": "Registration token is invalid"
    }
  ]
}
```

### Response - Errors

**Empty token array (400)**
```json
{
  "success": false,
  "error": "deviceTokens array is required and must not be empty."
}
```

---

## 📝 Usage Examples

### cURL

#### Single Notification

```bash
curl -X POST http://localhost:5000/api/notifications/test/send \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "eC_example_token_xyz",
    "title": "Activity Started",
    "body": "Physical Training has started now!",
    "data": {
      "activityId": "activity-123",
      "type": "activity_status_change"
    }
  }'
```

#### Bulk Notification

```bash
curl -X POST http://localhost:5000/api/notifications/test/send-bulk \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceTokens": [
      "eC_token_1",
      "eC_token_2",
      "eC_token_3"
    ],
    "title": "New Activity",
    "body": "Teaching Session has been created",
    "data": {
      "activityId": "activity-456"
    }
  }'
```

### JavaScript/Node.js

```javascript
const token = "your_jwt_token_here";
const deviceToken = "eC_example_token_xyz";

// Single notification
const response = await fetch("http://localhost:5000/api/notifications/test/send", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    deviceToken: deviceToken,
    title: "Test Notification",
    body: "This is a test",
    data: {
      activityId: "test-123",
    },
  }),
});

const result = await response.json();
console.log(result);
```

### Python

```python
import requests

token = "your_jwt_token_here"
device_token = "eC_example_token_xyz"

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
}

payload = {
    "deviceToken": device_token,
    "title": "Test Notification",
    "body": "This is a test from Python",
    "data": {
        "activityId": "test-789",
    },
}

response = requests.post(
    "http://localhost:5000/api/notifications/test/send",
    headers=headers,
    json=payload,
)

print(response.json())
```

### Postman

1. **Create Request**
   - Method: POST
   - URL: `http://localhost:5000/api/notifications/test/send`

2. **Authorization Tab**
   - Type: Bearer Token
   - Token: `your_jwt_token_here`

3. **Headers Tab**
   - Content-Type: application/json

4. **Body Tab** (JSON)
   ```json
   {
     "deviceToken": "eC_example_token_xyz",
     "title": "Test Notification",
     "body": "Sending from Postman",
     "data": {
       "activityId": "test-123"
     }
   }
   ```

5. Click **Send**

---

## 🧪 Testing Workflow

### Step 1: Get Your Device Token

The app logs the FCM token when it's first obtained. On your mobile device:

**Android Logcat:**
```
adb logcat | grep "FCM token obtained"
```

Output will show:
```
✅ FCM token obtained: eC_example_token_xyz...
```

Or check the app console for logs.

### Step 2: Get Your JWT Token

Login to the app and get the access token from auth store. You can also get it via:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response includes `accessToken`.

### Step 3: Send Test Notification

Use either cURL, Postman, or your preferred HTTP client:

```bash
curl -X POST http://localhost:5000/api/notifications/test/send \
  -H "Authorization: Bearer <your_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "<your_device_token>",
    "title": "🧪 Test",
    "body": "It works!",
    "data": {
      "activityId": "test-123"
    }
  }'
```

### Step 4: Verify on Device

- **Foreground** (app open): Notification banner appears with sound/vibration
- **Background** (app minimized): Notification appears in notification center
- **Killed** (app closed): Tap notification, app launches and navigates to activity

---

## 🔍 Troubleshooting

### Token Not Working

**Error**: "Registration token is invalid"

**Solutions**:
- Token may have expired - get a fresh one from the device
- Token may be from a different Firebase project
- App may not have completed FCM setup (check logs)
- Device may have uninstalled/reinstalled the app

### Unauthorized

**Error**: "Unauthorized."

**Solutions**:
- JWT token is invalid or expired
- Prefix with "Bearer " (space required)
- Make sure you're logged in to the app first

### No Notification Received

**Possible causes**:
- Device doesn't have internet connection
- FCM permissions not granted on device
- Notification channel not created (Android)
- Token registered but expired
- Firewall blocking FCM

**Debug**:
1. Check app logs for token registration
2. Verify `setupFCM()` completed successfully
3. Check Firebase Console for message delivery status
4. Test with a real device (emulators may not receive FCM)

---

## 📊 Firebase Console Monitoring

You can also monitor notifications in Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Cloud Messaging**
4. View:
   - Total messages sent
   - Delivery rates
   - Error patterns

---

## ⚠️ Security Notes

- These endpoints require authentication (JWT token)
- Only authenticated users can send test notifications
- In production, consider restricting to admin users only
- Never expose device tokens in logs or error messages in production
- Firebase service account credentials should be in env variables

---

## 🚀 Next Steps

1. **Get device token from app**: Run app and check logs
2. **Get JWT token**: Login or use the auth endpoint
3. **Send test notification**: Use any of the examples above
4. **Verify receipt**: Check mobile device
5. **Test all app states**: Foreground, background, killed

---

## Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/notifications/test/send` | POST | Send to single device |
| `/api/notifications/test/send-bulk` | POST | Send to multiple devices |
| `/api/notifications` | GET | Get notification history |
| `/api/notifications/register-token` | POST | Register FCM token |

---

## Support

For issues or questions:
1. Check server logs: `npm run dev`
2. Check mobile app logs
3. Verify Firebase credentials are loaded
4. Test with a real device, not emulator
5. Check Firebase Console for message delivery status
