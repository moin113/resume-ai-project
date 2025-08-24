import React from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(30, 41, 59, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
  boxShadow: 'none'
}));

const BrandContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  color: '#e2e8f0'
});

const BrandText = styled(Typography)({
  fontFamily: '"Space Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: '1.25rem'
});

const NavButton = styled(Button)(({ theme }) => ({
  color: '#94a3b8',
  textTransform: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  fontWeight: 500,
  '&:hover': {
    color: '#e2e8f0',
    background: 'rgba(71, 85, 105, 0.3)'
  },
  '&.active': {
    color: '#10b981',
    background: 'rgba(16, 185, 129, 0.1)'
  }
}));

const UserGreeting = styled(Typography)({
  color: '#e2e8f0',
  marginRight: '15px'
});

interface NavigationHeaderProps {
  userName: string;
  onNavigate?: (section: string) => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ userName, onNavigate }) => {
  return (
    <StyledAppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between', padding: '20px 30px' }}>
        <Stack direction="column" spacing={1}>
          <BrandContainer>
            <SmartToyOutlinedIcon sx={{ fontSize: 24, color: '#e2e8f0' }} />
            <BrandText>ResumeDoctor AI</BrandText>
          </BrandContainer>
          
          <Stack direction="row" spacing={2.5}>
            <NavButton 
              className="active"
              startIcon={<AssessmentOutlinedIcon />}
              onClick={() => onNavigate?.('dashboard')}
            >
              Dashboard
            </NavButton>
            <NavButton 
              startIcon={<BuildOutlinedIcon />}
              onClick={() => onNavigate?.('builder')}
            >
              Builder
            </NavButton>
            <NavButton 
              startIcon={<WorkOutlineOutlinedIcon />}
              onClick={() => onNavigate?.('jobs')}
            >
              Jobs
            </NavButton>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center">
          <UserGreeting variant="body1">
            {userName}
          </UserGreeting>
        </Stack>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavigationHeader;