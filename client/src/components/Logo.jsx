import React from 'react';

const Logo = ({ className = "h-12 w-auto" }) => {
    return (
        <svg
            viewBox="0 0 300 60"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Abstract Monogram Icon */}
            <path
                d="M30 10 C 15 10, 10 20, 10 30 C 10 40, 20 40, 25 35 L 25 45 C 15 50, 0 40, 0 30 C 0 10, 15 0, 30 0 L 30 10 Z"
                fill="black"
            />
            <path
                d="M35 50 C 50 50, 55 40, 55 30 C 55 20, 45 20, 40 25 L 40 15 C 50 10, 65 20, 65 30 C 65 50, 50 60, 35 60 L 35 50 Z"
                fill="black"
            />

            {/* Text: StyleSense */}
            <text x="75" y="42" fontFamily="sans-serif" fontSize="38" fontWeight="800" letterSpacing="-1" fill="black">
                StyleSense
            </text>
            <circle cx="285" cy="12" r="3" fill="black" />
        </svg>
    );
};

export default Logo;
