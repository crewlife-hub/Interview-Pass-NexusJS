import React from 'react';

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({
  sidebar,
  header,
  footer,
  className,
  children,
  ...props
}) => {
  return (
    <div className="flex h-screen flex-col bg-gray-50" {...props}>
      {header && <div className="border-b border-gray-200 bg-white shadow-sm">{header}</div>}

      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <div className="w-64 border-r border-gray-200 bg-white shadow-sm overflow-y-auto">
            {sidebar}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {footer && <div className="border-t border-gray-200 bg-white px-6 py-4">{footer}</div>}
    </div>
  );
};

PageShell.displayName = 'PageShell';
