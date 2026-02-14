import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST() {
  try {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) return NextResponse.json({ error: "No DB" }, { status: 500 });
    const sql = neon(connectionString);
    await sql`DELETE FROM services`;
    // Reset the global init flag by clearing cached sql
    (global as any).sql = undefined;
    return NextResponse.json({ success: true, message: "Services cleared. Restart or hit /api/services to re-seed." });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
