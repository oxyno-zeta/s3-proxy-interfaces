import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

function TopBar() {
  // Get logo configuration
  const logoCfg = ExtraJS.getLogoConfiguration ? ExtraJS.getLogoConfiguration() : { src: '/logo.png' };
  // Get title
  const title = ExtraJS.getTitle ? ExtraJS.getTitle() : 'S3-Proxy';
  return (
    <AppBar position="static">
      <Toolbar>
        <Avatar src={logoCfg.src} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '10px' }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
