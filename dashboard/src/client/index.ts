import axios, { AxiosInstance } from 'axios';

let instance: AxiosInstance | null = null;

export default function generate(): AxiosInstance {
  // Check if instance is already created
  if (!instance) {
    // Create instance
    instance = axios.create({
      baseURL: '/files',
      headers: { Accept: 'application/json' },
    });
  }

  // Return instance
  return instance;
}
