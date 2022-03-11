import React from 'react';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

function Footer() {
  // Initialize the main content
  let content = (
    <Typography sx={{ display: 'flex' }}>
      Made with <FavoriteIcon sx={{ margin: '0 5px' }} color="error" fontSize="small" />
      by Oxyno-zeta for&nbsp;
      <Link href="https://github.com/oxyno-zeta/s3-proxy" target="_blank" rel="noreferrer noopener">
        S3-Proxy
      </Link>
    </Typography>
  );

  // Check if ExtraJS have a getFooter function defined
  if (ExtraJS.getFooter) {
    // Get powered by enabled flag
    const poweredByEnabled = ExtraJS.isPoweredByEnabled ? ExtraJS.isPoweredByEnabled() : true;

    content = (
      <>
        <Typography sx={{ display: 'flex' }}>{ExtraJS.getFooter()}</Typography>
        {poweredByEnabled && (
          <Typography sx={{ display: 'flex' }}>
            Powered by&nbsp;
            <Link href="https://github.com/oxyno-zeta/s3-proxy" target="_blank" rel="noreferrer noopener">
              S3-Proxy
            </Link>
          </Typography>
        )}
      </>
    );
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        textAlign: 'center',
        flexDirection: 'column',
        margin: '10px 0',
      }}
    >
      {content}
    </Box>
  );
}

export default Footer;
