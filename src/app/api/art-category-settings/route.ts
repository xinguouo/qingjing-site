import {NextResponse} from "next/server";

import {resolveArtCategorySettingsMap} from "@/config/artCategories";
import {client} from "@/sanity/client";
import {artCategoryPageSettingsListQuery} from "@/sanity/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await client
    .fetch(artCategoryPageSettingsListQuery, {}, {cache: "no-store"})
    .catch(() => []);

  return NextResponse.json(resolveArtCategorySettingsMap(settings));
}
