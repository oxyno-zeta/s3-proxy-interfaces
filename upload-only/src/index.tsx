import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Upload from './Upload';
import Logo from './Logo';
import reportWebVitals from './reportWebVitals';

// import i18n
import './i18n';

function SuspenseFallbackLoading() {
  return (
    <Box
      sx={{
        alignItems: 'center',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          zIndex: 9999,
        }}
      />
    </Box>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Suspense fallback={<SuspenseFallbackLoading />}>
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
          <Typography sx={{ display: 'flex' }}>
            Made with <FavoriteIcon sx={{ margin: '0 5px' }} color="error" fontSize="small" /> by Oxyno-zeta
          </Typography>
        </Box>
      </Container>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
