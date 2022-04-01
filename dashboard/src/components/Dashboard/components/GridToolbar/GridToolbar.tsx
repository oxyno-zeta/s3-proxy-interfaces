import React from 'react';
import { GridToolbarContainer, GridToolbarFilterButton, GridToolbarColumnsButton } from '@mui/x-data-grid';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

// Highly inspired from : https://github.com/mui/mui-x/blob/master/packages/grid/x-data-grid/src/components/toolbar/GridToolbar.tsx

function GridToolbar() {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ marginLeft: 'auto' }}>
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
          </GridToolbarContainer>
        </Box>
      </Box>
      <Divider />
    </>
  );
}

export default GridToolbar;
