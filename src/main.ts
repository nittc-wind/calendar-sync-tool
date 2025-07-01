/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Webアプリケーションのエントリーポイント
 * GASから直接呼び出される関数
 */

function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  const htmlOutput = HtmlService.createTemplateFromFile('index');
  return htmlOutput.evaluate().setTitle('部活予定表システム');
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

/**
 * フロントからファイルを受け取り、Driveに一時保存→Spreadsheet変換
 */
function uploadExcelFile(form: {
  dataUrl: string;
  fileName: string;
  mimeType: string;
}) {
  // DataURLからbase64部分を抽出
  const base64 = form.dataUrl.split(',')[1];
  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64),
    form.mimeType,
    form.fileName
  );

  // 一時的にDriveへ保存
  const tempFile = DriveApp.createFile(blob);
  // Spreadsheetへ変換
  const resource = {
    name: tempFile.getName(),
    mimeType: MimeType.GOOGLE_SHEETS,
    parents: [{ id: DriveApp.getRootFolder().getId() }],
  };
  // Drive APIで変換
  // @ts-ignore
  const file = Drive.Files.create(resource, tempFile.getBlob());
  // 一時ファイル削除
  tempFile.setTrashed(true);
  return file.id; // 変換後のSpreadsheetのID
}
