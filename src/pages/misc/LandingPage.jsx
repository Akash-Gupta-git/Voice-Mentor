// src/pages/LandingPage.jsx
import React from "react";
import { Container, Button } from "react-bootstrap";
// import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <motion.div className="bg-dark text-white d-flex align-items-center" style={{ height: "100vh" }}>
      <Container className="text-center">
        <motion.h1 className="display-3 fw-bold mb-4" initial={{ y: -50 }} animate={{ y: 0 }} transition={{ delay: 0.3 }}>
          Welcome to VoiceMentor
        </motion.h1>
        <motion.p className="lead mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          Your intelligent AI assistant across every domain — powered by voice.
        </motion.p>
        <Link to="/select-domain">
          <Button variant="light" size="lg">Get Started</Button>
        </Link>
      </Container>
    </motion.div>
  );
};

export default LandingPage;
