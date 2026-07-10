import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { FanContext } from "@/domain/fan/FanContext";

const COLLECTION_NAME = "fans";

export class FanRepository {
  static async getFan(id: string): Promise<FanContext | null> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as FanContext;
    }
    return null;
  }

  static async saveFan(fan: FanContext): Promise<void> {
    const db = getFirestoreDb();

    const docRef = doc(db, COLLECTION_NAME, fan.id);
    
    const cleanUndefined = (obj: unknown): unknown => {
      if (Array.isArray(obj)) return obj.map(cleanUndefined);
      if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
          const val = (obj as Record<string, unknown>)[key];
          if (val !== undefined) acc[key] = cleanUndefined(val);
          return acc;
        }, {} as Record<string, unknown>);
      }
      return obj;
    };

    const safeFan = cleanUndefined({
      ...fan,
      updatedAt: new Date().toISOString()
    }) as Record<string, unknown>;

    await setDoc(docRef, safeFan, { merge: true });
  }
}
