import { collection, doc, setDoc, updateDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { StadiumEvent } from "@/domain/events/StadiumEvent";

const COLLECTION_NAME = "events";

export class EventRepository {
  static async saveEvent(event: StadiumEvent): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTION_NAME, event.id);
    await setDoc(docRef, event, { merge: true });
  }

  static async updateEventStatus(id: string, status: string, notes?: string): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: Record<string, unknown> = { status };
    if (notes) {
      updateData["metadata.notes"] = notes;
    }
    await updateDoc(docRef, updateData);
  }

  static async getActiveEvents(): Promise<StadiumEvent[]> {
    const db = getFirestoreDb();
    const eventsRef = collection(db, COLLECTION_NAME);
    const q = query(
      eventsRef,
      where("status", "in", ["active", "investigating"])
    );
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => doc.data() as StadiumEvent);
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static subscribeToActiveEvents(callback: (events: StadiumEvent[]) => void): () => void {
    const db = getFirestoreDb();
    const eventsRef = collection(db, COLLECTION_NAME);
    const q = query(
      eventsRef,
      where("status", "in", ["active", "investigating"])
    );
    
    // onSnapshot listens to real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const events = querySnapshot.docs.map(doc => doc.data() as StadiumEvent);
      // Sort newest first
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callback(events);
    }, (error) => {
      console.error("Error subscribing to events: ", error);
    });

    return unsubscribe;
  }
}
