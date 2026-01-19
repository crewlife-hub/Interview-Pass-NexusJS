import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ header, footer, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={`bg-white rounded-lg shadow ${className || ''}`} {...props}>
        {header && <div className="border-b border-gray-200 px-6 py-4">{header}</div>}
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="border-t border-gray-200 px-6 py-4">{footer}</div>}
      </div>
    );
  }
);

Card.displayName = 'Card';
