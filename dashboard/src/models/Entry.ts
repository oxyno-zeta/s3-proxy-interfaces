export interface Entry {
  name: string;
  path: string;
  type: string;
  size: number;
  lastModified: string;
}
export const FOLDER_TYPE = 'FOLDER';
export const FILE_TYPE = 'FILE';
