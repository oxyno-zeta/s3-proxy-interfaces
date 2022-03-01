import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';
import filesize from 'filesize';
import PageHeader from './components/PageHeader';
import DeletionManager from './components/DeletionManager';
import { getFileIconFromExtension } from './utils';
import { Entry, FOLDER_TYPE, FILE_TYPE } from '../../models/Entry';
import getClient from '../../client';
import UploadDialog from './components/UploadDialog';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    editable: false,
    flex: 1,
    renderCell: (params: { value: string; row: Entry }) => {
      // Initialize as folder icon
      let iconElement = (
        <Avatar sx={{ marginRight: '5px' }}>
          <FolderIcon />
        </Avatar>
      );

      // Check if type is a file
      if (params.row.type === FILE_TYPE) {
        iconElement = <Avatar sx={{ marginRight: '5px' }}>{getFileIconFromExtension(params.value)}</Avatar>;
      }

      return (
        <>
          {iconElement}
          <Typography>{params.value}</Typography>
        </>
      );
    },
  },
  {
    field: 'lastModified',
    headerName: 'Last Modified',
    type: 'date',
    editable: false,
    valueGetter: (params: { value: string }) => new Date(params.value),
    renderCell: (params: { value: Date }) => {
      // Check if year is 1
      if (params.value.getFullYear() === 1) {
        // Empty value
        return '-';
      }

      // Display in browser locale
      return params.value.toLocaleString();
    },
    flex: 0.25,
  },
  {
    field: 'size',
    headerName: 'Size',
    type: 'number',
    align: 'left',
    headerAlign: 'left',
    editable: false,
    flex: 0.1,
    renderCell: (params: { value: number; row: Entry }) => {
      // Check if it is a folder
      if (params.row.type === FOLDER_TYPE) {
        // No size for a folder
        return '-';
      }

      // Default
      return filesize(params.value);
    },
  },
];

function Dashboard() {
  // Router data
  const location = useLocation();
  const navigate = useNavigate();
  // Translate data
  const { t } = useTranslation();
  // Data loaded from request
  const [data, setData] = useState<Array<Entry>>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  // Data reloader help
  const [refreshKey, setRefreshKey] = useState(0);
  // Deletion data
  const [forDeletionData, setForDeletionData] = useState<Entry[]>([]);
  const [isDeletionManagerDialogOpened, setDeletionManagerDialogOpened] = useState<boolean>(false);
  // Upload modal
  const [isUploadDialogOpened, setUploadDialogOpened] = useState<boolean>(false);

  // Request the backend
  useEffect(() => {
    // Start loading
    setLoading(true);
    // Flush the deletion data
    setForDeletionData([]);
    // Request
    getClient()
      .get(location.pathname)
      .then((value) => {
        // Save data
        setData(value.data);
      })
      .catch((err: Error) => {
        // Save error
        setError(err);
      })
      .finally(() => {
        // Finally stop loading
        setLoading(false);
      });
  }, [location.pathname, refreshKey]);

  // Get delete feature enabled flag
  const deleteFeatureEnabled = ExtraJS.isDeleteFeatureEnabled
    ? ExtraJS.isDeleteFeatureEnabled(location.pathname)
    : true;

  // Initialize main element
  let mainElement = (
    <DataGrid
      rows={data}
      getRowId={(row) => row.path}
      columns={columns}
      rowHeight={40}
      headerHeight={40}
      pageSize={50}
      rowsPerPageOptions={[10, 25, 50, 100]}
      hideFooterSelectedRowCount
      checkboxSelection={deleteFeatureEnabled}
      density="comfortable"
      loading={isLoading}
      sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }}
      isRowSelectable={(params) => {
        // Expand
        const { row } = params;
        // Selectable only if it is a file
        return row.type === FILE_TYPE;
      }}
      onSelectionModelChange={(ids) => {
        // Find rows from "ids"
        const selectedRows = data.filter((item) => {
          // Check if that item is in the list of "ids"
          if (ids.find((id) => item.path === id)) {
            return true;
          }

          return false;
        });

        // Save selected rows
        setForDeletionData(selectedRows);
      }}
      onRowDoubleClick={(params) => {
        const { row } = params;
        // Check if type is a folder
        if (row.type === FOLDER_TYPE) {
          // Navigate to path
          navigate(location.pathname + row.name, { replace: true });
        } else {
          // File detected, open file in another tab to download/open it
          window.open(row.path, '_blank', 'noreferrer')?.focus();
        }
      }}
      autoHeight
    />
  );

  // Check if error isn't null
  if (error !== null) {
    mainElement = (
      <>
        <Divider />
        <Typography
          color="error"
          sx={{
            alignItems: 'center',
            display: 'flex',
            textAlign: 'center',
            flexDirection: 'column',
            marginTop: '20px',
          }}
        >
          {error.message}
        </Typography>
      </>
    );
  } else if (data.length === 0) {
    mainElement = (
      <>
        <Divider />
        <Typography
          sx={{
            alignItems: 'center',
            display: 'flex',
            textAlign: 'center',
            flexDirection: 'column',
            marginTop: '20px',
          }}
        >
          {t('emptyData')}
        </Typography>
      </>
    );
  }

  return (
    <>
      <UploadDialog
        open={isUploadDialogOpened}
        handleClose={() => {
          setUploadDialogOpened(false);
        }}
        handleOk={() => {
          setUploadDialogOpened(false);
          setRefreshKey(refreshKey + 1);
        }}
      />
      <DeletionManager
        forDeletionData={forDeletionData}
        dialogOkHandler={() => {
          setDeletionManagerDialogOpened(false);
          setRefreshKey(refreshKey + 1);
        }}
        dialogCancelHandler={() => {
          setDeletionManagerDialogOpened(false);
        }}
        isDialogOpened={isDeletionManagerDialogOpened}
      />
      <PageHeader
        isDeletionButtonEnabled={forDeletionData.length > 0}
        deletionButtonHandler={() => {
          setDeletionManagerDialogOpened(true);
        }}
        addButtonHandler={() => {
          setUploadDialogOpened(true);
        }}
      />
      {mainElement}
    </>
  );
}

export default Dashboard;
