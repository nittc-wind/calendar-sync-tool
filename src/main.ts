/**
 * Webアプリケーションのエントリーポイント
 * GASから直接呼び出される関数
 */
import "./auth";
import "./auth-lite";

function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  try {
    const user = Session.getActiveUser();
    const email: string = user.getEmail();
    if(email) {
      return HtmlService.createTemplateFromFile('index')
        .evaluate()
        .setTitle('部活予定表システム')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    } else {
      return showLoginPage();
    }
  } catch (error) {
      console.error('doGet エラー:', error);
      
      // エラー時のフォールバック
      return HtmlService.createHtmlOutput(`
        <html>
          <body>
            <h1>エラーが発生しました</h1>
            <p>システムの初期化に失敗しました。</p>
            <p>エラー: ${error}</p>
          </body>
        </html>
      `).setTitle('エラー');
    }
  }

  function showLoginPage() {
    return HtmlService.createTemplateFromFile('login')
      .evaluate()
      .setTitle('ログイン - 部活予定表システム')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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