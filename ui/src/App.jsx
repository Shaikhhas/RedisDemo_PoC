import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SimpleMap from './components/SimpleMap';

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SimpleMap />
    </ThemeProvider>
  );
}

export default App;