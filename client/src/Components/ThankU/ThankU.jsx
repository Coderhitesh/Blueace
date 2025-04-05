import React from 'react';

const ThankU = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center p-5 shadow-lg rounded bg-white">
        <i className="bi bi-check-circle-fill text-success display-3"></i>
        <h2 className="mt-3">Thank You!</h2>
        <p className="text-muted">We appreciate your inquiry. Our team will get back to you soon.</p>
        <a href="/" className="btn btn-primary mt-3">Go to Home</a>
      </div>
    </div>
  );
};

export default ThankU;