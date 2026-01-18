import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className,
  ...props
}) => {
  const baseClasses = 'skeleton-shimmer rounded';

  const variantClasses = {
    text: 'h-4 w-full rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    button: 'h-10 w-24 rounded-lg',
  };

  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{
        width: width,
        height: variant === 'circle' ? width : height,
      }}
      {...props}
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );
};

const SkeletonGroup = ({ children, className }) => (
  <div className={cn('space-y-3', className)} aria-busy="true">
    {children}
  </div>
);

Skeleton.Group = SkeletonGroup;

export default Skeleton;
