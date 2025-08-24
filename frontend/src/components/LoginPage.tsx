import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import LoginForm from './LoginForm';

const LoginPageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 25%, #cbd5e1 50%, #f8fafc 75%, #ffffff 100%)',
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%),
      linear-gradient(-45deg, transparent 25%, rgba(226,232,240,0.3) 25%, rgba(226,232,240,0.3) 50%, transparent 50%, transparent 75%, rgba(226,232,240,0.3) 75%)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    zIndex: -1
  }
});

interface LoginPageProps {
  onLoginSuccess?: () => void;
  onClose?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('dr_resume_token');
    if (token) {
      verifyTokenAndRedirect();
    }
  }, []);

  const verifyTokenAndRedirect = async () => {
    try {
      const token = localStorage.getItem('dr_resume_token');
      const response = await fetch('https://resume-doctor-ai.onrender.com/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        console.log('✅ Valid token found, redirecting to dashboard');
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        console.log('❌ Invalid token, clearing storage');
        localStorage.removeItem('dr_resume_token');
        localStorage.removeItem('dr_resume_refresh_token');
        localStorage.removeItem('dr_resume_user');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('dr_resume_token');
      localStorage.removeItem('dr_resume_refresh_token');
      localStorage.removeItem('dr_resume_user');
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const response = await fetch('https://resume-doctor-ai.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: 'include'
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store tokens
        localStorage.setItem('dr_resume_token', result.tokens.access_token);
        localStorage.setItem('dr_resume_refresh_token', result.tokens.refresh_token);
        localStorage.setItem('dr_resume_user', JSON.stringify(result.user));
        
        console.log('✅ Login successful, token saved');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 1000);
        
      } else {
        throw new Error(result.message || 'Login failed');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginPageContainer>
      <LoginForm 
        onLogin={handleLogin}
        onClose={onClose}
        loading={loading}
      />
    </LoginPageContainer>
  );
};

export default LoginPage;