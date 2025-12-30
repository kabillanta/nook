import admin from "firebase-admin";

// We export a FUNCTION, not a variable. 
// This way, the code inside doesn't run until you call it.
export function getAdminAuth() {
  // 1. If already initialized, just return the auth instance
  if (admin.apps.length > 0) {
    return admin.auth();
  }

  // 2. Prepare the key safely
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  // 3. If key is missing (likely during build), return null gracefully
  if (!privateKey) {
    console.warn("⚠️ Firebase Private Key missing. Skipping init (Safe for Build).");
    return null;
  }

  // 4. Try to Initialize
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    return admin.auth();
  } catch (error) {
    console.error("Firebase Admin Init Error:", error);
    return null;
  }
}