// src/components/ui/Card.jsx - モダンなカードコンポーネント
import React from 'react';
import { classNames } from '../../utils/cn';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  ...props 
}) => {
  const baseClasses = 'rounded-2xl border transition-all duration-300';
  
  const variants = {
    default: 'bg-white/70 backdrop-blur-xl shadow-lg shadow-black/5 border-white/20',
    glass: 'bg-white/50 backdrop-blur-2xl shadow-xl shadow-black/10 border-white/30',
    solid: 'bg-white shadow-lg border-gray-200',
    gradient: 'bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-xl shadow-lg shadow-black/5 border-white/20',
  };

  const hoverClasses = hover 
    ? 'hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 hover:scale-[1.02]' 
    : '';

  return (
    <div 
      className={classNames(
        baseClasses,
        variants[variant],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div 
    className={classNames('p-6 border-b border-gray-200/50', className)}
    {...props}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div 
    className={classNames('p-6', className)}
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 
    className={classNames('text-xl font-bold text-gray-900 flex items-center', className)}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className = '', ...props }) => (
  <p 
    className={classNames('text-sm text-gray-600 mt-1', className)}
    {...props}
  >
    {children}
  </p>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;