import { collection, doc, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { getClientDb } from "./firebase";

export interface UserTemplate {
  id: string;
  name: string;
  content: string;
  createdAt: number;
}

const templatesCol = (uid: string) =>
  collection(getClientDb(), "users", uid, "templates");

export async function loadUserTemplates(uid: string): Promise<UserTemplate[]> {
  const snap = await getDocs(templatesCol(uid));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<UserTemplate, "id">) }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveUserTemplate(
  uid: string,
  name: string,
  content: string
): Promise<UserTemplate> {
  const createdAt = Date.now();
  const ref = await addDoc(templatesCol(uid), { name, content, createdAt });
  return { id: ref.id, name, content, createdAt };
}

export async function deleteUserTemplate(uid: string, templateId: string): Promise<void> {
  await deleteDoc(doc(getClientDb(), "users", uid, "templates", templateId));
}
