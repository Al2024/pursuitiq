// Firebase Admin SDK initialization (server-side only)
import 'server-only';
import admin from 'firebase-admin';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Private key may contain escaped newlines when set in env; fix them
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
// Prefer explicit bucket; otherwise derive from project id
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || (projectId ? `${projectId}.appspot.com` : undefined);

// In local dev, auto-wire the Storage emulator if available and not already set
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';
  }
  // Also set GCS emulator env for underlying client
  if (!process.env.STORAGE_EMULATOR_HOST) {
    process.env.STORAGE_EMULATOR_HOST = `http://${process.env.FIREBASE_STORAGE_EMULATOR_HOST}`;
  }
}

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket,
    });
  } else {
    // Initialize without credentials so the module can load in local dev
    // Admin features will be inactive until creds are provided
    admin.initializeApp({
      projectId: projectId || undefined,
      storageBucket,
    });
  }
}

export const adminApp = admin.app();
export const adminDb = admin.firestore?.();
export const adminStorage = admin.storage?.();
export default admin;
