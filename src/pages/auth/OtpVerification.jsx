// src/components/Auth/OtpVerification.jsx
import React, { useState } from 'react';
import axios from 'axios';

function OtpVerification({ email, onVerified }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email, otp
      });
      localStorage.setItem('token', res.data.token);
      onVerified();
    } catch (err) {
      setError('Invalid OTP');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
      <form onSubmit={verifyOtp} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600">
          Verify
        </button>
      </form>
    </div>
  );
}

export default OtpVerification;
