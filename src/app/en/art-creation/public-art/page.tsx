import { ArtCategoryPage } from "@/components/ArtCategoryPage";
import {generateArtCategoryMetadata} from "@/lib/artCategoryMetadata";

export function generateMetadata() {
  return generateArtCategoryMetadata("public-art", "en");
}

export default function Page() {
  return <ArtCategoryPage category="public-art" locale="en" />;
}
