export enum FileTypes {
  /* eslint-disable prettier/prettier */
  // image formats
  PNG      = 'image/png',
  JPEG     = 'image/jpeg',
  JPG      = 'image/jpg',
  GIF      = 'image/gif',
  WEBP     = 'image/webp',
  BITMAP   = 'image/bitmap',
  TIFF     = 'image/tiff',
  HEIC     = 'image/heic',

  // video formats
  MP4     = 'video/MP4',
  AVI     = 'video/AVI',
  MOV     = 'video/MOV',
  WMV     = 'video/WMV',
  WEBM    = 'video/WEBM',
  FLV     = 'video/FLV',
  MPEG    = 'video/MPEG',
  MKV     = 'video/MKV',
  OGG     = 'video/OGG',

  // document formats
  DOC     = 'document/doc',
  CSV     = 'document/csv',
  XLS     = 'document/xls',
  XLSX    = 'document/xlsx',
  TXT     = 'document/txt',
  DOCX    = 'document/docx',
  PPT     = 'document/ppt',
  PPI     = 'document/ppi',
  ODT     = 'document/odt',

  // application format
  PDF     = 'application/pdf',
  /* eslint-enable prettier/prettier */
}

export const ImageFileTypes: FileTypes[] = Object.values(FileTypes).filter((fileType) => fileType.startsWith('image/'))
export const VideoFileTypes: FileTypes[] = Object.values(FileTypes).filter((fileType) => fileType.startsWith('video/'))
export const DocumentsFileTypes: FileTypes[] = Object.values(FileTypes).filter((fileType) => fileType.startsWith('document/'))
export const ApplicationsFileTypes: FileTypes[] = Object.values(FileTypes).filter((fileType) => fileType.startsWith('application/'))
