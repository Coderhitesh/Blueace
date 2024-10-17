// src/pages/SuccessPayment.js
import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPayment = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <svg style={styles.checkIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 style={styles.title}>Payment Successful</h1>
        <p style={styles.message}>
          Thank you for your payment! Your transaction has been completed, and a receipt has been sent to your email.
        </p>
        <div style={styles.buttonContainer}>
          <Link to="/" style={styles.primaryButton}>Return to Home</Link>
          <Link to="/order-history" style={styles.secondaryButton}>View Order History</Link>
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
    background: 'linear-gradient(135deg, #6DD5FA 0%, #2980B9 100%)',
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
    backgroundColor: '#28a745',
    borderRadius: '50%',
    padding: '20px',
    marginBottom: '20px',
    display: 'inline-block',
  },
  checkIcon: {
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
    backgroundColor: '#28a745',
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
    color: '#2980B9',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
    border: '1px solid #2980B9',
    transition: 'background-color 0.3s ease',
  },
  primaryButtonHover: {
    backgroundColor: '#218838',
  },
  secondaryButtonHover: {
    backgroundColor: '#f0f0f0',
  },
};

export default SuccessPayment;
