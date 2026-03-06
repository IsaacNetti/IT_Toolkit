import { ReactNode } from 'react';

interface TextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
  label?: ReactNode;
  ariaLabel?: string;
}

export function Textarea({
  value,
  onChange,
  placeholder,
  disabled = false,
  rows = 4,
  className = '',
  label,
  ariaLabel,
}: TextareaProps) {
  const baseStyles =
    'w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50';

  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`${baseStyles} ${className}`}
        aria-label={ariaLabel}
      />
    </div>
  );
}
