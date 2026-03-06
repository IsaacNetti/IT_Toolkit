import { ReactNode } from 'react';

interface BannerProps {
  type: 'info' | 'warning' | 'error' | 'confirm';
  children: ReactNode;
  onClose?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  showCloseButton?: boolean;
}

export function Banner({
  type,
  children,
  onClose,
  actions,
  showCloseButton = true,
}: BannerProps) {
  const typeStyles = {
    info: 'bg-blue-600 text-blue-100',
    warning: 'bg-yellow-600 text-yellow-100',
    error: 'bg-red-600 text-red-100',
    confirm: 'bg-red-600 text-red-100',
  };

  const actionButtonStyles = {
    primary: 'bg-red-700 hover:bg-red-800',
    secondary: 'bg-red-500 hover:bg-red-600',
    danger: 'bg-red-700 hover:bg-red-800',
  };

  return (
    <div className={`${typeStyles[type]} p-4 rounded-lg mb-6 flex justify-between items-center`}>
      <div className="text-sm flex-1">{children}</div>
      
      {(actions || showCloseButton) && (
        <div className="flex gap-3 ml-4 flex-shrink-0">
          {actions?.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`text-white px-4 py-1 rounded text-sm font-medium transition-colors ${
                actionButtonStyles[action.variant || 'secondary']
              }`}
            >
              {action.label}
            </button>
          ))}
          
          {showCloseButton && !actions && (
            <button
              onClick={onClose}
              className="text-inherit hover:text-white ml-4 flex-shrink-0"
              aria-label="Close banner"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}
