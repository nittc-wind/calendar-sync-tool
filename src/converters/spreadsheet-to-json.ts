/**
 * スプレッドシートをJSONに変換する機能
 */

import { JsonConversionOptions, JsonConversionResult } from '../types/json-converter-types.js';

/**
 * スプレッドシートをJSONに変換する（convertJson.jsロジック準拠）
 */
export function convertSpreadsheetToJson(
  spreadsheetId: string,
  options: JsonConversionOptions = {}
): JsonConversionResult {
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    if (!spreadsheet) {
      return { success: false, error: 'スプレッドシートが見つかりません' };
    }
    const sheet = spreadsheet.getSheets()[0];
    if (!sheet) {
      return { success: false, error: 'シートが見つかりません' };
    }

    const startRow = 7; // 1-indexed, 7行目から
    const numRows = 31; // 最大31日分
    const numCols = 9;  // 9列分
    const values = sheet.getRange(startRow, 1, numRows, numCols).getValues();
    const result: { data_row: any[] }[] = [];

    for (let r = 0; r < numRows; ++r) {
      const row = values[r];
      let data_row = new Array(numCols);
      let flag = false;
      for (let c = 0; c < numCols; ++c) {
        switch (c) {
          case 0: // 日付（Excelシリアル値→UNIX秒）
            const date = row[c];
            if (date === '' || date === null || date === undefined) {
              flag = true;
              break;
            }
            data_row[c] = excelSerialToUnixTime(date);
            break;
          case 2:
          case 3:
            data_row[c] = TorF(row[c]);
            break;
          default:
            data_row[c] = (row[c] !== undefined && row[c] !== null) ? row[c] : '';
            break;
        }
      }
      if (data_row[3] === false) {
        continue;
      }
      if (flag) {
        break;
      }
      result.push({ data_row });
    }

    return {
      success: true,
      data: result,
      rowCount: result.length,
      columnCount: numCols
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
 * Excelシリアル値→UNIXタイムスタンプ（秒）
 */
function excelSerialToUnixTime(excelTime: number): number {
  return Math.round((excelTime - 25569) * 86400);
}

/**
 * ○→true, ✖→false, 文字列があればtrue, 空文字列/undefined/nullはfalse
 */
function TorF(char: any): boolean {
  if (char === '○') return true;
  if (char === '✖') return false;
  if (typeof char === 'string' && char.trim() !== '') return true;
  return false;
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