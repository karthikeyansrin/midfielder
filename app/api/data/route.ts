import { NextRequest, NextResponse } from "next/server";

type Collection = "fans" | "matches" | "stadium_events" | "admin_users";

/**
 * GET /api/data
 * Read documents from a Firestore collection.
 * Business logic TBD — returns typed stub data.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection") as Collection | null;
  const docId = searchParams.get("id");
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  if (!collection) {
    return NextResponse.json(
      { error: "Missing required query param: collection" },
      { status: 400 }
    );
  }

  const VALID_COLLECTIONS: Collection[] = ["fans", "matches", "stadium_events", "admin_users"];
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json(
      { error: `Invalid collection. Must be one of: ${VALID_COLLECTIONS.join(", ")}` },
      { status: 400 }
    );
  }

  // TODO: Connect to Firestore via getFirestoreDb() from lib/firebase.ts
  // const db = getFirestoreDb();
  // const snapshot = docId
  //   ? await getDoc(doc(db, collection, docId))
  //   : await getDocs(query(collection(db, collection), limit(limit)));

  return NextResponse.json({
    collection,
    docId: docId ?? null,
    limit,
    data: [], // TODO: Replace with real Firestore data
    count: 0,
    message: "Firestore integration pending — stub response",
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/data
 * Write a document to a Firestore collection.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      collection?: Collection;
      docId?: string;
      data?: Record<string, unknown>;
      merge?: boolean;
    };

    if (!body.collection || !body.data) {
      return NextResponse.json(
        { error: "Missing required fields: collection, data" },
        { status: 400 }
      );
    }

    // TODO: Connect to Firestore via getFirestoreDb()
    // const db = getFirestoreDb();
    // const ref = body.docId ? doc(db, body.collection, body.docId) : doc(collection(db, body.collection));
    // await setDoc(ref, { ...body.data, updatedAt: serverTimestamp() }, { merge: body.merge ?? true });

    return NextResponse.json({
      success: true,
      collection: body.collection,
      docId: body.docId ?? `stub_${Date.now()}`,
      message: "Firestore write stub — implementation pending",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[/api/data] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
