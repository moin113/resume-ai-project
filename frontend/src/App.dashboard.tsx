import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import Dashboard from './components/Dashboard';
import theme from './theme/theme';
import { mockRootProps } from './data/dashboardMockData';

const createEmotionCache = () => {
  return createCache({
    key: 'mui',
    prepend: true, // Theme styles will be inserted at lower precedence than other styles
  });
};

const emotionCache = createEmotionCache();

const App: React.FC = () => {
  const handleNavigate = (section: string) => {
    console.log(`Navigating to: ${section}`);
    // Handle navigation logic here
  };

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dashboard 
          {...mockRootProps}
          onNavigate={handleNavigate}
        />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;