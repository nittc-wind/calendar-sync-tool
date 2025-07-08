/**
 * スプレッドシートをJSONに変換する機能
 */

import { SpreadsheetData, JsonConversionOptions, JsonConversionResult } from '../types/json-converter-types.js';

/**
 * スプレッドシートをJSONに変換する
 */
export function convertSpreadsheetToJson(
  spreadsheetId: string, 
  options: JsonConversionOptions = {}
): JsonConversionResult {
  try {
    // スプレッドシートを開く
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    if (!spreadsheet) {
      return {
        success: false,
        error: 'スプレッドシートが見つかりません'
      };
    }

    // 最初のシートを取得
    const sheet = spreadsheet.getSheets()[0];
    if (!sheet) {
      return {
        success: false,
        error: 'シートが見つかりません'
      };
    }

    // データ範囲を取得
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    
    if (lastRow === 0 || lastCol === 0) {
      return {
        success: false,
        error: 'データが存在しません'
      };
    }

    // ヘッダー行を取得
    const headerRange = sheet.getRange(1, 1, 1, lastCol);
    const headers = headerRange.getValues()[0].map((cell: any) => 
      cell ? String(cell).trim() : ''
    );

    // データ行を取得
    const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
    const rawData = dataRange.getValues();

    // データを整形
    const rows = rawData.map((row: any[]) => {
      const rowData: { [key: string]: any } = {};
      headers.forEach((header: string, index: number) => {
        if (header) {
          const value = row[index];
          rowData[header] = formatCellValue(value, options);
        }
      });
      return rowData;
    });

    // 結果を生成
    let resultData: any;
    
    if (options.format === 'object') {
      // オブジェクト形式（ヘッダーをキーとして使用）
      resultData = rows;
    } else {
      // 配列形式（デフォルト）
      resultData = rows;
    }

    return {
      success: true,
      data: resultData,
      rowCount: rows.length,
      columnCount: headers.length
    };

  } catch (error) {
    console.error('JSON変換エラー:', error);
    return {
      success: false,
      error: `変換エラー: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * セルの値を適切な形式に変換
 */
function formatCellValue(value: any, options: JsonConversionOptions): any {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // 日付形式の処理
  if (value instanceof Date) {
    if (options.dateFormat) {
      // カスタム日付形式
      return Utilities.formatDate(value, Session.getScriptTimeZone(), options.dateFormat);
    } else {
      // ISO形式
      return value.toISOString().split('T')[0];
    }
  }

  // 数値の処理
  if (typeof value === 'number') {
    return value;
  }

  // 文字列の処理
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return null;
    }
    return trimmed;
  }

  // その他の型
  return String(value);
}

/**
 * スプレッドシートの基本情報を取得
 */
export function getSpreadsheetInfo(spreadsheetId: string): {
  success: boolean;
  name?: string;
  sheetCount?: number;
  error?: string;
} {
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    if (!spreadsheet) {
      return {
        success: false,
        error: 'スプレッドシートが見つかりません'
      };
    }

    return {
      success: true,
      name: spreadsheet.getName(),
      sheetCount: spreadsheet.getSheets().length
    };
  } catch (error) {
    return {
      success: false,
      error: `情報取得エラー: ${error instanceof Error ? error.message : String(error)}`
    };
  }
} 