/**
 * Webアプリケーションのエントリーポイント
 * GASから直接呼び出される関数
 */

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

/**
 * フロントからファイルを受け取り、Driveに一時保存→Spreadsheet変換
 */
function uploadExcelFile(form: { dataUrl: string, fileName: string, mimeType: string }) {
  // DataURLからbase64部分を抽出
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
 * Googleアカウントの名前とメールアドレスを返す
 */
function getLoginUser(): { name: string, mail: string } {
  const user = Session.getActiveUser();
  const mail = user.getEmail();
  // GASのSession.getActiveUser()では名前は取得できないため、メールの@前を仮の名前とする
  const name = mail ? mail.split('@')[0] : '';
  return { name, mail };
}