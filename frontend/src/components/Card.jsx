import React from 'react';

const Card = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`glass rounded-xl p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-zinc-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
