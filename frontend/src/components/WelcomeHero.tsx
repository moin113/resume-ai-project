import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroContainer = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  borderRadius: '20px',
  padding: '48px 32px',
  margin: '0 0 20px 0',
  color: 'white',
  textAlign: 'left',
  border: 'none',
  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
}));

const WelcomeTitle = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: '16px',
  lineHeight: 1.2
});

const WelcomeSubtitle = styled(Typography)({
  fontSize: '1.125rem',
  opacity: 0.9,
  lineHeight: 1.5
});

interface WelcomeHeroProps {
  userName: string;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ userName }) => {
  return (
    <HeroContainer elevation={0}>
      <WelcomeTitle variant="h1">
        Welcome back, {userName}
      </WelcomeTitle>
      <WelcomeSubtitle variant="h6">
        Ready to optimize your job search, Let's start
      </WelcomeSubtitle>
    </HeroContainer>
  );
};

export default WelcomeHero;