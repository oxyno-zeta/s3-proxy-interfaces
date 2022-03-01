import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

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

export default SuspenseFallbackLoading;
