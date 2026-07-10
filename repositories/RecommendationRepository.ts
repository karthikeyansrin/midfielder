import { collection, doc, setDoc, updateDoc, onSnapshot, query, where } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { Recommendation } from "@/domain/recommendation/Recommendation";

const COLLECTION_NAME = "recommendations";

export class RecommendationRepository {
  static async saveRecommendation(recommendation: Recommendation, fanId: string): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTION_NAME, recommendation.id);
    
    // We append the fanId so we can query by fan later
    const dataToSave = {
      ...recommendation,
      fanId
    };
    
    await setDoc(docRef, dataToSave, { merge: true });
  }

  static async updateRecommendationStatus(id: string, status: string): Promise<void> {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status });
  }

  static subscribeToFanRecommendations(fanId: string, callback: (recommendations: Recommendation[]) => void): () => void {
    const db = getFirestoreDb();
    const recsRef = collection(db, COLLECTION_NAME);
    
    // Subscribe to recommendations for this specific fan
    const q = query(
      recsRef,
      where("fanId", "==", fanId)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recommendations = querySnapshot.docs.map(doc => doc.data() as Recommendation);
      
      // Sort newest first
      recommendations.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
      
      callback(recommendations);
    }, (error) => {
      console.error("Error subscribing to recommendations: ", error);
    });

    return unsubscribe;
  }
}
