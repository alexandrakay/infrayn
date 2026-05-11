import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set");

  // In production, set FIREBASE_SERVICE_ACCOUNT_KEY to the JSON key string.
  // In development with ADC (gcloud auth application-default login), omit it.
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    return initializeApp({
      credential: cert(JSON.parse(serviceAccountKey)),
      projectId,
    });
  }

  return initializeApp({ projectId });
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
