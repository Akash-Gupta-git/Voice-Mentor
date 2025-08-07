// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
import { getDatabase, ref, set } from "firebase/database";
import { app } from '../../../Backend/auth/firebase';
import { FaGoogle } from 'react-icons/fa';
import '../../css/App.css'; 

import Loading from '../../components/Loading';
const db = getDatabase(app);

const Login = () => {

   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();


  const putData = () => {
    // This function is unrelated to login itself, keeping it as is.
    set(ref(db, "user/akash"), {
      id: 1,
      name: "akash gupta",
      age: 23,
    });
  };


  // ... (rest of the component state and functions) ...
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  // const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const auth = getAuth();




  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!"); // Success toast notification
      setTimeout(() => { // Add a delay for the loading animation
                navigate('/Dashboard/chat'); 
            }, 2000);
    } catch (err) {
      setError(err.message);
      toast.error("Login failed: " + err.message); // Error toast
      setLoading(false);
    }
  };



  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Login successful!");
      setTimeout(() => { 
        navigate('/select-domain'); // Redirect on successful Google login
      }, 2000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      toast.error("Google login failed: " + err.message);
    }
  };

  return (

    <div className="login-container"> {/* Apply container class for background */}
      <div className="card shadow-lg p-4 login-card" style={{ maxWidth: 450, width: '100%', borderRadius: 16 }}>
        <div className="text-center mb-4">
          <h2 className="mb-1 login-title" style={{ color: '#00c6ff', fontWeight: 700 }}>Voice Mentor</h2>
          <p className="text-muted">Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin} className="mb-3 login-form">
          <div className="mb-3 form-group">
            <input
              type="email"
              className="form-control login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-3 form-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-eye"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error && <div className="alert alert-danger py-2 error-message">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary w-100 mb-2 login-button"
            style={{ background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)', border: 'none' }}
            disabled={loading}
            onClick={putData}
          >
            
            {loading &&   <Loading /> ?  'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mb-2 text-muted">or</div>
        <button
          type="button"
          className="btn btn-outline-primary w-100 mb-2 social-button google-button d-flex align-items-center justify-content-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FaGoogle /> Sign in with Google
        </button>
        {/* Add more social logins if needed */}
        <div className="d-flex justify-content-between mt-3">
          <Link to="/forgot-password" className="small text-decoration-none text-primary link-text">Forgot Password?</Link>
          <Link to="/signup" className="small text-decoration-none text-primary link-text">Sign Up</Link>
        </div>
      </div>

      {/* Inline styles can be moved to App.css or a dedicated Login.css */}
      <style>{`
        /* Global Login Container */
        .login-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #1f2a38 0%, #0f1c2c 100%); /* Darker gradient */
            overflow: hidden;
            position: relative;
            z-index: 1; /* Ensure content is above pseudo-elements */
        }

        /* Math-themed Animated Background */
        .login-container::before,
        .login-container::after {
            content: '';
            position: absolute;
            background: rgba(0, 198, 255, 0.05); /* Lighter blue, more subtle */
            border-radius: 50%;
            pointer-events: none; /* Allow clicks to pass through */
            animation: floatAndFade 20s infinite ease-in-out;
            z-index: -1; /* Behind the content */
        }

        .login-container::before {
            width: 300px;
            height: 300px;
            top: 10%;
            left: 5%;
            animation-delay: 0s;
        }

        .login-container::after {
            width: 400px;
            height: 400px;
            bottom: 15%;
            right: 10%;
            animation-delay: 10s;
        }

        @keyframes floatAndFade {
            0% { transform: translate(0, 0) scale(1); opacity: 0.05; }
            25% { transform: translate(20px, -30px) scale(1.1); opacity: 0.1; }
            50% { transform: translate(0, 0) scale(1); opacity: 0.05; }
            75% { transform: translate(-20px, 30px) scale(0.9); opacity: 0.1; }
            100% { transform: translate(0, 0) scale(1); opacity: 0.05; }
        }

        /* Card specific styles */
        .login-card {
            background: rgba(255, 255, 255, 0.08); /* Semi-transparent white */
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px); /* Frosted glass effect */
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            color: #f8f9fa; /* Light text color */
            z-index: 10; /* Ensure card is above background animations */
        }

        .login-title {
            color: #00c6ff !important; /* Keep the bright blue */
            text-shadow: 0 0 8px #00c6ff66; /* Subtle glow */
        }

        .login-form .form-group {
            position: relative;
            margin-bottom: 1.5rem; /* More space between inputs */
        }

        .login-input {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #f8f9fa;
            padding: 12px 15px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .login-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }

        .login-input:focus {
            background: rgba(255, 255, 255, 0.15);
            border-color: #00c6ff;
            box-shadow: 0 0 0 0.25rem rgba(0, 198, 255, 0.25);
        }

        /* Password eye button position adjustments */
        .password-group .btn-eye {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(0, 198, 255, 0.8); /* Adjusted color */
            cursor: pointer;
            padding: 0;
            transition: color 0.2s ease;
        }

        .password-group .btn-eye:hover {
            color: #00c6ff;
        }

        .login-button {
            padding: 12px 15px;
            border-radius: 8px;
            font-weight: bold;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .login-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 198, 255, 0.4);
        }

        .social-button {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #f8f9fa;
            padding: 12px 15px;
            border-radius: 8px;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .social-button:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: #00c6ff;
            color: #00c6ff;
            transform: translateY(-2px);
        }

        .google-button svg {
            color: #DB4437; /* Google red */
        }

        .link-text {
            color: #00c6ff !important;
            transition: color 0.2s ease;
        }

        .link-text:hover {
            color: #0099e6 !important;
        }

        /* Error Message Animation */
        .error-message {
            background-color: rgba(220, 53, 69, 0.2) !important; /* Semi-transparent red */
            color: #dc3545 !important;
            border-color: rgba(220, 53, 69, 0.4) !important;
            animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* General form-control adjustments for consistency */
        .form-control {
          color: #f8f9fa; /* Ensures text is visible */
        }
        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        /* Existing styles (from your original code) */
        .footer-modern { background: linear-gradient(90deg, #0f2027 0%, #2c5364 100%); border-top: 3px solid #00c6ff; box-shadow: 0 -2px 16px #00c6ff22; }
        .footer-logo { color: #00c6ff; filter: drop-shadow(0 0 4px #00c6ff88); }
        .footer-social .footer-icon { color: #00c6ff; background: #ffffff11; border-radius: 50%; padding: 8px; transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s; display: flex; align-items: center; justify-content: center; }
        .footer-social .footer-icon:hover { color: #fff; background: #00c6ff; transform: translateY(-3px) scale(1.12); box-shadow: 0 4px 16px #00c6ff55; }
        .footer-brand { letter-spacing: 2px; color: #fff; text-shadow: 0 2px 8px #00c6ff33; }
        .footer-info { font-size: 1rem; color: #b0e0ff; }
        .footer-year { margin-right: 8px; }
        .footer-dev strong { color: #00c6ff; }
        @media (max-width: 576px) {
          .footer-main { flex-direction: column; gap: 1.5rem; text-align: center; }
          .footer-info { text-align: center !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;