// components/ThemeToggle.tsx
import React, { useContext } from 'react';
import { ThemeContext } from '../App';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px',
        borderRadius: '50%',
        backgroundColor: isDark ? '#374151' : '#e5e7eb',
        color: isDark ? '#fbbf24' : '#1f2937',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;