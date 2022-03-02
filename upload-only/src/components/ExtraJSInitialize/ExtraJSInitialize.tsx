import React, { useEffect, useState, ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

interface PropsLayout {
  children: ReactNode;
  loadingComponent: ReactNode;
}

function ExtraJSInitialize({ children, loadingComponent }: PropsLayout) {
  // Check if ExtraJS have initialize method not set
  if (!ExtraJS.initialize) {
    return <>{children}</>;
  }

  // Create loading state
  const [initializeLoading, setInitializeLoading] = useState(true);
  // Create error raised state
  const [initializeErrorRaised, setInitializeErrorRaised] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    ExtraJS.initialize()
      .then(() => {
        setInitializeLoading(false);
      })
      .catch((err) => {
        setInitializeLoading(false);
        setInitializeErrorRaised(true);
        console.error(err);
      });
  }, []);

  // Check if loading
  if (initializeLoading) {
    return <>{loadingComponent}</>;
  }

  // Check if error have been raised
  if (initializeErrorRaised) {
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
        <Typography color="error">{t('initializeError')}</Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

export default ExtraJSInitialize;
