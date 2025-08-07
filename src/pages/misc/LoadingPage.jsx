// src/pages/LoadingPage.jsx
import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary" />
        <div className="mt-3">Loading your experience...</div>
      </div>
    </div>
  );
};

export default LoadingPage;
