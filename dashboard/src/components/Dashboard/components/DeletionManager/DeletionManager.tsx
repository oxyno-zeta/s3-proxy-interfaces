import React from 'react';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Entry } from '../../../../models/Entry';
import AcceptDialog from '../../../AcceptDialog';
import getClient from '../../../../client';

interface Props {
  forDeletionData: Entry[];
  isDialogOpened: boolean;
  dialogCancelHandler: () => void;
  dialogOkHandler: () => void;
}

function DeletionManager({ forDeletionData, isDialogOpened, dialogCancelHandler, dialogOkHandler }: Props) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  // Deletion requests
  const deletionRequestsHandler = () => {
    // Loop over all data to make all requests
    const promises = forDeletionData.map((item) =>
      getClient()
        .delete(item.path, { baseURL: '' })
        .then(() => null)
        .catch((err) => {
          // Log error
          console.error(err);
          return item;
        }),
    );

    // Wait all promises
    return Promise.all(promises).then((results) => {
      // Initialize counters and error list
      const errorList = results.filter((value) => value !== null);
      const successCounter = results.length - errorList.length;

      // Check if success counter isn't empty
      if (successCounter > 0) {
        enqueueSnackbar(t('deletionNotification.success', { count: successCounter }), {
          variant: 'success',
        });
      }

      // Loop over error list
      errorList.forEach((entry) => {
        enqueueSnackbar(t('deletionNotification.fail', { name: (entry as Entry).name }), { variant: 'error' });
      });
    });
  };

  return (
    <AcceptDialog
      open={isDialogOpened}
      title={t('deletionDialog.title')}
      content={t('deletionDialog.content', { count: forDeletionData.length })}
      contentElement={
        <ul>
          {forDeletionData.map((entry) => (
            <li key={entry.name}>
              <Typography sx={{ color: 'text.secondary' }}>{entry.name}</Typography>
            </li>
          ))}
        </ul>
      }
      handleClose={() => {
        dialogCancelHandler();
      }}
      handleOk={() =>
        deletionRequestsHandler().finally(() => {
          dialogOkHandler();
        })
      }
    />
  );
}

export default DeletionManager;
