import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const BannerContainer = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '40px 32px',
  borderRadius: '12px',
  textAlign: 'center',
  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
  border: 'none',
}));

interface WelcomeBannerProps {
  userName?: string;
  subtitle?: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ 
  userName = "there",
  subtitle = "Ready to optimize your job search, Let's start"
}) => {
  return (
    <BannerContainer elevation={0}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700, 
          mb: 1,
          fontSize: { xs: '1.5rem', md: '2rem' }
        }}
      >
        Welcome back, {userName}
      </Typography>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 500, 
          opacity: 0.9,
          fontSize: { xs: '1rem', md: '1.25rem' }
        }}
      >
        {subtitle}
      </Typography>
    </BannerContainer>
  );
};