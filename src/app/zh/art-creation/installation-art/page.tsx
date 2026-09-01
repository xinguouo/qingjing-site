import { ArtCategoryPage } from "@/components/ArtCategoryPage";
import {generateArtCategoryMetadata} from "@/lib/artCategoryMetadata";

export function generateMetadata() {
  return generateArtCategoryMetadata("installation-art", "zh");
}

export default function Page() {
  return <ArtCategoryPage category="installation-art" locale="zh" />;
}
