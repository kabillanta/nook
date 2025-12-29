import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return NextResponse.json({ uid: decoded.uid });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
