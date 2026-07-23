import type { ReactNode } from "react";

import type { Locale } from "@/config/navigation";

import { AppShell } from "./AppShell";
import { PageContainer } from "./PageContainer";

type CmsReadCheckPageProps = {
  children?: ReactNode;
  count?: number;
  eyebrow: string;
  isEmpty?: boolean;
  locale?: Locale;
  placeholder?: string;
  title: string;
};

export function CmsReadCheckPage({
  children,
  count,
  eyebrow,
  isEmpty = false,
  locale = "zh",
  placeholder = "Sanity 暂无数据，页面将显示占位内容。",
  title,
}: CmsReadCheckPageProps) {
  return (
    <AppShell locale={locale}>
      <PageContainer className="py-12 lg:py-16">
        <div className="w-full max-w-none">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-token">
            {eyebrow}
          </p>
          <h1 className="font-title mt-5 text-4xl font-normal leading-tight text-primary lg:text-6xl">
            {title}
          </h1>

          <div className="glass-card mt-10 rounded-[24px] p-6 lg:p-8">
            <p className="text-sm leading-7 text-muted-token">
              {isEmpty ? placeholder : "Sanity 内容读取正常。"}
            </p>
            {typeof count === "number" ? (
              <p className="font-title mt-4 text-2xl text-primary">读取数量：{count}</p>
            ) : null}
            <div className="mt-6 border-t border-[var(--border)] pt-6">{children}</div>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
