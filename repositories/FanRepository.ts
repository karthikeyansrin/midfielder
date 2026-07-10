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

    console.log("Saving fan:", fan);
    console.log("Fan ID:", fan.id);
    console.log("Type of fan.id:", typeof fan.id);

    const docRef = doc(db, COLLECTION_NAME, fan.id);
    
    // Firestore rejects `undefined` values. Recursively remove them.
    const cleanUndefined = (obj: any): any => {
      if (Array.isArray(obj)) return obj.map(cleanUndefined);
      if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
          if (obj[key] !== undefined) acc[key] = cleanUndefined(obj[key]);
          return acc;
        }, {} as any);
      }
      return obj;
    };

    const safeFan = cleanUndefined({
      ...fan,
      updatedAt: new Date().toISOString()
    });

    await setDoc(docRef, safeFan, { merge: true });
  }
}
