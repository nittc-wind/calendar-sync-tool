/**
 * Webアプリケーションのエントリーポイント
 * GASから直接呼び出される関数
 */

import { convertSpreadsheetToJson, getSpreadsheetInfo } from './converters/spreadsheet-to-json.js';
import { getGoogleCalendars } from './webapp/google-calendar-api.js';

// @ts-ignore
globalThis.getGoogleCalendars = getGoogleCalendars;

function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  const htmlOutput = HtmlService.createTemplateFromFile('index');
  return htmlOutput.evaluate().setTitle('部活予定表システム')
}

/**
 * HTMLファイルの内容を取得（include用）
 */
function include(filename: string): string {
  try {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  } catch (error) {
    console.error(`ファイル読み込みエラー: ${filename}`, error);
    return `<!-- Error loading ${filename}: ${error} -->`;
  }
}

/**
 * テスト用の簡単な関数
 */
function testFunction(): string {
  return 'Hello from GAS!';
}


let progressMessage = '';
function getProcessingProgress():string{
  return progressMessage;
}

/**
 * フロントからファイルを受け取り、Driveに一時保存→Spreadsheet変換
 */
function uploadExcelFile(form: { dataUrl: string, fileName: string, mimeType: string }) {
  // DataURLからbase64を抽出
  progressMessage = "データを取得中..."
  const base64 = form.dataUrl.split(',')[1];
  const blob = Utilities.newBlob(Utilities.base64Decode(base64), form.mimeType, form.fileName);
  // 一時的にDriveへ保存
  const tempFile = DriveApp.createFile(blob);
  // Spreadsheetへ変換
  const resource = {
    name: tempFile.getName(),
    mimeType: MimeType.GOOGLE_SHEETS,
    parents: [{ id: DriveApp.getRootFolder().getId() }]
  };
  // Drive APIで変換
  // @ts-ignore
  const file = Drive.Files.create(resource, tempFile.getBlob());
  // 一時ファイル削除
  tempFile.setTrashed(true);
  
 return file.id; // 変換後のSpreadsheetのID
}

/**
 * スプレッドシートをJSONに変換する
 * フロントエンドから呼び出される
 */
function convertSpreadsheetToJsonForFrontend(spreadsheetId: string, options?: any) {
  progressMessage = 'ファイルを変換中...';
  try {
    const result = convertSpreadsheetToJson(spreadsheetId, options);
    
    if (result.success) {
      return {
        success: true,
        data: JSON.stringify(result.data, null, 2), // 整形されたJSON文字列
        rowCount: result.rowCount,
        columnCount: result.columnCount
      };
    } else {
      return {
        success: false,
        error: result.error
      };
    }
  } catch (error) {
    console.error('JSON変換エラー:', error);
    return {
      success: false,
      error: `変換処理エラー: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * スプレッドシートの基本情報を取得
 * フロントエンドから呼び出される
 */
function getSpreadsheetInfoForFrontend(spreadsheetId: string) {
  try {
    progressMessage = '処理が完了しました!'
    const result = getSpreadsheetInfo(spreadsheetId);
    return result;
  } catch (error) {
    console.error('スプレッドシート情報取得エラー:', error);
    return {
      success: false,
      error: `情報取得エラー: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
