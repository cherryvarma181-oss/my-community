import React from 'react';

export const ApsrtcLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer gold ring */}
      <circle cx="50" cy="50" r="48" stroke="#D97706" strokeWidth="3" fill="#FFFBEB" />
      {/* Blue inner band */}
      <circle cx="50" cy="50" r="42" fill="#1E3A8A" />
      
      {/* Sunburst / Gear Wheel teeth in gold */}
      <g stroke="#F59E0B" strokeWidth="2">
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="10"
            x2="50"
            y2="16"
            transform={`rotate(${i * 15} 50 50)`}
          />
        ))}
      </g>

      {/* White center circle */}
      <circle cx="50" cy="50" r="26" fill="#FFFFFF" stroke="#B45309" strokeWidth="2" />
      
      {/* Red Chakra hub */}
      <circle cx="50" cy="50" r="14" fill="#DC2626" />
      <g stroke="#FEF2F2" strokeWidth="1.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="38"
            x2="50"
            y2="62"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="4.5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1" />

      {/* Text on blue ring */}
      <text x="50" y="27" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
        APSRTC
      </text>
      <text x="50" y="77" textAnchor="middle" fill="#FCD34D" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">
        YOUR JOURNEY
      </text>
    </svg>
  );
};
