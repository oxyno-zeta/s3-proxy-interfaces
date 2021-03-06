import { TFunction } from 'react-i18next';

export default {
  validateUploadKey: (uploadKey: string, t: TFunction) => {
    // Init error message
    let errorMessage = '';
    // Validate upload key
    if (uploadKey === '') {
      errorMessage = t('validation.required');
    }

    return errorMessage;
  },
  generateEndpoint: (uploadKey: string) => {
    const baseEndpoint = '/upload/';
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
  },
};
