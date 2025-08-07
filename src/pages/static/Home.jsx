  import React, { useEffect } from 'react';
  import AOS from 'aos';
  import 'aos/dist/aos.css';

  import { isAuthenticated } from "../../../Backend/auth/auth";
  import { ArrowRight } from "lucide-react";
  import { Container, Row, Col, Button } from 'react-bootstrap';
  import { FaMicrophoneAlt, FaChalkboardTeacher, FaRobot, FaArrowRight } from 'react-icons/fa';
  import { Link, useNavigate } from 'react-router-dom';

  const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
      AOS.init({ duration: 900, once: true });
    }, []);

    const handleGetStarted = () => {
      if (isAuthenticated()) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    };

    return (
      <>
        {/* Modern Hero Section */}
        <div
          className="hero-section d-flex align-items-center justify-content-center"
          style={{
            minHeight: '70vh',
            background: 'linear-gradient(120deg, #0f2027 0%, #2c5364 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
          }}
          data-aos="fade-down"
        >
          <Container className="py-5">
            <Row className="justify-content-center align-items-center text-center">
              <Col md={10} lg={8}>
                <h1 className="display-3 fw-bold mb-3" style={{ letterSpacing: 1 }}>
                  <span style={{
                    background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Welcome to Voice Mentor
                  </span>
                </h1>
                <p className="lead text-light mb-4" style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  display: 'inline-block',
                  padding: '0.75rem 2rem',
                  boxShadow: '0 4px 24px #00c6ff22'
                }}>
                  Your personalized AI mentor across multiple domains.<br />
                  Ask anything, anytime! Start your journey to smarter learning today.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
                  <Button
                    onClick={handleGetStarted}
                    variant="primary"
                    size="lg"
                    style={{
                      background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
                      border: 'none',
                      boxShadow: '0 4px 16px #00c6ff44',
                      fontWeight: 600
                    }}
                  >
                    Get Started <FaArrowRight className="ms-2" />
                  </Button>
                  <Link to="/about">
                    <Button
                      variant="outline-light"
                      size="lg"
                      style={{
                        borderColor: '#00c6ff',
                        color: '#00c6ff',
                        fontWeight: 600
                      }}
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
          {/* Decorative Gradient Circles */}
          <div style={{
            position: 'absolute', top: '-80px', left: '-80px', width: 200, height: 200,
            background: 'radial-gradient(circle, #00c6ff55 0%, transparent 70%)', borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute', bottom: '-80px', right: '-80px', width: 200, height: 200,
            background: 'radial-gradient(circle, #0072ff44 0%, transparent 70%)', borderRadius: '50%'
          }} />
        </div>

        {/* Features Section */}
        <Container className="py-5">
          <Row className="g-4 py-4" data-aos="fade-up">
            <Col md={4}>
              <div className="feature-card glass-card text-center h-100 p-4" data-aos="zoom-in">
                <FaRobot size={48} className="mb-3" style={{ color: '#00c6ff', filter: 'drop-shadow(0 0 6px #00c6ff88)' }} />
                <h4 className="fw-bold mb-2">AI Expert Agent</h4>
                <p className="text-muted">Get answers from domain experts powered by intelligent voice AI.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card glass-card text-center h-100 p-4" data-aos="zoom-in" data-aos-delay="100">
                <FaChalkboardTeacher size={48} className="mb-3" style={{ color: '#00e676', filter: 'drop-shadow(0 0 6px #00e67688)' }} />
                <h4 className="fw-bold mb-2">Mentorship</h4>
                <p className="text-muted">Personalized guidance in programming, design, or any topic you choose.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card glass-card text-center h-100 p-4" data-aos="zoom-in" data-aos-delay="200">
                <FaMicrophoneAlt size={48} className="mb-3" style={{ color: '#ff1744', filter: 'drop-shadow(0 0 6px #ff174488)' }} />
                <h4 className="fw-bold mb-2">Voice Interface</h4>
                <p className="text-muted">Just speak naturally – no need to type. Enjoy a hands-free experience.</p>
              </div>
            </Col>
          </Row>
        </Container>

        {/* Call to Action */}
        <div className="bg-light text-center py-5" data-aos="zoom-in">
          <Container>
            <h2 className="mb-3 fw-bold" style={{
              background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Ready to meet your AI Mentor?
            </h2>
            <p className="mb-4 text-muted">Click below to explore available expert agents in action.</p>
            <Link to="/select-domain" className="ms-3">
              <Button
                variant="primary"
                size="lg"
                style={{
                  background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
                  border: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 16px #00c6ff44'
                }}
              >
                Explore Now
              </Button>
            </Link>
          </Container>
        </div>

        
      </>
    );
  };

  export default Home;
