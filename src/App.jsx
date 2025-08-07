// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes'; 
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; 
import ThemeToggle from './components/ThemeToggle'; 

function App() {
  return (
    <Router>
      <ThemeProvider> 
        <AuthProvider>
          <AppRoutes /> 
          <ThemeToggle /> 
        </AuthProvider>
      </ThemeProvider>

   
      {/* थीम और टॉगल बटन के लिए ग्लोबल स्टाइल */}
      <style>{`
        /* CSS Variables for Themes */
        :root {
          /* Light Theme Colors */
          --background-color: #f8f9fa;
          --text-color: #212529;
          --card-background: #ffffff;
          --border-color: #e0e0e0;
          --primary-color: #007bff;
          --secondary-text: #6c757d;
          --input-background: #ffffff;
          --input-border: #ced4da;
          --input-focus-background: #e9ecef;
          --placeholder-color: #6c757d;
          --primary-color-text: rgba(0, 198, 255, 0.8); /* For eye icon */

          /* Dark Theme Colors */
          --primary-color-dark: #667eea; /* For ThemeToggle only */
        }

        body.dark {
          --background-color: #1a202c;
          --text-color: #e2e8f0;
          --card-background: rgba(255, 255, 255, 0.08); /* Semi-transparent for dark card */
          --border-color: rgba(255, 255, 255, 0.1);
          --primary-color: #667eea;
          --secondary-text: #a0aec0;
          --input-background: rgba(255, 255, 255, 0.1);
          --input-border: rgba(255, 255, 255, 0.2);
          --input-focus-background: rgba(255, 255, 255, 0.15);
          --placeholder-color: rgba(255, 255, 255, 0.6);
          --primary-color-text: rgba(0, 198, 255, 0.8); /* For eye icon */
        }

        /* Apply theme variables based on body class */
        body {
          background-color: var(--background-color);
          color: var(--text-color);
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* General element styling to use theme variables */
        /* .card styles are now mostly handled within Login/SignUp/ForgotPassword components */
        .text-muted {
          color: var(--secondary-text) !important;
          transition: color 0.3s ease;
        }

        /* Theme Toggle Button Styling */
        .theme-toggle-button {
          position: fixed;
          bottom: 35px;
          right: 35px;
          background-color: var(--primary-color); /* Uses variable for its own background */
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
          z-index: 1000; /* Ensure it's above other content */
          animation: tonggleAnim 5s ease infinite;
        }
          @keyframes tonggleAnim {
            0% {
              transform: translateY(-3px);
            }
            50% {
              transform: translateY(-15px);
            }
            100% {
              transform: translateY(-3px);
            }
            
          }
            
        .theme-toggle-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }

        .theme-toggle-button .icon {
          animation: rotateIn 0.5s ease-out;
        }

        @keyframes rotateIn {
          from {
            transform: scale(0) rotate(180deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @media (max-width: 992px) {
          .theme-toggle-button {
            position: fixed;
            bottom: 95px;
            right: 35px;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;
