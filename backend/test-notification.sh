#!/usr/bin/env bash

# 🧪 Test Notification API - Quick Reference

# ═══════════════════════════════════════════════════════════════════════════
# STEP 1: Get your JWT token (after login)
# ═══════════════════════════════════════════════════════════════════════════

export JWT_TOKEN="your_access_token_here"

# ═══════════════════════════════════════════════════════════════════════════
# STEP 2: Get your device token from app logs
# ═══════════════════════════════════════════════════════════════════════════

# Run app and check console for:
# ✅ FCM token obtained: eC...xyz

export DEVICE_TOKEN="your_device_token_here"

# ═══════════════════════════════════════════════════════════════════════════
# STEP 3: Send a test notification
# ═══════════════════════════════════════════════════════════════════════════

# Single notification
curl -X POST http://localhost:5000/api/notifications/test/send \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "'$DEVICE_TOKEN'",
    "title": "🧪 Test Notification",
    "body": "If you see this, FCM is working!",
    "data": {
      "activityId": "test-123",
      "type": "test"
    }
  }'

# ═══════════════════════════════════════════════════════════════════════════
# STEP 4: Send bulk notification to multiple devices
# ═══════════════════════════════════════════════════════════════════════════

curl -X POST http://localhost:5000/api/notifications/test/send-bulk \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceTokens": [
      "'$DEVICE_TOKEN'",
      "another_device_token_here",
      "third_device_token_here"
    ],
    "title": "📢 Bulk Test",
    "body": "Sending to multiple devices",
    "data": {
      "activityId": "bulk-test-456"
    }
  }'

# ═══════════════════════════════════════════════════════════════════════════
# TEST SCENARIOS
# ═══════════════════════════════════════════════════════════════════════════

# Test 1: Activity Status Change
curl -X POST http://localhost:5000/api/notifications/test/send \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "'$DEVICE_TOKEN'",
    "title": "🔴 Activity Started",
    "body": "Physical Training has started now! Check in to participate.",
    "data": {
      "activityId": "activity-xyz",
      "status": "Ongoing",
      "type": "activity_status_change"
    }
  }'

# Test 2: New Activity Assignment
curl -X POST http://localhost:5000/api/notifications/test/send \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "'$DEVICE_TOKEN'",
    "title": "📋 Activity Assigned",
    "body": "You have been assigned to Teaching Session",
    "data": {
      "activityId": "activity-abc",
      "type": "activity_assigned"
    }
  }'

# Test 3: Activity Completed
curl -X POST http://localhost:5000/api/notifications/test/send \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "'$DEVICE_TOKEN'",
    "title": "✅ Activity Completed",
    "body": "Community Service has been marked as completed.",
    "data": {
      "activityId": "activity-def",
      "status": "Completed",
      "type": "activity_completed"
    }
  }'

# ═══════════════════════════════════════════════════════════════════════════
# GETTING YOUR TOKENS
# ═══════════════════════════════════════════════════════════════════════════

# 1. Get JWT Token via login API
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "volunteer@example.com",
    "password": "password123"
  }'
# Look for "accessToken" in response

# 2. Get Device Token from app logs
# Android: adb logcat | grep "FCM token"
# iOS: Check Xcode console for "FCM token obtained"

# ═══════════════════════════════════════════════════════════════════════════
# VERIFY NOTIFICATION RECEIPT
# ═══════════════════════════════════════════════════════════════════════════

# Check app logs for:
# - Token registration: "✅ FCM token registered"
# - Message received: "🔴 Foreground message received" or "📱 Background message received"
# - Navigation: "🎯 Navigating to activity: ..."

# ═══════════════════════════════════════════════════════════════════════════
# COMMON ERRORS & FIXES
# ═══════════════════════════════════════════════════════════════════════════

# Error: "Unauthorized"
# Fix: JWT token is invalid/expired. Login again and get fresh token.

# Error: "Registration token is invalid"
# Fix: Device token is wrong or expired. Get fresh token from device logs.

# Error: "deviceToken is required"
# Fix: Include deviceToken in request body

# Error: No notification appears on device
# Fix: Check device has internet, notification permissions granted, app doesn't have do-not-disturb

# ═══════════════════════════════════════════════════════════════════════════
# ADVANCED: Pretty print response with jq
# ═══════════════════════════════════════════════════════════════════════════

curl -s -X POST http://localhost:5000/api/notifications/test/send \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "'$DEVICE_TOKEN'",
    "title": "Test",
    "body": "Test notification"
  }' | jq '.'

# ═══════════════════════════════════════════════════════════════════════════
# NOTES
# ═══════════════════════════════════════════════════════════════════════════

# - Always include "Bearer " prefix before JWT token
# - Device token should NOT have quotes around it in bash
# - Test on REAL DEVICE, not emulator (emulators may not receive FCM)
# - Check backend logs: npm run dev
# - Firebase credentials must be set in .env (FIREBASE_SERVICE_ACCOUNT)
# - These endpoints require authentication for security
