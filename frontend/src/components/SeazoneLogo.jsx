import React from 'react';

export default function SeazoneLogo({ className = "w-7 h-7" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Chaminé */}
      <path
        d="M58 8H74V26L58 13.5V8Z"
        fill="#FC6058"
      />
      {/* Corpo da Casa / Símbolo 'a' */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M47.2 12.3C48.8 11 51.2 11 52.8 12.3L89.6 42.1C93 44.8 92.5 50 88.5 51.5C85.5 52.6 82.5 50.5 82.5 47.3V86C82.5 90.4 78.9 94 74.5 94H68C58.5 99 44 98 32 91C19.5 83.5 13 69.5 13 55C13 42 20 31.5 28 25.5L47.2 12.3ZM50 36C39.5 36 31 44.5 31 55C31 65.5 39.5 74 50 74C60.5 74 69 65.5 69 55C69 44.5 60.5 36 50 36Z"
        fill="#FC6058"
      />
    </svg>
  );
}
