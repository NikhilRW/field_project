import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";

// Initialize Firebase Admin SDK
// Service account JSON should be in FIREBASE_SERVICE_ACCOUNT env variable
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT || "{}"
);

if (!admin.apps.length && Object.keys(serviceAccount).length > 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const messaging = getMessaging();

export default admin;
