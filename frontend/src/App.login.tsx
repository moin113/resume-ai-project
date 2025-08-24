import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import theme from './theme/theme';
import { mockRootProps } from './data/dashboardMockData';

const createEmotionCache = () => {
  return createCache({
    key: 'mui',
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('dr_resume_token');
    localStorage.removeItem('dr_resume_refresh_token');
    localStorage.removeItem('dr_resume_user');
    setIsLoggedIn(false);
  };

  const handleNavigate = (section: string) => {
    console.log(`Navigating to: ${section}`);
    if (section === 'logout') {
      handleLogout();
    }
  };

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isLoggedIn ? (
          <Dashboard 
            {...mockRootProps}
            onNavigate={handleNavigate}
          />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;