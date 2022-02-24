import React from 'react';
import Box from '@mui/material/Box';

function Logo() {
  const logoConfiguration = (ExtraJS.getLogoConfiguration && ExtraJS.getLogoConfiguration()) || {
    src: '/logo.png',
    alt: 'S3-Proxy',
  };
  return (
    <Box
      sx={{
        display: 'block',
        textAlign: 'center',
      }}
    >
      <img src={logoConfiguration.src} alt={logoConfiguration.alt} width="250" height="250" />
    </Box>
  );
}

export default Logo;
