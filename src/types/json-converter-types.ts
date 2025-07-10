/**
 * JSON変換機能用の型定義
 */

/**
 * スプレッドシートの行データ
 */
export interface SpreadsheetRow {
  [key: string]: string | number | boolean | null;
}

/**
 * スプレッドシートの全体データ
 */
export interface SpreadsheetData {
  headers: string[];
  rows: SpreadsheetRow[];
  sheetName: string;
}

/**
 * JSON変換オプション
 */
export interface JsonConversionOptions {
  includeHeaders?: boolean;
  format?: 'array' | 'object';
  dateFormat?: string;
  timeFormat?: string;
}

/**
 * JSON変換結果
 */
export interface JsonConversionResult {
  success: boolean;
  data?: any;
  error?: string;
  rowCount?: number;
  columnCount?: number;
}

/**
 * 変換処理の進行状況
 */
export interface ConversionProgress {
  stage: 'reading' | 'parsing' | 'converting' | 'completed';
  message: string;
  percentage: number;
  currentRow?: number;
  totalRows?: number;
} 