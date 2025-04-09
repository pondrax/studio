import { admin } from "$lib/server/db";
import { json } from "@sveltejs/kit";

export async function GET() {
  const collections = await admin.query._collections.findMany();
  return json({
    collections
  })
}