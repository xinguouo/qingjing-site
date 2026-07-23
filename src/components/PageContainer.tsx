import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  minHeight?: boolean;
};

export function PageContainer({
  children,
  className = "",
  minHeight = true,
}: PageContainerProps) {
  return (
    <section
      className={`page-surface overflow-x-hidden px-[var(--ds-layout-content-padding-mobile)] py-8 sm:px-[var(--ds-layout-content-padding-tablet)] lg:px-[var(--ds-layout-content-padding-desktop)] lg:py-9 ${
        minHeight ? "min-h-[calc(100vh-62px)]" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}
