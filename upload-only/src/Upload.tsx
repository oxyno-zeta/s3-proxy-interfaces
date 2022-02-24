import React, { ChangeEvent } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import Uppy from '@uppy/core';
import { Dashboard, useUppy } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import defaultMethods from './defaultMethods';

function App() {
  const [isInputDisabled, setInputDisabled] = React.useState(false);
  const [uploadKey, setUploadKey] = React.useState(
    (ExtraJS.getInitialUploadKey && ExtraJS.getInitialUploadKey()) || '',
  );
  const { t } = useTranslation();

  // Validate
  let errorMessage = ExtraJS.validateUploadKey
    ? ExtraJS.validateUploadKey(uploadKey, t)
    : defaultMethods.validateUploadKey(uploadKey, t);

  // On change upload key function
  const onChangeUploadKey = (data: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = data;

    // Save upload key
    setUploadKey(value);
  };

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
      endpoint: ExtraJS.generateEndpoint
        ? ExtraJS.generateEndpoint(uploadKey)
        : defaultMethods.generateEndpoint(uploadKey),
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

  return (
    <>
      <TextField
        disabled={isInputDisabled}
        fullWidth
        label={t('uploadKeyInputLabel')}
        name="uploadKey"
        variant="outlined"
        error={errorMessage !== ''}
        helperText={isInputDisabled ? t('uploadKeyDisabledHelperText') : errorMessage}
        value={uploadKey}
        onChange={onChangeUploadKey}
        size="small"
        sx={{ marginBottom: '10px' }}
      />
      <Dashboard
        disabled={uploadKey === '' || errorMessage !== ''}
        width="100%"
        height="550px"
        showProgressDetails
        doneButtonHandler={() => {
          uppy.reset();
        }}
        uppy={uppy}
      />
    </>
  );
}

export default App;
