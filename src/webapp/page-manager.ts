/**
 * ページ管理 - 各画面の生成とデータ渡し
 */

export type PageType = 'upload' | 'preview' | 'calendar' | 'result';

export interface PageData {
  pageType: PageType;
  title: string;
  stepNumber: number;
  data?: any;
  user?: any;
}

/**
 * 指定された画面のHTMLを生成
 */
export function createPage(
  pageType: PageType,
  data: any = {}
): GoogleAppsScript.HTML.HtmlOutput {
  const template = HtmlService.createTemplateFromFile('index');

  // 共通データ設定
  template.pageType = pageType;
  template.stepNumber = getStepNumber(pageType);
  template.pageTitle = getPageTitle(pageType);
  template.currentUser = getCurrentUserSafe();

  // ページ固有データ設定
  template.pageData = JSON.stringify(data);

  return template
    .evaluate()
    .setTitle(`${template.pageTitle} - 部活予定表システム`)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getStepNumber(pageType: PageType): number {
  const steps = { upload: 1, preview: 2, calendar: 3, result: 4 };
  return steps[pageType] || 1;
}

function getPageTitle(pageType: PageType): string {
  const titles = {
    upload: 'ファイルアップロード',
    preview: 'データプレビュー',
    calendar: 'カレンダー選択',
    result: '処理結果',
  };
  return titles[pageType] || 'エラー';
}

function getCurrentUserSafe(): any {
  try {
    const user = Session.getActiveUser();
    const email = user.getEmail();

    // メールアドレスが取得できない場合の処理
    if (!email) {
      console.warn('ユーザーメールアドレスが取得できません');
      return { email: '', name: 'ゲスト' };
    }

    // メールアドレスからユーザー名部分を抽出（@より前の部分）
    const name = email.split('@')[0];

    // ユーザー名が空の場合の処理
    if (!name) {
      console.warn('ユーザー名の抽出に失敗しました');
      return { email: email, name: 'ゲスト' };
    }

    return {
      email: email,
      name: name,
    };
  } catch (error) {
    console.error('ユーザー情報取得エラー:', error);
    return { email: '', name: 'ゲスト' };
  }
}
