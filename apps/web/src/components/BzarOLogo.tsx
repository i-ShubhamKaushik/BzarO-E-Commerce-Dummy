import React from 'react';

interface BzarOLogoProps {
  className?: string;
  size?: number | string;
}

export const BzarOLogo: React.FC<BzarOLogoProps> = ({ className = '', size = '100%' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="bzaroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      
      {/* Shopping Bag Handle */}
      <path
        d="M 35 35 C 35 15, 65 15, 65 35"
        stroke="url(#bzaroGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Shopping Bag Body (styled like a B) with inner cutouts using evenodd rule */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="
          M 30 35 
          H 55 
          A 10,10 0 0 1 65,45 
          A 10,10 0 0 1 55,55 
          H 60 
          A 11,11 0 0 1 71,66 
          A 11,11 0 0 1 60,77 
          H 30 
          V 35 
          Z 
          
          M 40,41 
          H 48 
          A 4,4 0 0 1 52,45 
          A 4,4 0 0 1 48,49 
          H 40 
          V 41 
          Z 
          
          M 43,66 
          a 6,6 0 1 0 12,0 
          a 6,6 0 1 0 -12,0 
          Z
        "
        fill="url(#bzaroGrad)"
      />
    </svg>
  );
};
