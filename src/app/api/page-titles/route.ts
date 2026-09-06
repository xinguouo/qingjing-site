import { NextResponse } from "next/server";

import { client } from "@/sanity/client";
import { pageTitlesQuery } from "@/sanity/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await client
      .withConfig({ useCdn: false })
      .fetch(pageTitlesQuery, {}, { cache: "no-store" });

    return NextResponse.json(data || {});
  } catch (error) {
    console.error("Failed to fetch page titles", error);
    return NextResponse.json({}, { status: 200 });
  }
}
