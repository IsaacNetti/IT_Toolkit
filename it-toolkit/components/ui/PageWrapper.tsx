import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  maxWidth?: string;
}

export function PageWrapper({
  children,
  maxWidth = 'max-w-5xl',
}: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-8 md:pt-12 pb-12 px-4 md:px-8">
      <div className={`mx-auto ${maxWidth}`}>
        {children}
      </div>
    </div>
  );
}
