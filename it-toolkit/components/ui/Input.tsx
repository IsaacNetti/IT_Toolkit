import { ReactNode } from 'react';

interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'search';
  disabled?: boolean;
  className?: string;
  label?: ReactNode;
  ariaLabel?: string;
}

export function Input({
  value,
  onChange,
  onKeyDown,
  placeholder,
  type = 'text',
  disabled = false,
  className = '',
  label,
  ariaLabel,
}: InputProps) {
  const baseStyles =
    'w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50';

  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseStyles} ${className}`}
        aria-label={ariaLabel}
      />
    </div>
  );
}
