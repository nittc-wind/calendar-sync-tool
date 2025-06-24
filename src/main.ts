/**
 * 最小限のメインエントリーポイント
 * まずはHTMLレンダリングのみを確認
 */

/**
 * Webアプリケーションのエントリーポイント
 * GASから直接呼び出される関数
 */
import { createPage } from './webapp/page-manager';

function doGet(): GoogleAppsScript.HTML.HtmlOutput {
    try {
        return showUploadPage();
        /*
      // 最もシンプルなHTML出力
      const htmlOutput = HtmlService.createTemplateFromFile('index');
      
      return htmlOutput.evaluate()
        .setTitle('部活予定表システム')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        */
        
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

  /**
   * 1. アップロード画面表示
   */
  function showUploadPage(): GoogleAppsScript.HTML.HtmlOutput {
    return createPage('upload');
  }
  
  /**
   * 2. プレビュー画面表示
   */
  function showPreviewPage(fileData: any): GoogleAppsScript.HTML.HtmlOutput {
    return createPage('preview', { fileData });
  }
  
  /**
   * 3. カレンダー選択画面表示
   */
  function showCalendarPage(eventsData: any): GoogleAppsScript.HTML.HtmlOutput {
    return createPage('calendar', { eventsData });
  }
  
  /**
   * 4. 結果画面表示
   */
  function showResultPage(results: any): GoogleAppsScript.HTML.HtmlOutput {
    return createPage('result', { results });
  }
  
  // グローバル関数として公開
  declare global {
    function showUploadPage(): GoogleAppsScript.HTML.HtmlOutput;
    function showPreviewPage(fileData: any): GoogleAppsScript.HTML.HtmlOutput;
    function showCalendarPage(eventsData: any): GoogleAppsScript.HTML.HtmlOutput;
    function showResultPage(results: any): GoogleAppsScript.HTML.HtmlOutput;
  }