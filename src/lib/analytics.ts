import { collection, addDoc } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase";
import { getClientAuth } from "@/lib/firebase";

const SESSION_KEY = "infrayn_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function trackEvent(name: string, properties: Record<string, unknown> = {}): void {
  const userId = getClientAuth().currentUser?.uid ?? null;
  const sessionId = getSessionId();
  addDoc(collection(getClientDb(), "events"), {
    event: name,
    userId,
    sessionId,
    properties,
    timestamp: Date.now(),
  }).catch(() => {});
}
