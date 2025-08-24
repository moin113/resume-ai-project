import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoginContainer = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '40px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '14px 24px',
  fontSize: '16px',
  fontWeight: 600,
  borderRadius: '8px',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  '&:disabled': {
    opacity: 0.6,
    transform: 'none',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#e5e7eb',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#667eea',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '14px 16px',
    fontSize: '16px',
    color: '#1f2937',
  },
  '& .MuiInputLabel-root': {
    color: '#374151',
    fontWeight: 500,
    fontSize: '14px',
  },
}));

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setAlert({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    if (!isValidEmail(email)) {
      setAlert({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onSubmit) {
        onSubmit(email, password);
      }
      
      setAlert({ type: 'success', message: 'Login successful! Redirecting...' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  return (
    <LoginContainer elevation={0}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
          🤖 ResumeDoctor AI
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          Sign in to your account
        </Typography>
      </Box>

      {alert && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 3, borderRadius: '8px' }}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, color: '#374151', fontWeight: 500 }}>
            Email
          </Typography>
          <StyledTextField
            fullWidth
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ mb: 1, color: '#374151', fontWeight: 500 }}>
            Password
          </Typography>
          <StyledTextField
            fullWidth
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>

        <GradientButton
          type="submit"
          fullWidth
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? 'Signing In...' : 'Login'}
        </GradientButton>
      </Box>

      <Box sx={{ 
        textAlign: 'center', 
        mt: 3, 
        pt: 2.5, 
        borderTop: '1px solid #e5e7eb',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        Don't have an account?{' '}
        <Typography 
          component="a" 
          href="#" 
          sx={{ 
            color: '#667eea', 
            textDecoration: 'none', 
            fontWeight: 500,
            '&:hover': {
              color: '#764ba2',
              textDecoration: 'underline'
            }
          }}
        >
          Register here
        </Typography>
      </Box>
    </LoginContainer>
  );
};