import React from 'react';
import { FaGithub, FaEnvelope, FaUserShield, FaLinkedin, FaInstagram } from "react-icons/fa";

const FooterComponent = () => {
  return (
    <>
    <footer className="footer-modern text-light py-4 mt-auto">
      <div className="container">
        <div className="footer-main d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="footer-brand d-flex align-items-center mb-3 mb-md-0">
            <FaUserShield className="footer-logo me-2" size={28} />
            <span className="fw-bold fs-4">VoiceMentor</span>
          </div>
          <div className="footer-social d-flex align-items-center gap-4 mb-3 mb-md-0">
            <a
              href="mailto:akash@example.com"
              className="footer-icon"
              target="_blank"
              rel="noopener noreferrer"
              title="Contact"
            >
              <FaEnvelope size={22} />
            </a>
            <a
              href="https://github.com/akashgupta"
              className="footer-icon"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <FaGithub size={22} />
            </a>
            <a
              href="https://www.linkedin.com/in/akashgupta"
              className="footer-icon"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <FaLinkedin size={22} />
            </a>
            <a
              href="https://instagram.com/akashgupta"
              className="footer-icon"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="/privacy-policy"
              className="footer-icon"
              title="Privacy Policy"
            >
              <FaUserShield size={22} />
            </a>
          </div>
          <div className="footer-info text-center text-md-end">
            <div>
              <span className="footer-year">&copy; {new Date().getFullYear()} VoiceMentor</span>
            </div>
            <div>
              <span className="footer-dev">By <strong>Akash Gupta</strong></span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .footer-modern {
          background: linear-gradient(90deg, #0f2027 0%, #2c5364 100%);
          border-top: 3px solid #00c6ff;
          box-shadow: 0 -2px 16px #00c6ff22;
        }
        .footer-logo {
          color: #00c6ff;
          filter: drop-shadow(0 0 4px #00c6ff88);
        }
        .footer-social .footer-icon {
          color: #00c6ff;
          background: #ffffff11;
          border-radius: 50%;
          padding: 8px;
          transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .footer-social .footer-icon:hover {
          color: #fff;
          background: #00c6ff;
          transform: translateY(-3px) scale(1.12);
          box-shadow: 0 4px 16px #00c6ff55;
        }
        .footer-brand {
          letter-spacing: 2px;
          color: #fff;
          text-shadow: 0 2px 8px #00c6ff33;
        }
        .footer-info {
          font-size: 1rem;
          color: #b0e0ff;
        }
        .footer-year {
          margin-right: 8px;
        }
        .footer-dev strong {
          color: #00c6ff;
        }
        @media (max-width: 576px) {
          .footer-main {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }
          .footer-info {
            text-align: center !important;
            }
          }
      `}</style>
    </footer>
          </>
  );
};

export default FooterComponent;
