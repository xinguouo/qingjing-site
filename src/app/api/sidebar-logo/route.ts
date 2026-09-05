import { NextResponse } from "next/server";

import { client } from "@/sanity/client";
import { sidebarLogoQuery } from "@/sanity/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const logos = await client.withConfig({ useCdn: false }).fetch(
    sidebarLogoQuery,
    {},
    { cache: "no-store" },
  );

  return NextResponse.json(logos || {});
}
