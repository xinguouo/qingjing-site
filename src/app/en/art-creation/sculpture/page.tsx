import { ArtCategoryPage } from "@/components/ArtCategoryPage";
import {generateArtCategoryMetadata} from "@/lib/artCategoryMetadata";

export function generateMetadata() {
  return generateArtCategoryMetadata("sculpture", "en");
}

export default function Page() {
  return <ArtCategoryPage category="sculpture" locale="en" />;
}
