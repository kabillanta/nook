import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin"; // Import the function

export async function GET(request: Request) {
  // 1. CALL the function here. This happens only when API is hit.
  const auth = getAdminAuth();

  if (!auth) {
    // If it returns null, it means server config is wrong
    return NextResponse.json({ error: "Server Misconfigured" }, { status: 500 });
  }

  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    
    return NextResponse.json({ uid: decodedToken.uid });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}