import React from 'react';
import classNames from 'classnames';

export const Card = React.forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames(
      'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

export const CardHeader = ({ children, className, ...props }) => (
  <div
    className={classNames('px-4 py-2 border-b border-gray-200', className)}
    {...props}
  >
    {children}
  </div>
);

export const CardContent = ({ children, className, ...props }) => (
  <div
    className={classNames('p-4', className)}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div
    className={classNames('px-4 py-2 border-t border-gray-200 bg-gray-50 flex justify-end', className)}
    {...props}
  >
    {children}
  </div>
);

Card.displayName = 'Card';