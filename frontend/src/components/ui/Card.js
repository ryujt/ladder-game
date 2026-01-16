import React from 'react';
import { cn } from '../../utils/cn';

const cardVariants = {
  elevated: 'shadow-card hover:shadow-card-hover',
  outlined: 'border border-gray-200 shadow-none',
  filled: 'bg-gray-50 shadow-none',
};

const Card = ({
  children,
  variant = 'elevated',
  interactive = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'card-base',
        cardVariants[variant],
        interactive && 'cursor-pointer hover:shadow-card-lg active:shadow-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => (
  <div
    className={cn('px-6 py-4 border-b border-gray-100', className)}
    {...props}
  >
    {children}
  </div>
);

const CardBody = ({ children, className, ...props }) => (
  <div className={cn('px-6 py-5', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className, ...props }) => (
  <div
    className={cn('px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl', className)}
    {...props}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
