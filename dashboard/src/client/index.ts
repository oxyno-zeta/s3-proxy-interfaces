import axios, { AxiosInstance } from 'axios';

let instance: AxiosInstance | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function defaultTransformResponse(data: any) {
  if (data !== '') {
    return JSON.parse(data);
  }

  return data;
}

export const defaultBaseURL = '/files';

export default function getClient(): AxiosInstance {
  // Check if instance is already created
  if (!instance) {
    // Create instance
    instance = axios.create({
      baseURL: ExtraJS.getBaseURL ? ExtraJS.getBaseURL() : defaultBaseURL,
      headers: {
        Accept: 'application/json',
        ...(ExtraJS.getExtraHeaders ? ExtraJS.getExtraHeaders() : {}),
      },
      transformResponse: ExtraJS.getAxiosTransformResponse
        ? ExtraJS.getAxiosTransformResponse
        : defaultTransformResponse,
    });
  }

  // Return instance
  return instance;
}
