// src/pages/PaymentFailed.js
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailed = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <svg style={styles.crossIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h1 style={styles.title}>Payment Failed</h1>
        <p style={styles.message}>
          Unfortunately, your transaction could not be completed. Please try again or contact support if the issue persists.
        </p>
        <div style={styles.buttonContainer}>
          <Link to="/" className=' w-100' style={styles.primaryButton}>Back to Home</Link>
          {/* <a href="tel:+91 9311539090" style={styles.secondaryButton}>Contact Support</a> */}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    maxWidth: '400px',
    textAlign: 'center',
  },
  iconContainer: {
    backgroundColor: '#dc3545',
    borderRadius: '50%',
    padding: '20px',
    marginBottom: '20px',
    display: 'inline-block',
  },
  crossIcon: {
    color: '#fff',
    width: '40px',
    height: '40px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
  message: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    color: '#ff5858',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
    border: '1px solid #ff5858',
    transition: 'background-color 0.3s ease',
  },
};

export default PaymentFailed;
