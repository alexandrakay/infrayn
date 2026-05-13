import { doc, getDoc, setDoc } from "firebase/firestore";
import { getClientDb } from "./firebase";
import { UserPreferences, ALL_SECTIONS } from "./types";

export const DEFAULT_PREFERENCES: UserPreferences = {
  mode: "system",
  sections: ALL_SECTIONS,
};

const settingsDoc = (uid: string) =>
  doc(getClientDb(), "users", uid, "settings", "preferences");

export async function loadUserPreferences(uid: string): Promise<UserPreferences> {
  const snap = await getDoc(settingsDoc(uid));
  if (!snap.exists()) return DEFAULT_PREFERENCES;
  const data = snap.data() as Partial<UserPreferences>;
  return {
    mode: data.mode ?? DEFAULT_PREFERENCES.mode,
    sections: data.sections ?? DEFAULT_PREFERENCES.sections,
  };
}

export async function saveUserPreferences(uid: string, prefs: UserPreferences): Promise<void> {
  await setDoc(settingsDoc(uid), prefs);
}
