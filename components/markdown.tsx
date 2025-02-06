'use client';

export function Markdown({ children }: { children: string }) {
  return <div className="prose dark:prose-invert max-w-none">{children}</div>;
}
