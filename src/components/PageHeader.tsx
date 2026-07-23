type PageHeaderProps = {
  titleEn?: string | null;
  titleZh?: string | null;
};

export function PageHeader({ titleEn, titleZh }: PageHeaderProps) {
  return (
    <header className="border-b border-[var(--border)] pb-4">
      {titleEn ? (
        <p className="ds-page-eyebrow">
          {titleEn}
        </p>
      ) : null}
      {titleZh ? (
        <h1 className="ds-page-title mt-3">
          {titleZh}
        </h1>
      ) : null}
    </header>
  );
}
