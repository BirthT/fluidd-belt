import { KlipperFileMeta, Thumbnail } from './types.metadata'
import { HistoryItem } from '@/store/history/types'
import { CancelTokenSource } from 'axios'

export type { KlipperFileMeta, Thumbnail }

export interface FilesState {
  uploads: FilesUpload[];
  download: FileDownload | null;
  fileTransferCancelTokenSource: CancelTokenSource | null;
  currentPaths: Record<string, string>;
  disk_usage: DiskUsage;
  rootFiles: Record<string, MoonrakerRootFile[] | undefined>;
  pathFiles: Record<string, MoonrakerPathContent | undefined>;
}

export interface DiskUsage {
  total: number;
  used: number;
  free: number;
}

export interface MoonrakerPathContent {
  files: (KlipperFile | KlipperFileWithMeta) []
  dirs: KlipperDir[]
}

export interface KlipperFile {
  filename: string;
  modified: number | string;
  size: number;
  permissions?: '' | 'r' | 'rw';
  print_start_time?: number | null;
  job_id?: string | null;
}

export interface KlipperFileWithMeta extends KlipperFile, KlipperFileMeta {
}

export interface KlipperDir {
  dirname: string;
  modified: number | string;
  size: number;
  permissions?: '' | 'r' | 'rw';
}

export interface AppFile extends KlipperFile {
  type: 'file';
  name: string;
  extension: string;
  path: string;
  modified: number;
}

export interface AppFileWithMeta extends AppFile, KlipperFileMeta {
  history: HistoryItem;
}

export interface AppDirectory extends KlipperDir {
  type: 'directory';
  name: string;
  modified: number;
}

export interface FileMetaDataSocketResponse {
  estimated_time: string;
}

export interface FileChangeSocketResponse {
  action: string;
  item: FileChangeItem;
  source_item?: FileChangeItem;
}

export interface FileChangeItem {
  root: string;
  path: string;
  modified: number;
  size: number;
}

export interface FilePaths {
  filename: string;
  path: string;
  rootPath: string;
}

export interface FileUpdate {
  paths: FilePaths;
  file: Partial<KlipperFile | KlipperFileWithMeta> & { filename: string; };
  root: string;
}

export interface FileDownload {
  filepath: string;
  size: number;
  loaded: number;
  percent: number;
  speed: number;
  unit: string;
}

export interface FilesUpload extends FileDownload {
  complete: boolean; // indicates moonraker is finished with the file.
  cancelled: boolean; // in a cancelled state, don't show - nor try to upload.
}

export type FileFilterType = 'print_start_time' | 'hidden_files' | 'klipper_backup_files' | 'rolled_log_files'

export type FileBrowserEntry = AppFile | AppFileWithMeta | AppDirectory

export interface FilePreviewState {
  open: boolean;
  filename: string;
  src: string;
  type: string;
  appFile?: AppFile;
  width?: number;
}

export interface MoonrakerRootFile {
  path: string;
  modified: number;
  size: number;
  permissions: string;
}
