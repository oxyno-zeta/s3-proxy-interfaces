import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Upload from './components/Upload';
import Logo from './components/Logo';
import Footer from './components/Footer';
import PageCenterLoading from './components/PageCenterLoading';
import ExtraJSInitialize from './components/ExtraJSInitialize';
import reportWebVitals from './reportWebVitals';

// import i18n
import './i18n';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Suspense fallback={<PageCenterLoading />}>
      <ExtraJSInitialize loadingComponent={<PageCenterLoading />}>
        <ThemeProvider theme={createTheme(ExtraJS.getCustomTheme ? ExtraJS.getCustomTheme() : {})}>
          <Container maxWidth="xl">
            <Box
              sx={{
                alignItems: 'center',
              }}
            >
              <Logo />
              <Upload />
            </Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                textAlign: 'center',
                flexDirection: 'column',
                margin: '10px 0',
              }}
            >
              <Footer />
            </Box>
          </Container>
        </ThemeProvider>
      </ExtraJSInitialize>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
