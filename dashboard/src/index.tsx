import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import App from './App';
import PageCenterLoading from './components/PageCenterLoading';
import ExtraJSInitialize from './components/ExtraJSInitialize';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import reportWebVitals from './reportWebVitals';

// import i18n
import './i18n';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <CssBaseline />
      <Suspense fallback={<PageCenterLoading />}>
        <ExtraJSInitialize loadingComponent={<PageCenterLoading />}>
          <ThemeProvider theme={createTheme(ExtraJS.getCustomTheme ? ExtraJS.getCustomTheme() : {})}>
            <SnackbarProvider maxSnack={5}>
              <TopBar />
              <App />
              <Footer />
            </SnackbarProvider>
          </ThemeProvider>
        </ExtraJSInitialize>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
