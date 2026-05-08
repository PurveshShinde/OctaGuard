import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ children, variant = 'primary', className = '', to, ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-accent text-accent-foreground hover:bg-accent/90',
    secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700',
    outline: 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800',
    ghost: 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClassName} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
