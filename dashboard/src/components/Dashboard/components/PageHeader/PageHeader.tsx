import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import capitalize from 'capitalize';

interface Props {
  isDeletionButtonEnabled: boolean;
  isDownloadAllSelectedButtonEnabled: boolean;
  deletionButtonHandler: () => void;
  addButtonHandler: () => void;
  settingsButtonHandler: () => void;
  downloadAllSelectedButtonHandler: () => void;
}

function PageHeader({
  isDeletionButtonEnabled,
  isDownloadAllSelectedButtonEnabled,
  deletionButtonHandler,
  addButtonHandler,
  settingsButtonHandler,
  downloadAllSelectedButtonHandler,
}: Props) {
  // Get location from router
  const location = useLocation();
  // Split pathname on /
  let splitValue = location.pathname.split('/');
  // Filter empty strings
  splitValue = splitValue.filter((val) => val !== '');
  // Save intermediate path
  let intermediatePath = '/';
  // Build all intermediate path
  const allPath = splitValue.map((value) => {
    // Add value
    intermediatePath += `${value}/`;
    // Build structure
    return {
      key: capitalize(decodeURIComponent(value)),
      path: intermediatePath,
    };
  }, []);

  // Get delete feature enabled flag
  const deleteFeatureEnabled = ExtraJS.isDeleteFeatureEnabled
    ? ExtraJS.isDeleteFeatureEnabled(location.pathname)
    : true;

  // Get download all selected feature enabled flag
  const downloadAllSelectedFeatureEnabled = ExtraJS.isDownloadAllSelectedFeatureEnabled
    ? ExtraJS.isDownloadAllSelectedFeatureEnabled(location.pathname)
    : true;

  // Get upload feature enabled flag
  const uploadFeatureEnabled = ExtraJS.isUploadFeatureEnabled
    ? ExtraJS.isUploadFeatureEnabled(location.pathname)
    : true;

  return (
    <Toolbar>
      <Breadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Home
        </Link>
        {allPath.map(({ key, path }, index) => {
          if (index === allPath.length - 1) {
            return (
              <Typography color="text.primary" key={key}>
                {key}
              </Typography>
            );
          }

          return (
            <Link component={RouterLink} underline="hover" color="inherit" key={key} to={path}>
              {key}
            </Link>
          );
        })}
      </Breadcrumbs>
      <Box sx={{ marginLeft: 'auto' }}>
        {downloadAllSelectedFeatureEnabled && isDownloadAllSelectedButtonEnabled && (
          <IconButton onClick={downloadAllSelectedButtonHandler}>
            <DownloadForOfflineIcon />
          </IconButton>
        )}
        {deleteFeatureEnabled && isDeletionButtonEnabled && (
          <IconButton onClick={deletionButtonHandler}>
            <DeleteIcon />
          </IconButton>
        )}
        {uploadFeatureEnabled && (
          <IconButton onClick={addButtonHandler}>
            <AddIcon />
          </IconButton>
        )}
        <IconButton onClick={settingsButtonHandler}>
          <SettingsIcon />
        </IconButton>
      </Box>
    </Toolbar>
  );
}

export default PageHeader;
