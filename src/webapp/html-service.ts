/**
 * HTML Service - Webアプリケーション配信
 */

/**
 * Webアプリのメインページ作成
 */
export function createWebApp(): GoogleAppsScript.HTML.HtmlOutput {
    const template = HtmlService.createTemplateFromFile('index');
  
    // テンプレート変数設定（必要に応じて）
    template.appTitle = '部活予定表カレンダー連携システム';
    template.version = '1.0.0';
  
    const htmlOutput = template.evaluate()
      .setTitle('部活予定表システム')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  
    return htmlOutput;
  }
  
  /**
   * HTMLファイルの内容を取得（CSS/JS include用）
   */
  export function include(filename: string): string {
    try {
      return HtmlService.createHtmlOutputFromFile(filename).getContent();
    } catch (error) {
      console.error(`ファイル読み込みエラー: ${filename}`, error);
      return `<!-- Error loading ${filename} -->`;
    }
  }
  
  /**
   * 初期データ取得（認証状態、カレンダー一覧等）
   */
  export function getInitialData(): object {
    try {
      const { getCurrentUser, getUserCalendars, isUserAuthenticated } = require('./auth/user-manager');
  
      if (!isUserAuthenticated()) {
        return {
          authenticated: false,
          error: 'ユーザー認証が必要です'
        };
      }
  
      const user = getCurrentUser();
      const calendars = getUserCalendars();
  
      return {
        authenticated: true,
        user: user,
        calendars: calendars,
        timestamp: new Date().toISOString()
      };
  
    } catch (error) {
      return {
        authenticated: false,
        error: error instanceof Error ? error.message : '初期化エラー'
      };
    }
  }
  