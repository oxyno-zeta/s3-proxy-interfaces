import React, { ChangeEvent } from 'react';
import { useLocation } from 'react-router-dom';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import Uppy from '@uppy/core';
import { Dashboard, useUppy } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';

function generateEndpoint(locationPathname: string, uploadKey: string) {
  const baseEndpoint = `/files${locationPathname}`;
  // Check if upload key is set
  if (uploadKey === '') {
    return baseEndpoint;
  }

  // Build endpoint
  let endpoint = baseEndpoint;

  // Add first / if necessary
  if (!endpoint.startsWith('/')) {
    endpoint = `/${endpoint}`;
  }

  // Remove last / if necessary
  if (endpoint.endsWith('/') && uploadKey.startsWith('/')) {
    endpoint = endpoint.slice(0, -1);
  }

  // Concat upload key
  endpoint += uploadKey;

  // Trim spaces
  endpoint = endpoint.trimEnd();

  // Add last / if necessary
  if (!endpoint.endsWith('/')) {
    endpoint += '/';
  }

  // Use URL object to get a valid path
  const urlObject = new URL(`http://fake.com${endpoint}`);

  // Get path
  return urlObject.pathname;
}

function validateUploadKey(uploadKey: string, t: (key: string) => string) {
  // As it isn't compatible with s3-proxy, exclude ' characters
  if (uploadKey.includes("'")) {
    return t('validation.noQuote');
  }

  return '';
}

interface Props {
  open: boolean;
  handleClose: () => void;
  handleOk: () => void;
}

function UploadDialog({ open, handleClose, handleOk }: Props) {
  const { t } = useTranslation();
  // Get location from router
  const location = useLocation();
  // Upload data
  const [isInputDisabled, setInputDisabled] = React.useState(false);
  const [uploadKey, setUploadKey] = React.useState('');

  // Validate
  let errorMessage = ExtraJS.validateUploadKey
    ? ExtraJS.validateUploadKey(uploadKey, t)
    : validateUploadKey(uploadKey, t);

  // On change upload key function
  const onChangeUploadKey = (data: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = data;

    // Save upload key
    setUploadKey(value);
  };

  // Create uppy instance
  const uppy = useUppy(() =>
    new Uppy().use(XHRUpload, {
      id: 'XHRUpload',
      endpoint: '/',
      method: 'PUT',
      formData: true,
      limit: 1,
      timeout: 3600 * 1000,
      ...(ExtraJS.getUploadSettings && ExtraJS.getUploadSettings()),
    }),
  );

  // Try/catch errors from url object
  try {
    // Change upload endpoint with upload key
    uppy.getPlugin('XHRUpload')?.setOptions({
      endpoint: generateEndpoint(location.pathname, uploadKey),
    });
    // eslint-disable-next-line
  } catch (e: any) {
    // Set error message
    errorMessage = e.message;
  }

  // Hook on files added
  uppy.on('files-added', () => {
    if (uppy.getFiles().length >= 1) {
      setInputDisabled(true);
    }
  });

  // Hook on file removed
  uppy.on('file-removed', () => {
    if (uppy.getFiles().length === 0) {
      setInputDisabled(false);
    }
  });

  // Get powered by enabled flag
  const poweredByEnabled = ExtraJS.isPoweredByEnabled ? ExtraJS.isPoweredByEnabled() : true;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">{t('uploadDialog.title')}</DialogTitle>
      <DialogContent id="alert-dialog-description">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            marginBottom: '10px',
            marginTop: '10px',
          }}
        >
          <TextField
            fullWidth
            disabled={isInputDisabled}
            label={t('uploadDialog.uploadKeyInputLabel')}
            name="uploadKey"
            variant="outlined"
            error={errorMessage !== ''}
            helperText={isInputDisabled ? t('uploadDialog.uploadKeyDisabledHelperText') : errorMessage}
            value={uploadKey}
            onChange={onChangeUploadKey}
            size="small"
          />
          <Tooltip title={<>{t('uploadDialog.uploadKeyHelp')}</>}>
            <HelpIcon sx={{ color: 'action.active', ml: 1, my: 1 }} />
          </Tooltip>
        </Box>
        <Dashboard
          width="100%"
          height="400px"
          uppy={uppy}
          doneButtonHandler={() => {
            uppy.reset();
            handleOk();
          }}
          proudlyDisplayPoweredByUppy={poweredByEnabled}
          showProgressDetails
        />
      </DialogContent>
    </Dialog>
  );
}

export default UploadDialog;
