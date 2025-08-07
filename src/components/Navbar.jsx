


import React, { useState, useRef, useEffect } from 'react'; 
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaPhone, FaTools, FaSignInAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'; 
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';



const Navbar = () => {
  const { isLoggedIn, currentUser,  logout } = useAuth();
  const navigate = useNavigate(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ isloading, setIsLoading ] = useState(false)
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    navigate('/login'); 
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout(); 
      toast.success("Logout successful!");
      setTimeout(() => {
        setIsLoading(false);
        setIsDropdownOpen(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

    const userEmail = currentUser?.email;
    const userName = currentUser?.displayName || userEmail?.split('@')[0] || 'User'; // Fallback to email or a generic name
    const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      <style>{`
        .navbar-modern {
          background: linear-gradient(90deg, #0f2027 0%, #2c5364 100%);
          border-bottom: 3px solid #00c6ff;
          box-shadow: 0 2px 16px #00c6ff22;
          
        }
        .navbar-logo {
          color: #00c6ff;
          filter: drop-shadow(0 0 4px #00c6ff88);
          font-weight: bold;
          letter-spacing: 2px;
          font-size: 2rem;
        }
        
        
        .navbar-nav .nav-link {
          color: #b0e0ff !important;
          font-weight: 500;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
          padding: 8px 16px;
          margin: 0 2px;
          display: flex;
          align-items: center;
        }
        .navbar-nav .nav-link.active, .navbar-nav .nav-link:hover {
          color: #fff !important;
          background: #00c6ff33;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 2px 8px #00c6ff33;
          
        }
        .navbar-toggler {
          border-color: #00c6ff;
        }
        .navbar-toggler:focus {
          box-shadow: 0 0 0 2px #00c6ff55;
        }
        
         /* User Profile Dropdown Styles */
        .user-profile-dropdown {
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          border-radius: 8px;
          background: #2c5364;
          // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: background 0.2s;
        }
        .user-profile-dropdown:hover {
          background: #3a6a7a;
        }
        .user-initial-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #00c6ff;
          color: #0f2027;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1rem;
          box-shadow: 0 0 8px #00c6ff88;
        }
        .dropdown-menu-custom {
          position: absolute;
          top: 100%; /* Navbar के नीचे */
          right: 0;
          background-color: #0f2027; /* Navbar background */
          border: 1px solid #00c6ff;
          border-radius: 8px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
          min-width: 200px;
          z-index: 1000;
          padding: 10px 0;
          margin-top: 5px; /* Navbar से थोड़ा गैप */
          display: none; /* डिफ़ॉल्ट रूप से छिपा हुआ */
          flex-direction: column;
          overflow: hidden; /* गोलाकार किनारों के लिए */
        }
        .dropdown-menu-custom.show {
          display: flex; /* जब 'show' क्लास हो तो दिखाएं */
        }
        .dropdown-item-custom {
          color: #b0e0ff;
          padding: 10px 15px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.2s, color 0.2s;
        }
        .dropdown-item-custom:hover {
          background: #00c6ff33;
          color: #fff;
        }
        .dropdown-item-custom.email {
          font-weight: bold;
          border-bottom: 1px solid #00c6ff33;
          margin-bottom: 5px;
          padding-bottom: 10px;
          cursor: default; /* ईमेल पर क्लिक करने योग्य नहीं */
        }
        .dropdown-item-custom.email:hover {
          background: none; /* ईमेल आइटम पर हॉवर प्रभाव नहीं */
          color: #b0e0ff;
        }

        @media (max-width: 576px) {
          .navbar-logo {
            font-size: 1.5rem;
          }
          .navbar-nav .nav-link {
            justify-content: center;
            padding: 10px 0;
          }
          .user-profile-dropdown {
            width: 100%;
            justify-content: center;
            margin: 5px 0;
          }
          .dropdown-menu-custom {
            position: static; /* मोबाइल पर स्टैटिक पोजीशन */
            width: 100%;
            border: none;
            box-shadow: none;
            margin-top: 0;
            border-top: 1px solid #00c6ff33;
            border-radius: 0;
          }
          .dropdown-item-custom {
            justify-content: center;
          }
        }

      `}</style>
      
      <nav className="navbar navbar-expand-lg navbar-dark navbar-modern shadow-sm py-3 px-4">
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <span className="navbar-logo me-2">VoiceMentor</span>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/" end>
                <FaHome className="me-1" /> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/about">
                <FaInfoCircle className="me-1" /> About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/services">
                <FaTools className="me-1" /> Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/contact">
                <FaPhone className="me-1" /> Contact
              </NavLink>
            </li>

               {/* Conditional rendering for Login/User Info with Dropdown */}
            {isLoggedIn && <Loading / > ? (
              <li className="nav-item" ref={dropdownRef}>
                <div className={`user-profile-dropdown`} onClick={toggleDropdown}>
                  <div className="user-initial-circle">
                    {userInitial}
                    
                  </div>
                </div>
              
                <div className={`dropdown-menu-custom ${isDropdownOpen ? 'show' : ''}`}>
                  <div className="dropdown-item-custom email">
                      <strong>{userName}</strong>
                      <br />
                      <small className="text-muted">{userEmail}</small>
                  </div>
                  <button onClick={handleLogout} className="dropdown-item-custom">
                    <FaSignOutAlt className="me-1" /> Logout
                  </button>
                </div>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink className="nav-link d-flex align-items-center" to="/login" onClick={handleLoginClick}>
                  <FaSignInAlt className="me-1" /> Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
