import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStateContext } from '../context/StateContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { signup, loading, currentUser } = useAuth();
  const { makePayment } = useStateContext();
  const router = useRouter();

  // Handle pending purchase after signup
  const handlePendingPurchase = () => {
    const pendingPurchase = sessionStorage.getItem('pendingPurchase');
    
    if (pendingPurchase) {
      try {
        const { items, amount } = JSON.parse(pendingPurchase);
        
        // Clear the pending purchase from session storage
        sessionStorage.removeItem('pendingPurchase');
        
        // Redirect to home first to ensure all contexts are properly loaded
        router.push('/').then(() => {
          // Small delay to ensure context is ready
          setTimeout(() => {
            makePayment(items, amount);
          }, 500);
        });
        
        return true;
      } catch (err) {
        console.error('Error processing pending purchase:', err);
      }
    }
    
    return false;
  };

  // If user is already logged in, check for pending purchase or redirect to home
  useEffect(() => {
    if (currentUser) {
      const hasPendingPurchase = handlePendingPurchase();
      if (!hasPendingPurchase) {
        router.push('/');
      }
    }
  }, [currentUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check if passwords match
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      await signup(email, password, name);
      // handlePendingPurchase is called in the useEffect when currentUser changes
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Sign Up</h1>
        
        {error && <p className="auth-error">{error}</p>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-submit-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-redirect">
          Already have an account? <Link href="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;