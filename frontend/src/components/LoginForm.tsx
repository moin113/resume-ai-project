import React, { useState } from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Stack, 
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CloseIcon from '@mui/icons-material/Close';

const LoginContainer = styled(Paper)(({ theme }) => ({
  background: 'rgba(30, 41, 59, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  boxShadow: `
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(71, 85, 105, 0.3)
  `,
  overflow: 'hidden',
  width: '100%',
  maxWidth: '450px',
  border: '1px solid rgba(71, 85, 105, 0.4)',
  position: 'relative',
  padding: '40px',
  margin: 'auto'
}));

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: '20px',
  right: '20px',
  color: '#94a3b8',
  '&:hover': {
    background: 'rgba(71, 85, 105, 0.2)',
    color: '#e2e8f0'
  }
});

const LockIconContainer = styled(Box)({
  width: '60px',
  height: '60px',
  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 20px',
  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
});

const BrandContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  marginBottom: '8px'
});

const BrandText = styled(Typography)({
  fontFamily: '"Space Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: '1.5rem',
  color: '#e2e8f0'
});

const SubtitleText = styled(Typography)({
  textAlign: 'center',
  color: '#94a3b8',
  fontSize: '0.875rem',
  marginBottom: '30px'
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(51, 65, 85, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    '& fieldset': {
      border: '2px solid rgba(71, 85, 105, 0.4)'
    },
    '&:hover fieldset': {
      border: '2px solid rgba(71, 85, 105, 0.6)'
    },
    '&.Mui-focused fieldset': {
      border: '2px solid #10b981',
      boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)'
    }
  },
  '& .MuiOutlinedInput-input': {
    color: '#e2e8f0',
    padding: '16px 20px',
    fontSize: '1rem',
    '&::placeholder': {
      color: '#94a3b8',
      opacity: 1
    }
  },
  '& .MuiInputAdornment-root': {
    color: '#94a3b8'
  }
});

const LoginButton = styled(Button)({
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: 'white',
  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
  border: '2px solid transparent',
  borderRadius: '12px',
  padding: '16px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 30px rgba(16, 185, 129, 0.4)',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
  },
  '&:disabled': {
    opacity: 0.6,
    transform: 'none',
    background: '#9ca3af'
  }
});

const AuthFooter = styled(Box)({
  textAlign: 'center',
  marginTop: '30px',
  paddingTop: '20px',
  borderTop: '1px solid rgba(71, 85, 105, 0.3)',
  color: '#94a3b8',
  fontSize: '0.875rem',
  '& a': {
    color: '#f59e0b',
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
      color: '#fbbf24',
      textDecoration: 'underline'
    }
  }
});

interface LoginFormProps {
  onLogin?: (email: string, password: string) => Promise<void>;
  onClose?: () => void;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onClose, loading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const errors = [];
    
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    
    if (email && !isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }
    
    return errors;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    try {
      if (onLogin) {
        await onLogin(email, password);
        setSuccess('Login successful! Redirecting...');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <LoginContainer elevation={0}>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>

      <LockIconContainer>
        <LockOutlinedIcon sx={{ fontSize: 24, color: 'white' }} />
      </LockIconContainer>

      <BrandContainer>
        <SmartToyOutlinedIcon sx={{ fontSize: 28, color: '#e2e8f0' }} />
        <BrandText>ResumeDoctor AI</BrandText>
      </BrandContainer>
      
      <SubtitleText>Sign in to your account</SubtitleText>

      {error && (
        <Alert severity="error" sx={{ mb: 2, backgroundColor: '#fee2e2', color: '#991b1b' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2, backgroundColor: '#d1fae5', color: '#065f46' }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <StyledTextField
            fullWidth
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
              )
            }}
          />

          <StyledTextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#94a3b8' }}
                  >
                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <LoginButton
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Login'}
          </LoginButton>
        </Stack>
      </form>

      <AuthFooter>
        Don't have an account? <a href="#register">Register here</a>
      </AuthFooter>
    </LoginContainer>
  );
};

export default LoginForm;