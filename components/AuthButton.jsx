import React, { useState } from 'react';
import { AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const AuthButton = () => {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    <div className="auth-container">
      {currentUser ? (
        <div className="user-profile">
          <button 
            className="user-button" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <AiOutlineUser />
            <span className="user-name">{currentUser.displayName || 'User'}</span>
          </button>
          
          {showDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-user-info">
                <p>{currentUser.displayName || 'User'}</p>
                <p className="user-email">{currentUser.email}</p>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <AiOutlineLogout />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="auth-buttons">
          <Link href="/login">
            <button className="login-button">Login</button>
          </Link>
          <Link href="/signup">
            <button className="signup-button">Sign Up</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthButton;