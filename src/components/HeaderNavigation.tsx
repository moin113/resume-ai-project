import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid #e5e7eb',
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

const LogoDot = styled(Box)(({ theme }) => ({
  width: '16px',
  height: '16px',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  textTransform: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
}));

const UserGreeting = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
}));

interface HeaderNavigationProps {
  userGreeting?: string;
}

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ 
  userGreeting = "Hi, there!" 
}) => {
  return (
    <StyledAppBar position="static" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Logo>
          <LogoDot />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              color: 'text.primary',
              fontSize: '1.25rem'
            }}
          >
            ResumeDoctor AI
          </Typography>
        </Logo>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <NavButton>Dashboard</NavButton>
            <NavButton>Builder</NavButton>
            <NavButton>Jobs</NavButton>
          </Box>
          <UserGreeting variant="body1">
            {userGreeting}
          </UserGreeting>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};