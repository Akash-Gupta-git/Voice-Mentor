// src/components/ThemeToggle.jsx
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // सूर्य और चंद्रमा आइकन
import { useTheme } from '../context/ThemeContext'; // useTheme हुक इम्पोर्ट करें

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-button"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <FaMoon className="icon moon-icon" />
      ) : (
        <FaSun className="icon sun-icon" />
      )}
    </button>
  );
};

export default ThemeToggle;