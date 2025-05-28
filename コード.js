// Code.gs（最初に作成）
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('部活スケジュール管理')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// テスト用：ファイル受信確認
function receiveFile(fileData, fileName) {
  console.log('受信ファイル:', fileName);
  console.log('ファイルサイズ:', fileData.length);
  return {
    success: true,
    message: `ファイル「${fileName}」を受信しました（${fileData.length}バイト）`
  };
}