import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export function Card({
  children,
  className = '',
  interactive = false,
  onClick,
  selected = false,
}: CardProps) {
  const baseStyles = 'rounded-lg p-4';
  const bgStyles = selected ? 'bg-blue-600 text-white' : 'bg-slate-800 border-2 border-slate-700 text-slate-300';
  const interactiveStyles = interactive ? 'cursor-pointer transition-colors hover:bg-slate-700' : '';

  return (
    <div
      className={`${baseStyles} ${bgStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
