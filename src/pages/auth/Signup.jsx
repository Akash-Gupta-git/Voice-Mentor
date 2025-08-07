// src/pages/auth/SignUp.jsx
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../css/App.css'; // Ensure this path is correct for global styles
import { app } from '../../../Backend/auth/firebase'; // Assuming your firebase.js is in src/firebase.js
import { FaGoogle, FaFacebookF, FaTwitter, FaGithub } from 'react-icons/fa';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app); // Firebase auth instance

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Optional: You might want to send an email verification here
      // await sendEmailVerification(auth.currentUser);
      navigate('/Dashboard/chat'); // Redirect to dashboard after successful signup
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/select-domain'); // Redirect after successful Google signup
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container"> {/* Reusing login-container for consistent background */}
      <div className="card shadow-lg p-4 login-card" style={{ maxWidth: 450, width: '100%', borderRadius: 16 }}>
        <div className="text-center mb-4">
          <h2 className="mb-1 login-title" style={{ color: '#00c6ff', fontWeight: 700 }}>Voice Mentor</h2>
          <p className="text-muted">Create your account</p>
        </div>
        <form onSubmit={handleSignUp} className="mb-3 login-form">
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
          <div className="mb-3 form-group password-group">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-control login-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-eye"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error && <div className="alert alert-danger py-2 error-message">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary w-100 mb-2 login-button"
            style={{ background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)', border: 'none' }}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mb-2 text-muted">or</div>
        <button
          type="button"
          className="btn btn-outline-primary w-100 mb-2 social-button google-button d-flex align-items-center justify-content-center gap-2"
          onClick={handleGoogleSignUp}
          disabled={loading}
        >
          <FaGoogle /> Sign up with Google
        </button>
        {/* Add more social logins if needed */}
        <div className="d-flex justify-content-between mt-3">
          <Link to="/login" className="small text-decoration-none text-primary link-text">Already have an account? Sign In</Link>
        </div>
      </div>

      {/* Styles are reused from Login.jsx for consistency */}
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
      `}</style>
    </div>
  );
};

export default Signup;
