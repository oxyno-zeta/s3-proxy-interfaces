import React from 'react';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from '@mui/material/Link';

function Footer() {
  // Check if ExtraJS have a getFooter function defined
  if (ExtraJS.getFooter) {
    return (
      <>
        <Typography sx={{ display: 'flex' }}>{ExtraJS.getFooter()}</Typography>
        <Typography sx={{ display: 'flex' }}>
          Powered by&nbsp;
          <Link href="https://github.com/oxyno-zeta/s3-proxy" target="_blank" rel="noreferrer noopener">
            S3-Proxy
          </Link>
        </Typography>
      </>
    );
  }

  return (
    <Typography sx={{ display: 'flex' }}>
      Made with <FavoriteIcon sx={{ margin: '0 5px' }} color="error" fontSize="small" />
      by Oxyno-zeta for&nbsp;
      <Link href="https://github.com/oxyno-zeta/s3-proxy" target="_blank" rel="noreferrer noopener">
        S3-Proxy
      </Link>
    </Typography>
  );
}

export default Footer;
