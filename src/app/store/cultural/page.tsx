import {StoreOverview} from "@/components/StorePages";

export default function Page() {
  return (
    <StoreOverview
      activeCategory="cultural"
      includeLocalePrefix={false}
      locale="zh"
    />
  );
}
