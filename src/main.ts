/**
 * Webアプリケーションのエントリーポイント
 * GASから直接呼び出される関数
 */

function doGet(): GoogleAppsScript.HTML.HtmlOutput {
    try {
      // 最もシンプルなHTML出力
      const htmlOutput = HtmlService.createTemplateFromFile('index');
      return htmlOutput.evaluate().setTitle('部活予定表システム')
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
