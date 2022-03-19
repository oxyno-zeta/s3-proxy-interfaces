import React, { ReactNode } from 'react';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import TextFileIcon from '@mui/icons-material/TextSnippet';
import PDFFileIcon from '@mui/icons-material/PictureAsPdf';
import PictureFileIcon from '@mui/icons-material/InsertPhoto';
import ArchiveFileIcon from '@mui/icons-material/FolderZip';

const textFileRegex = /\.(txt|ini|yaml|yml|md)/;
const pdfFileRegex = /\.(pdf)/;
const pictureFileRegex = /\.(png|jpg|jpeg|svg|gif)/;
const archiveFileRegex = /\.(zip|tar|tar\.gz|rar|7z|tgz)/;

const iconsMatcherList = [
  { regex: textFileRegex, iconElement: <TextFileIcon /> },
  { regex: pdfFileRegex, iconElement: <PDFFileIcon /> },
  { regex: pictureFileRegex, iconElement: <PictureFileIcon /> },
  { regex: archiveFileRegex, iconElement: <ArchiveFileIcon /> },
];

export function getFileIconFromExtension(path: string): ReactNode {
  // Loop over regex to icons map
  for (let i = 0; i < iconsMatcherList.length; i += 1) {
    // Create variable
    const item = iconsMatcherList[i];
    // Check if it is matching
    if (path.match(item.regex)) {
      return item.iconElement;
    }
  }

  return <FileIcon />;
}

export function base64Encode(str: string) {
  return window.btoa(encodeURIComponent(str));
}

export function base64Decode(str: string) {
  return decodeURIComponent(window.atob(str));
}
