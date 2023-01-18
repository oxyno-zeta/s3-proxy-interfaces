import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DataGrid,
  GridRowParams,
  GridFilterModel,
  GridRenderCellParams,
  GridColumns,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';
import filesize from 'filesize';
import DownloadIcon from '@mui/icons-material/Download';
import GridToolbar from './components/GridToolbar';
import PageHeader from './components/PageHeader';
import DeletionManager from './components/DeletionManager';
import { getFileIconFromExtension, base64Encode, base64Decode } from './utils';
import { Entry, FOLDER_TYPE, FILE_TYPE } from '../../models/Entry';
import getClient from '../../client';
import UploadDialog from './components/UploadDialog';

const columns: GridColumns = [
  {
    field: 'name',
    headerName: 'Name',
    editable: false,
    flex: 1,
    renderCell: (params: GridRenderCellParams<string, Entry>) => {
      // Initialize as folder icon
      let iconElement = (
        <Avatar sx={{ marginRight: '5px' }}>
          <FolderIcon />
        </Avatar>
      );

      // Check if type is a file
      if (params.row.type === FILE_TYPE) {
        iconElement = <Avatar sx={{ marginRight: '5px' }}>{getFileIconFromExtension(params.value || '')}</Avatar>;
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
    renderCell: (params: GridRenderCellParams<Date, Entry>) => {
      // Check if year is 1
      if (params.value?.getFullYear() === 1) {
        // Empty value
        return '-';
      }

      // Display in browser locale
      return params.value?.toLocaleString();
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
    renderCell: (params: GridRenderCellParams<number, Entry>) => {
      // Check if it is a folder
      if (params.row.type === FOLDER_TYPE) {
        // No size for a folder
        return '-';
      }

      // Default
      return filesize(params.value || 0);
    },
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    getActions: (params: GridRowParams) => {
      const { row } = params;
      // Check if type is a folder
      if (row.type === FOLDER_TYPE) {
        // No link
        return [];
      }

      return [
        <GridActionsCellItem
          component="a"
          href={row.path}
          target="_blank"
          rel="noopener noreferrer"
          icon={<DownloadIcon />}
          label="Download"
        />,
      ];
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
  // Data grid variables
  const [pageSize, setPageSize] = useState(50);
  // Data reloader help
  const [refreshKey, setRefreshKey] = useState(0);
  // Selection data
  const [selectedData, setSelectedData] = useState<Entry[]>([]);
  const [isDeletionManagerDialogOpened, setDeletionManagerDialogOpened] = useState<boolean>(false);
  // Upload modal
  const [isUploadDialogOpened, setUploadDialogOpened] = useState<boolean>(false);
  // Settings toolbar
  const [isSettingToolbarShowed, setSettingToolbarShowed] = useState<boolean>(false);
  // Filter model
  const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>({ items: [] });

  // Request the backend
  useEffect(() => {
    // Start loading
    setLoading(true);
    // Flush the selected data
    setSelectedData([]);
    // Flush filter
    setFilterModel({ items: [] });
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
      getRowId={(row) => base64Encode(row.path)}
      components={{ Toolbar: isSettingToolbarShowed ? GridToolbar : undefined }}
      filterModel={filterModel}
      onFilterModelChange={(filter) => setFilterModel(filter)}
      columns={columns}
      rowHeight={40}
      headerHeight={40}
      pageSize={pageSize}
      onPageSizeChange={(newPageSize) => {
        setPageSize(newPageSize);
      }}
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
          if (ids.find((id) => item.path === base64Decode(id as string))) {
            return true;
          }

          return false;
        });

        // Save selected rows
        setSelectedData(selectedRows);
      }}
      onRowDoubleClick={(params) => {
        const { row } = params;
        // Check if type is a folder
        if (row.type === FOLDER_TYPE) {
          // Navigate to path
          navigate(location.pathname + row.name, { replace: true });
        } else {
          // File detected, open file in another tab to download/open it
          window.open(row.path, '_blank', 'noreferrer noopener')?.focus();
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
        forDeletionData={selectedData}
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
        isDeletionButtonEnabled={selectedData.length > 0}
        isDownloadAllSelectedButtonEnabled={selectedData.length > 0}
        deletionButtonHandler={() => {
          setDeletionManagerDialogOpened(true);
        }}
        addButtonHandler={() => {
          setUploadDialogOpened(true);
        }}
        settingsButtonHandler={() => {
          setSettingToolbarShowed(!isSettingToolbarShowed);
        }}
        downloadAllSelectedButtonHandler={() => {
          selectedData.forEach((row) => {
            window.open(row.path, '_blank', 'noreferrer noopener');
          });
        }}
      />
      {mainElement}
    </>
  );
}

export default Dashboard;
