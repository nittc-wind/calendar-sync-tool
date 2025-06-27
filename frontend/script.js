/**
 * 部活予定表システム - 共通JavaScript
 * CSS画面遷移システム
 */

// ===========================================
// 1. 画面遷移システム
// ===========================================

// 全ページコンテナを取得
const pages = Array.from(document.querySelectorAll('.page-container'));

/**
 * ページ切り替え処理（メイン関数）
 * @param {string} pageName - 表示したいページのID
 * @description CSSクラスの切り替えによる画面遷移を実行
 */
function switchPage(pageName) {
    console.log(`画面遷移: ${pageName}`);
    
    // ページ名の正規化
    pageName = normalizePageName(pageName);
    
    // ページ存在確認
    if (!isValidPage(pageName)) {
        console.warn(`ページが見つかりません: ${pageName}`);
        pageName = 'error';
    }
    
    // 画面切り替え実行
    activatePage(pageName);
    
    // ステップナビゲーション更新
    updateStepNavigation(pageName);
    
    console.log(`画面遷移完了: ${pageName}`);
}

/**
 * ページ名の正規化
 * @param {string} pageName - 入力されたページ名
 * @returns {string} 正規化されたページ名
 */
function normalizePageName(pageName) {
    // 未指定の場合はアップロード画面を表示
    if (!pageName || pageName === '' || pageName === '#') {
        return 'upload';
    }
    
    // #記号を除去
    return pageName.replace('#', '');
}

/**
 * ページの存在確認
 * @param {string} pageName - ページ名
 * @returns {boolean} ページが存在するかどうか
 */
function isValidPage(pageName) {
    return pages.some(page => page.id === pageName);
}

/**
 * 指定されたページをアクティブにする
 * @param {string} pageName - アクティブにするページ名
 */
function activatePage(pageName) {
    pages.forEach(page => {
        if (page.id === pageName) {
            page.classList.add('isActive');
            console.log(`ページをアクティブ化: ${page.id}`);
        } else {
            page.classList.remove('isActive');
        }
    });
}

/**
 * ステップナビゲーションの更新
 * @param {string} pageName - 現在のページ名
 */
function updateStepNavigation(pageName) {
    // ページとステップ番号の対応
    const pageStepMap = {
        'login': 0,
        'upload': 1,
        'processing': 2,
        'preview': 2,
        'sync': 3,
        'result': 4,
        'error': 0
    };
    
    const currentStep = pageStepMap[pageName] || 0;
    
    // ステップ要素を更新（将来的に実装）
    // この部分は後輩がナビゲーション実装時に使用
    console.log(`現在のステップ: ${currentStep}`);
}

// ===========================================
// 2. アプリケーション初期化
// ===========================================

/**
 * アプリケーション初期化処理
 * @description ページ読み込み完了時に実行される
 */
function initializeApp() {
    console.log('アプリケーション初期化開始');
    
    // デバッグリンクのイベントハンドラー設定
    setupDebugLinks();
    
    // 初期ページの表示
    initializeFirstPage();
    
    console.log('アプリケーション初期化完了');
}

/**
 * 初期ページの設定
 * @description URLハッシュまたはデフォルトページを表示
 */
function initializeFirstPage() {
    google.script.url.getLocation(location => {
        console.log('初期URL取得:', location);
        switchPage(location.hash);
    });
}

// ===========================================
// 3. ブラウザ履歴・ナビゲーション
// ===========================================

/**
 * ブラウザバック・フォワード時の処理
 * @description ブラウザの戻る/進むボタン対応
 */
google.script.history.setChangeHandler(e => {
    console.log('履歴変更検出:', e.location);
    switchPage(e.location.hash);
});

/**
 * デバッグリンクの設定
 * @description フッターのデバッグリンク用イベントハンドラー
 */
function setupDebugLinks() {
    const debugLinks = document.getElementsByClassName('link-btn');
    
    Array.from(debugLinks).forEach(link => {
        link.addEventListener('click', handleDebugLinkClick);
    });
    
    console.log(`デバッグリンク設定完了: ${debugLinks.length}個`);
}

/**
 * デバッグリンククリック処理
 * @param {Event} e - クリックイベント
 */
function handleDebugLinkClick(e) {
    e.preventDefault(); // aタグのデフォルト動作を無効化
    
    const pageName = e.target.getAttribute('href');
    console.log(`デバッグリンククリック: ${pageName}`);
    
    // ページ切り替え
    switchPage(pageName);
    
    // ブラウザ履歴に追加
    google.script.history.push(null, { page: pageName });
}

// ===========================================
// 4. ユーティリティ関数
// ===========================================

/**
 * プログラム的なページ遷移
 * @param {string} pageName - 遷移先ページ名
 * @param {boolean} addToHistory - 履歴に追加するかどうか（デフォルト: true）
 * @description 他の処理からページ遷移を実行する際に使用
 */
function navigateToPage(pageName, addToHistory = true) {
    console.log(`プログラム的ページ遷移: ${pageName}`);
    
    switchPage(pageName);
    
    if (addToHistory) {
        google.script.history.push(null, { page: pageName });
    }
}

/**
 * 現在のページ名を取得
 * @returns {string} 現在アクティブなページ名
 */
function getCurrentPage() {
    const activePage = pages.find(page => page.classList.contains('isActive'));
    return activePage ? activePage.id : 'upload';
}

/**
 * 利用可能なページ一覧を取得
 * @returns {Array<string>} ページIDの配列
 */
function getAvailablePages() {
    return pages.map(page => page.id);
}

// ===========================================
// 5. DOMContentLoaded時の初期化
// ===========================================

// DOM読み込み完了時にアプリケーションを初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM読み込み完了');
    initializeApp();
});

// 後輩向けの開発用関数をグローバルに公開
window.switchPage = switchPage;
window.navigateToPage = navigateToPage;
window.getCurrentPage = getCurrentPage;
window.getAvailablePages = getAvailablePages;

console.log('部活予定表システム JavaScript読み込み完了');